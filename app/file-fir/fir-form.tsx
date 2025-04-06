"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

interface FIRFormData {
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: Date | undefined;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  suspectDetails: string;
  witnesses: string;
  crimeType: string;
}

const initialFormData: FIRFormData = {
  complainantName: "",
  complainantAddress: "",
  complainantPhone: "",
  incidentDate: undefined,
  incidentTime: "",
  incidentLocation: "",
  incidentDescription: "",
  suspectDetails: "",
  witnesses: "",
  crimeType: "",
}

const crimeTypes = [
  "Theft",
  "Assault",
  "Robbery",
  "Fraud",
  "Domestic Violence",
  "Cybercrime",
  "Sexual Harassment",
  "Property Damage",
  "Missing Person",
  "Other"
]

export default function FIRForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState<FIRFormData>(initialFormData)
  const [crimeType, setCrimeType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFIR, setGeneratedFIR] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleInputChange = (field: keyof FIRFormData, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const generateFIRDraft = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-fir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formattedIncidentDate: formatDate(formData.incidentDate?.toISOString() || ""),
          formattedCurrentDate: formatDate(new Date().toISOString()),
          crimeType
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate FIR draft")
      }

      setGeneratedFIR(data.firDraft)
      toast({
        title: "Success",
        description: "Your FIR draft has been generated successfully.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate FIR draft",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Online FIR Filing</h1>
        <p className="text-lg text-muted-foreground">
          File a First Information Report online without visiting the police station
        </p>
      </div>

      <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="incident">Incident Details</TabsTrigger>
          <TabsTrigger value="review">Review & Submit</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Provide your contact details for the FIR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="complainantName">Full Name</Label>
                  <Input
                    id="complainantName"
                    name="complainantName"
                    value={formData.complainantName}
                    onChange={(e) => handleInputChange("complainantName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="complainantPhone">Phone Number</Label>
                  <Input
                    id="complainantPhone"
                    name="complainantPhone"
                    value={formData.complainantPhone}
                    onChange={(e) => handleInputChange("complainantPhone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="complainantAddress">Address</Label>
                <Textarea
                  id="complainantAddress"
                  name="complainantAddress"
                  value={formData.complainantAddress}
                  onChange={(e) => handleInputChange("complainantAddress", e.target.value)}
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("incident")}>Next: Incident Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="incident">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>Provide information about the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Date of Incident</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.incidentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.incidentDate ? format(formData.incidentDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.incidentDate}
                        onSelect={(date) => handleInputChange("incidentDate", date as Date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="incidentTime">Time of Incident</Label>
                  <Input
                    id="incidentTime"
                    name="incidentTime"
                    value={formData.incidentTime}
                    onChange={(e) => handleInputChange("incidentTime", e.target.value)}
                    placeholder="e.g., 14:30"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="incidentLocation">Location of Incident</Label>
                <Input
                  id="incidentLocation"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={(e) => handleInputChange("incidentLocation", e.target.value)}
                  placeholder="Enter the exact location"
                  required
                />
              </div>
              <div>
                <Label>Type of Crime</Label>
                <Select value={crimeType} onValueChange={setCrimeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="incidentDescription">Incident Description</Label>
                <Textarea
                  id="incidentDescription"
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={(e) => handleInputChange("incidentDescription", e.target.value)}
                  placeholder="Describe what happened in detail..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="suspectDetails">Suspect Details (if any)</Label>
                <Textarea
                  id="suspectDetails"
                  name="suspectDetails"
                  value={formData.suspectDetails}
                  onChange={(e) => handleInputChange("suspectDetails", e.target.value)}
                  placeholder="Provide any information about suspects..."
                />
              </div>
              <div>
                <Label htmlFor="witnesses">Witness Information (if any)</Label>
                <Textarea
                  id="witnesses"
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={(e) => handleInputChange("witnesses", e.target.value)}
                  placeholder="Provide details of any witnesses..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("personal")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("review")}>Next: Review</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Review your information before generating the FIR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Name: {formData.complainantName}</p>
                    <p>Contact: {formData.complainantPhone}</p>
                    <p>Address: {formData.complainantAddress}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Incident Details</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>Date: {formData.incidentDate ? format(formData.incidentDate, "PPP") : "Not specified"}</p>
                    <p>Time: {formData.incidentTime || "Not specified"}</p>
                    <p>Location: {formData.incidentLocation}</p>
                    <p>Crime Type: {crimeType}</p>
                    <p className="mt-2">Description: {formData.incidentDescription}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("incident")}>
                Back
              </Button>
              <Button onClick={generateFIRDraft} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating FIR...
                  </>
                ) : (
                  "Generate FIR"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {generatedFIR && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Generated FIR Draft
            </CardTitle>
            <CardDescription>
              Review the generated FIR draft below. Make any necessary changes before proceeding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generatedFIR}
              </pre>
            </div>
            <div className="flex gap-4 mt-4">
              <Button className="w-full" variant="outline" onClick={() => window.print()}>
                Print Draft
              </Button>
              <Button className="w-full">
                Submit to Police Station
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <motion.div
        className="mt-12 bg-muted p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Important Information</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Filing a false FIR is a punishable offense under Section 182 of IPC</li>
          <li>You will receive a confirmation email with your FIR number after submission</li>
          <li>You may be contacted by the police for additional information</li>
          <li>For emergency situations, please call 100 immediately</li>
        </ul>
      </motion.div>
    </motion.div>
  )
} 