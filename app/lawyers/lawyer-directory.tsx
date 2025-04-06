"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, IndianRupee, Filter, Star, Award } from "lucide-react"

// Define types
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
  successRate?: number;
  matchScore?: number;
}

// Sample data
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
  {
    id: "3",
    name: "Adv. Mohammed Ali",
    specializations: ["Cybercrime", "Fraud", "Digital Evidence"],
    experience: 8,
    rating: 4.7,
    consultationFee: 2500,
    city: "Bangalore",
    address: "789 Tech Law Center, MG Road",
    phone: "+91 98765 43212",
    email: "mohammed.ali@legalmail.com",
    officeHours: {
      weekdays: "9:30 AM - 6:30 PM",
      weekends: "11:00 AM - 3:00 PM",
    },
    languages: ["English", "Hindi", "Kannada", "Urdu"],
    education: ["LLB, Bangalore University", "Certified Cybercrime Expert"],
    ipcSections: ["66", "420", "467"],
  },
  {
    id: "4",
    name: "Adv. Anjali Sharma",
    specializations: ["Domestic Violence", "Family Law", "Women's Rights"],
    experience: 10,
    rating: 4.9,
    consultationFee: 1800,
    city: "Delhi",
    address: "567 Family Court Complex, Rohini",
    phone: "+91 98765 43213",
    email: "anjali.sharma@legalmail.com",
    officeHours: {
      weekdays: "9:00 AM - 5:00 PM",
      weekends: "10:00 AM - 1:00 PM",
    },
    languages: ["English", "Hindi", "Bengali"],
    education: ["LLB, NLSIU Bangalore", "Diploma in Family Law"],
    ipcSections: ["498A", "304B", "354"],
  },
  {
    id: "5",
    name: "Adv. Suresh Menon",
    specializations: ["Drug Offenses", "NDPS Act", "Criminal Defense"],
    experience: 20,
    rating: 4.7,
    consultationFee: 3000,
    city: "Mumbai",
    address: "890 Criminal Court Complex, Andheri",
    phone: "+91 98765 43214",
    email: "suresh.menon@legalmail.com",
    officeHours: {
      weekdays: "10:00 AM - 6:00 PM",
      weekends: "By Appointment",
    },
    languages: ["English", "Hindi", "Malayalam", "Marathi"],
    education: ["LLB, GLC Mumbai", "Specialized in NDPS Cases"],
    ipcSections: ["377", "328", "120B"],
  },
  {
    id: "6",
    name: "Adv. Kavita Reddy",
    specializations: ["Sexual Harassment", "Workplace Crime", "Women Safety"],
    experience: 14,
    rating: 4.8,
    consultationFee: 2200,
    city: "Hyderabad",
    address: "234 Women's Rights Center, Banjara Hills",
    phone: "+91 98765 43215",
    email: "kavita.reddy@legalmail.com",
    officeHours: {
      weekdays: "9:00 AM - 7:00 PM",
      weekends: "10:00 AM - 2:00 PM",
    },
    languages: ["English", "Hindi", "Telugu", "Tamil"],
    education: ["LLB, Osmania University", "Women's Rights Advocate"],
    ipcSections: ["354A", "354B", "509"],
  },
  {
    id: "7",
    name: "Adv. Vikram Malhotra",
    specializations: ["Robbery", "Theft", "Criminal Defense"],
    experience: 16,
    rating: 4.5,
    consultationFee: 1800,
    city: "Chandigarh",
    address: "678 District Court Complex, Sector 17",
    phone: "+91 98765 43216",
    email: "vikram.malhotra@legalmail.com",
    officeHours: {
      weekdays: "9:30 AM - 6:30 PM",
      weekends: "11:00 AM - 3:00 PM",
    },
    languages: ["English", "Hindi", "Punjabi"],
    education: ["LLB, Panjab University", "Criminal Law Expert"],
    ipcSections: ["379", "392", "395"],
  },
  {
    id: "8",
    name: "Adv. Deepak Verma",
    specializations: ["White Collar Crime", "Economic Offenses", "Corporate Fraud"],
    experience: 18,
    rating: 4.9,
    consultationFee: 5000,
    city: "Mumbai",
    address: "901 Business District, Bandra Kurla Complex",
    phone: "+91 98765 43217",
    email: "deepak.verma@legalmail.com",
    officeHours: {
      weekdays: "10:00 AM - 8:00 PM",
      weekends: "By Appointment",
    },
    languages: ["English", "Hindi", "Gujarati"],
    education: ["LLB, NLS Bangalore", "MBA, IIM Ahmedabad"],
    ipcSections: ["420", "409", "477A"],
  },
  {
    id: "9",
    name: "Adv. Zara Khan",
    specializations: ["Juvenile Crime", "Child Rights", "Criminal Defense"],
    experience: 9,
    rating: 4.7,
    consultationFee: 1500,
    city: "Pune",
    address: "345 Juvenile Justice Complex, Koregaon Park",
    phone: "+91 98765 43218",
    email: "zara.khan@legalmail.com",
    officeHours: {
      weekdays: "9:00 AM - 5:00 PM",
      weekends: "10:00 AM - 1:00 PM",
    },
    languages: ["English", "Hindi", "Marathi", "Urdu"],
    education: ["LLB, ILS Law College", "Child Rights Specialist"],
    ipcSections: ["363", "366", "370"],
  },
  {
    id: "10",
    name: "Adv. Arjun Nair",
    specializations: ["Kidnapping", "Extortion", "Criminal Defense"],
    experience: 13,
    rating: 4.6,
    consultationFee: 2500,
    city: "Bangalore",
    address: "567 Criminal Court, Indiranagar",
    phone: "+91 98765 43219",
    email: "arjun.nair@legalmail.com",
    officeHours: {
      weekdays: "9:30 AM - 6:30 PM",
      weekends: "By Appointment",
    },
    languages: ["English", "Hindi", "Kannada", "Malayalam"],
    education: ["LLB, Kerala Law Academy", "Criminal Law Expert"],
    ipcSections: ["364", "364A", "384"],
  }
]

export function LawyerDirectory() {
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(lawyers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [sortBy, setSortBy] = useState("")

  // Get unique cities and specializations for filters
  const cities = Array.from(new Set(lawyers.map(lawyer => lawyer.city)))
  const specializations = Array.from(
    new Set(lawyers.flatMap(lawyer => lawyer.specializations))
  )

  // Filter and sort lawyers
  useEffect(() => {
    let result = [...lawyers]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lawyer.specializations.some(spec =>
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          lawyer.ipcSections.some(section =>
            section.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    }

    // Apply city filter
    if (selectedCity && selectedCity !== "all") {
      result = result.filter(lawyer => lawyer.city === selectedCity)
    }

    // Apply specialization filter
    if (selectedSpecialization && selectedSpecialization !== "all") {
      result = result.filter(lawyer =>
        lawyer.specializations.includes(selectedSpecialization)
      )
    }

    // Apply sorting
    if (sortBy && sortBy !== "default") {
      switch (sortBy) {
        case "experience":
          result.sort((a, b) => b.experience - a.experience)
          break
        case "rating":
          result.sort((a, b) => b.rating - a.rating)
          break
        case "fee-low":
          result.sort((a, b) => a.consultationFee - b.consultationFee)
          break
        case "fee-high":
          result.sort((a, b) => b.consultationFee - a.consultationFee)
          break
      }
    }

    setFilteredLawyers(result)
  }, [searchTerm, selectedCity, selectedSpecialization, sortBy])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, specialization, or IPC section"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Select
            value={selectedSpecialization}
            onValueChange={setSelectedSpecialization}
          >
            <SelectTrigger id="specialization">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map(spec => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="fee-low">Fee: Low to High</SelectItem>
              <SelectItem value="fee-high">Fee: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLawyers.map(lawyer => (
          <Card key={lawyer.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{lawyer.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <div>
                  <div className="text-sm font-medium">IPC Sections:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lawyer.ipcSections.map(section => (
                      <Badge key={section} variant="outline">
                        IPC {section}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Success Rate: {lawyer.successRate || 85}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Match Score: {lawyer.matchScore || 92}%</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    *Match score based on case type, location, and language preferences
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">Why this lawyer matches your case:</div>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Expertise in relevant IPC sections</li>
                    <li>High success rate in similar cases</li>
                    <li>Speaks your preferred languages</li>
                    <li>Available in your location</li>
                  </ul>
                </div>
                <Button className="w-full">Contact Lawyer</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No lawyers found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
} 