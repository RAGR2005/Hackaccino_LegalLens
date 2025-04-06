import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { caseDescription, crimeType, location, date, evidence } = body

    if (!caseDescription || !crimeType || !location || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format the prompt for the Ollama model
    const prompt = `Analyze the following legal case and provide IPC section predictions:
Case Type: ${crimeType}
Location: ${location}
Date: ${date}
Evidence Available: ${evidence.join(", ")}
Case Description: ${caseDescription}

Please provide:
1. The most relevant IPC section
2. Confidence level (as a percentage)
3. Legal explanation
4. Recommendations for next steps`

    // Call Ollama API (running locally)
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "pinggg-legal:latest",
        prompt: prompt,
        stream: false
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error("Failed to get prediction from Ollama model")
    }

    const ollamaData = await ollamaResponse.json()

    // Parse the Ollama response and extract relevant information
    const response = ollamaData.response
    
    // Example parsing logic - adjust based on your model's output format
    const sections = response.match(/Section (\d+)/i)
    const confidence = response.match(/confidence:\s*(\d+)/i)
    const explanationMatch = response.match(/explanation:(.*?)(?=recommendations:|$)/m)
    const recommendationsMatch = response.match(/recommendations:(.*?)$/m)

    return NextResponse.json({
      case_text: caseDescription,
      predicted_section: sections ? sections[1] : "Unknown",
      confidence: confidence ? parseInt(confidence[1]) : 85,
      explanation: explanationMatch ? explanationMatch[1].trim() : response,
      recommendations: recommendationsMatch 
        ? recommendationsMatch[1].trim().split('\n').filter(Boolean)
        : ["Consult with a legal professional", "Gather additional evidence"],
      debug: {
        raw_response: response,
        model_name: "pinggg-legal:latest",
        prompt: prompt
      }
    })

  } catch (error) {
    console.error("Error in prediction:", error)
    return NextResponse.json(
      { error: "Failed to process prediction" },
      { status: 500 }
    )
  }
} 