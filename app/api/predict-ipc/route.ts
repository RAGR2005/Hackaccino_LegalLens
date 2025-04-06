import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

const execAsync = promisify(exec)

interface PredictionResult {
  case_text: string;
  predicted_section: string;
  confidence: number;
  parties: string[];
  explanation: string;
  recommendations: string[];
  debug: {
    prediction_idx: number;
    original_section: string;
    top_probs: [string, number][];
  };
}

export async function POST(request: Request) {
  console.log("API route started")
  try {
    const body = await request.json()
    console.log("Received request body:", body)
    
    const { caseDescription, crimeType, location, date, evidence } = body
    
    if (!caseDescription || !crimeType || !location || !date) {
      console.log("Missing required fields")
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    // Create a unique input file
    const inputFileName = `input_${uuidv4()}.txt`
    const inputFilePath = path.join(process.cwd(), "legal_model", inputFileName)
    console.log("Input file path:", inputFilePath)
    
    try {
      // Format the input with all the details
      const formattedInput = `Crime Type: ${crimeType}
Location: ${location}
Date: ${date}
Evidence: ${evidence.join(", ")}
Case Description: ${caseDescription}`

      // Write the formatted input to the file
      await fs.promises.writeFile(inputFilePath, formattedInput, "utf8")
      console.log("Case details written to file")
      
      // Change to the legal_model directory and execute the script
      const cwd = path.join(process.cwd(), "legal_model")
      console.log("Working directory:", cwd)
      
      const command = `cd "${cwd}" && python direct_analyze.py "${inputFileName}"`
      console.log("Executing command:", command)
      
      const { stdout, stderr } = await execAsync(
        command,
        { 
          timeout: 30000,
          cwd: cwd
        }
      )
      
      // Log any stderr output
      if (stderr) {
        console.log("Python script stderr:", stderr)
      }

      console.log("Python script raw stdout:", stdout)
      
      try {
        // Ensure we have output to parse
        if (!stdout.trim()) {
          throw new Error("No output received from Python script")
        }

        // Parse the JSON output
        let rawResult
        try {
          rawResult = JSON.parse(stdout.trim())
        } catch (parseError) {
          console.error("Failed to parse Python output:", parseError)
          console.error("Raw output:", stdout)
          throw new Error("Invalid JSON output from Python script")
        }

        if (!rawResult || typeof rawResult !== 'object') {
          throw new Error("Invalid response format from Python script")
        }

        console.log("Parsed Python output:", rawResult)
        
        // Process recommendations
        let recommendations: string[] = []
        if (typeof rawResult.recommendations === 'string') {
          recommendations = rawResult.recommendations
            .split('\n')
            .filter((line: string) => line.trim() && !line.startsWith('Recommendations:'))
            .map((line: string) => line.trim().replace(/^- /, ''))
        } else if (Array.isArray(rawResult.recommendations)) {
          recommendations = rawResult.recommendations
        }

        // Process explanation
        let explanation = rawResult.explanation
        if (typeof explanation === 'string') {
          explanation = explanation
            .split('\n')
            .filter(line => line.trim())
            .join('\n')
        }

        // Format the result to match the expected structure
        const result: PredictionResult = {
          case_text: caseDescription,
          predicted_section: rawResult.predicted_section,
          confidence: rawResult.confidence,
          parties: Array.isArray(rawResult.parties) ? rawResult.parties : [],
          explanation: explanation || '',
          recommendations: recommendations,
          debug: {
            prediction_idx: rawResult.debug?.prediction_idx || 0,
            original_section: rawResult.debug?.original_section || '',
            top_probs: rawResult.debug?.top_probs?.map(([section, prob]: [string, number]) => [
              section,
              prob
            ]) || []
          }
        }
        
        console.log("Final formatted result:", result)
        
        // Clean up the input file
        await fs.promises.unlink(inputFilePath).catch(error => {
          console.error("Error cleaning up input file:", error)
        })
        
        return NextResponse.json(result)
        
      } catch (parseError: any) {
        console.error("Error parsing Python output:", parseError)
        console.error("Raw output:", stdout)
        throw new Error(`Failed to parse Python script output: ${parseError.message}`)
      }
      
    } catch (error: any) {
      console.error("Error executing Python script:", error)
      console.error("Error details:", {
        message: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      })
      
      // Clean up the input file in case of error
      await fs.promises.unlink(inputFilePath).catch(console.error)
      
      if (error.code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Analysis timed out. Please try again." },
          { status: 504 }
        )
      }
      
      return NextResponse.json(
        { 
          error: "Failed to get predictions", 
          details: error.message,
          stdout: error.stdout,
          stderr: error.stderr
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    )
  }
}

