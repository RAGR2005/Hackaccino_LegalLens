"use client"// This is the server component

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, IndianRupee } from "lucide-react"

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

interface Lawyer {
  id: string;
  name: string;
  specializations: string[];
  experience: number;
  rating: number;
  consultationFee: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  officeHours: {
    weekdays: string;
    weekends: string;
  };
  languages: string[];
  education: string[];
  ipcSections: string[];
}

// Sample lawyer data (in a real app, this would come from a database)
const lawyers: Lawyer[] = [
  {
    id: "1",
    name: "Adv. Rajesh Kumar",
    specializations: ["Criminal Law", "Murder", "Assault"],
    experience: 15,
    rating: 4.8,
    consultationFee: 2000,
    city: "Mumbai",
    address: "123 Law Chambers, Fort Area",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@legalmail.com",
    officeHours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "10:00 AM - 2:00 PM",
    },
    languages: ["English", "Hindi", "Marathi"],
    education: ["LLB, Mumbai University", "Bar Council of India"],
    ipcSections: ["302", "304", "307"],
  },
  {
    id: "2",
    name: "Adv. Priya Singh",
    specializations: ["Property Law", "Fraud", "Cheating"],
    experience: 12,
    rating: 4.6,
    consultationFee: 1500,
    city: "Delhi",
    address: "456 Legal Complex, Connaught Place",
    phone: "+91 98765 43211",
    email: "priya.singh@legalmail.com",
    officeHours: {
      weekdays: "10:00 AM - 7:00 PM",
      weekends: "By Appointment",
    },
    languages: ["English", "Hindi", "Punjabi"],
    education: ["LLB, Delhi University", "LLM, Harvard Law School"],
    ipcSections: ["420", "406", "409"],
  },
]

function ResultContent() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const [recommendedLawyers, setRecommendedLawyers] = useState<Lawyer[]>([])

  useEffect(() => {
    setIsMounted(true)
    try {
      const storedResult = sessionStorage.getItem("predictionResult")
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult) as PredictionResult
        setResult(parsedResult)

        // Find lawyers who handle the predicted IPC section
        const matchingLawyers = lawyers.filter(lawyer =>
          lawyer.ipcSections.includes(parsedResult.predicted_section)
        )
        setRecommendedLawyers(matchingLawyers)
      }
    } catch (error) {
      console.error("Error loading stored result:", error)
    }
  }, [])

  if (!isMounted) {
    return null // Return nothing during server-side rendering
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>No Results Found</CardTitle>
                <CardDescription>
                  Please submit a case for analysis first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/predict")}>
                  Go Back to Prediction
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Analysis Result */}
            <Card>
              <CardHeader>
                <CardTitle>Case Analysis Result</CardTitle>
                <CardDescription>
                  Based on the provided case description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Case Description:</h3>
                  <p className="text-muted-foreground">{result.case_text}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Predicted IPC Section:</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-lg py-1">
                      Section {result.predicted_section}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Legal Analysis:</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {result.explanation}
                  </p>
                </div>

                {result.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Recommendations:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Lawyers */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommended Lawyers</h2>
              {recommendedLawyers.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {recommendedLawyers.map(lawyer => (
                    <Card key={lawyer.id}>
                      <CardHeader>
                        <CardTitle>{lawyer.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {lawyer.city}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {lawyer.specializations.map(spec => (
                              <Badge key={spec} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                Weekdays: {lawyer.officeHours.weekdays}
                                <br />
                                Weekends: {lawyer.officeHours.weekends}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{lawyer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-4 w-4" />
                              <span>Consultation Fee: ₹{lawyer.consultationFee}</span>
                            </div>
                          </div>
                          <Button className="w-full">Contact Lawyer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No lawyers found specializing in IPC Section {result.predicted_section}.
                    </p>
                    <Button onClick={() => router.push("/lawyers")}>
                      Browse All Lawyers
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/lawyers")}
                className="mr-4"
              >
                View All Lawyers
              </Button>
              <Button onClick={() => router.push("/predict")}>
                Analyze Another Case
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ResultPage() {
  return <ResultContent />
}

