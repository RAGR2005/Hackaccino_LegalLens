import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import * as path from "path"
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      complainantName,
      complainantAddress,
      complainantPhone,
      incidentDate,
      incidentTime,
      incidentLocation,
      incidentDescription,
      suspectDetails,
      witnesses,
      crimeType,
      formattedIncidentDate,
      formattedCurrentDate
    } = data

    // Prepare the input text for the AI model
    const inputText = `
Crime Type: ${crimeType}
Incident Description: ${incidentDescription}
Location: ${incidentLocation}
Date and Time: ${incidentDate} ${incidentTime}
Suspect Details: ${suspectDetails}
Witness Information: ${witnesses}
`

    // Create a unique input file for this request
    const inputFileName = `fir_input_${uuidv4()}.txt`
    const inputFilePath = path.join(process.cwd(), "legal_model", inputFileName)

    // Write the input to a file
    fs.writeFileSync(inputFilePath, inputText, "utf-8")

    // Run the Python script to analyze the case
    const scriptPath = path.join(process.cwd(), "legal_model", "direct_analyze.py")
    console.log("Running Python script:", scriptPath)
    console.log("Input file:", inputFilePath)
    
    const { stdout, stderr } = await execAsync(
      `python ${scriptPath} "${inputFilePath}"`
    )

    // Clean up the input file
    fs.unlinkSync(inputFilePath)

    if (stderr) {
      console.error("Error from Python script:", stderr)
      throw new Error("Failed to analyze case")
    }

    console.log("Python script output:", stdout)

    // Parse the Python script output
    const result = JSON.parse(stdout)

    // Generate the FIR draft using the AI analysis and pre-formatted dates
    const firDraft = `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C)

Date: ${formattedIncidentDate}
Time: ${incidentTime}

To,
The Station House Officer
[Police Station Name]
[City]

Subject: FIR regarding ${crimeType.toLowerCase()} incident - IPC Section ${result.predicted_section}

Sir/Madam,

I, ${complainantName}, residing at ${complainantAddress}, would like to report the following incident:

On ${formattedIncidentDate} at approximately ${incidentTime}, at ${incidentLocation}, the following incident occurred:

${incidentDescription}

Based on the incident details, this case appears to fall under IPC Section ${result.predicted_section}.
${result.explanation}

Details of suspect(s):
${suspectDetails}

Witness Information:
${witnesses}

I can be contacted at: ${complainantPhone}

Legal Analysis and Recommendations:
${result.recommendations.join('\n')}

I hereby declare that all the information provided above is true to the best of my knowledge.

Yours faithfully,
${complainantName}
Date: ${formattedCurrentDate}
Place: ${incidentLocation.split(',')[0]}

Note: This is a computer-generated draft FIR. Please verify all details before submission.`

    return NextResponse.json({
      success: true,
      firDraft,
      analysis: {
        predictedSection: result.predicted_section,
        explanation: result.explanation,
        recommendations: result.recommendations
      }
    })

  } catch (error: any) {
    console.error("Error generating FIR:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate FIR draft",
        details: error.message 
      },
      { status: 500 }
    )
  }
} 