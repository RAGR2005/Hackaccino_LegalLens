"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Mic, MicOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      isFinal: boolean;
      [key: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Add type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: { new(): SpeechRecognitionInstance };
    webkitSpeechRecognition?: { new(): SpeechRecognitionInstance };
  }
}

const crimeTypes = [
  "Robbery",
  "Assault",
  "Theft",
  "Murder",
  "Fraud",
  "Domestic Violence",
  "Cyber Crime",
  "Property Damage",
  "Harassment",
  "Other"
]

const evidenceTypes = [
  "Photographs",
  "Medical Documents",
  "CCTV Footage",
  "Witness Statements",
  "Police Report",
  "Digital Evidence",
  "Physical Evidence",
  "Audio Recordings",
  "Video Recordings",
  "Other Documents"
]

const PredictForm = () => {
  const [caseDescription, setCaseDescription] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize speech recognition after mount
  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const instance = new SpeechRecognition()
        instance.continuous = true
        instance.interimResults = true
        instance.lang = 'en-US'
        
        instance.onstart = () => setIsRecording(true)
        instance.onend = () => setIsRecording(false)
        instance.onerror = (event: { error: string }) => {
          console.error('Speech recognition error:', event)
          setIsRecording(false)
          toast({
            title: "Error",
            description: "Speech recognition failed. Please try again.",
            variant: "destructive",
          })
        }
        instance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          setCaseDescription(prev => prev + ' ' + transcript)
        }
        
        setRecognition(instance)
      }
    }
  }, [toast])

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Not Available",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!caseDescription.trim() || !crimeType || !location || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/predict-ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseDescription: caseDescription.trim(),
          crimeType,
          location,
          date,
          evidence: selectedEvidence
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze case")
      }

      const data = await response.json()
      sessionStorage.setItem("predictionResult", JSON.stringify(data))
      
      toast({
        title: "Analysis Complete",
        description: "Redirecting to results page...",
      })
      router.push("/predict/result")
    } catch (error) {
      console.error("Error in prediction:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze case",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null // Prevent hydration mismatch by not rendering anything on server
  }

  return (
    <Card className="max-w-3xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Legal Case Analysis</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your case details below for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crimeType" className="text-sm font-medium">Type of Crime *</Label>
              <Select value={crimeType} onValueChange={setCrimeType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type of crime" />
                </SelectTrigger>
                <SelectContent>
                  {crimeTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Date of Crime *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location of Crime *</Label>
            <Input
              id="location"
              placeholder="Enter location where the crime occurred"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Case Description *</Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Describe the case details here..."
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                className="min-h-[200px] w-full resize-none"
                required
              />
              {typeof window !== 'undefined' && 
                (window.SpeechRecognition || window.webkitSpeechRecognition) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2 hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Available Evidence</Label>
            <div className="grid gap-4 md:grid-cols-2">
              {evidenceTypes.map((evidence) => (
                <div key={evidence} className="flex items-center space-x-2">
                  <Checkbox
                    id={evidence}
                    checked={selectedEvidence.includes(evidence)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvidence([...selectedEvidence, evidence])
                      } else {
                        setSelectedEvidence(selectedEvidence.filter(e => e !== evidence))
                      }
                    }}
                  />
                  <Label htmlFor={evidence} className="text-sm">{evidence}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Predict IPC Sections"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PredictForm 