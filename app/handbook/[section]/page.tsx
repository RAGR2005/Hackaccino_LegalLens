"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SectionData {
  title: string
  description: string
  punishment: string
  essentialElements: string[]
  caseLaws: string[]
  relatedSections: string[]
  victimGuidance: {
    immediateSteps: string[]
    legalRemedies: string[]
    helplineNumbers: { name: string; number: string }[]
    documentationNeeded: string[]
    rightsAndProtections: string[]
  }
}

type IPCSectionsData = {
  [key: string]: SectionData
}

// IPC sections data
const ipcSectionsData: IPCSectionsData = {
  "302": {
    title: "Punishment for murder",
    description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or imprisonment for life, and fine",
    essentialElements: [
      "Intention to cause death",
      "Act causing death",
      "Death caused must be of a human being",
      "The act must be done with the intention of causing death"
    ],
    caseLaws: [
      "Bachan Singh v. State of Punjab (1980)",
      "Machhi Singh v. State of Punjab (1983)"
    ],
    relatedSections: ["299", "300", "304", "307"],
    victimGuidance: {
      immediateSteps: [
        "Contact the police immediately by dialing 100",
        "Do not disturb the crime scene",
        "Take photographs of the scene if possible",
        "Note down details of any witnesses present"
      ],
      legalRemedies: [
        "File an FIR at the nearest police station",
        "Seek legal representation immediately",
        "Apply for victim compensation under Section 357A CrPC",
        "Request police protection if needed"
      ],
      helplineNumbers: [
        { name: "Police Emergency", number: "100" },
        { name: "Crime Stopper", number: "1090" },
        { name: "Women Helpline", number: "1091" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Copy of the FIR",
        "Medical reports and post-mortem report",
        "Photographs of the crime scene",
        "List of witnesses with contact details",
        "Any CCTV footage if available"
      ],
      rightsAndProtections: [
        "Right to fair and speedy investigation",
        "Right to engage a private lawyer",
        "Right to victim compensation",
        "Right to protection during trial",
        "Right to appeal against acquittal"
      ]
    }
  },
  "376": {
    title: "Punishment for rape",
    description: "Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
    punishment: "Rigorous imprisonment not less than 10 years, may extend to life imprisonment, and fine",
    essentialElements: [
      "Sexual intercourse with a woman",
      "Against her will",
      "Without her consent",
      "By force, threat, or deception"
    ],
    caseLaws: [
      "Mukesh & Anr vs State For NCT Of Delhi & Ors (2017)",
      "Tukaram v. State of Maharashtra (1979)"
    ],
    relatedSections: ["375", "376A", "376B", "376C", "376D"],
    victimGuidance: {
      immediateSteps: [
        "Seek immediate medical attention",
        "Contact police or women's helpline",
        "Do not change clothes or wash yourself (to preserve evidence)",
        "Contact a trusted person for support"
      ],
      legalRemedies: [
        "File Zero FIR at any police station",
        "Request female police officer for statement",
        "Seek protection order if needed",
        "Apply for victim compensation"
      ],
      helplineNumbers: [
        { name: "Women Helpline", number: "1091" },
        { name: "Police Emergency", number: "100" },
        { name: "National Commission for Women", number: "1091" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Medical examination report",
        "Copy of FIR",
        "Statement under Section 164 CrPC",
        "Photographs of injuries if any",
        "Call recordings or messages (if available)"
      ],
      rightsAndProtections: [
        "Right to medical examination by female doctor",
        "Right to give statement in private",
        "Right to free legal aid",
        "Right to victim compensation",
        "Right to trial in camera"
      ]
    }
  },
  "420": {
    title: "Cheating and dishonestly inducing delivery of property",
    description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment and fine.",
    punishment: "Imprisonment up to 7 years and fine",
    essentialElements: [
      "Deception (cheating)",
      "Dishonest intention",
      "Inducement",
      "Delivery of property or valuable security"
    ],
    caseLaws: [
      "Hridaya Ranjan Prasad Verma v. State of Bihar (2000)",
      "Dr. S. Dutt v. State of Uttar Pradesh (1966)"
    ],
    relatedSections: ["415", "417", "418", "419"],
    victimGuidance: {
      immediateSteps: [
        "Preserve all documents and evidence",
        "Stop any further transactions",
        "Contact your bank to freeze accounts if needed",
        "Document all communication with the accused"
      ],
      legalRemedies: [
        "File detailed FIR with all evidence",
        "File civil suit for recovery",
        "Approach consumer forum if applicable",
        "File complaint with cyber cell if online fraud"
      ],
      helplineNumbers: [
        { name: "Police Emergency", number: "100" },
        { name: "Cyber Crime Helpline", number: "1930" },
        { name: "Economic Offences Wing", number: "1090" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "All financial transactions records",
        "Communication records with accused",
        "Agreements or contracts",
        "Witness statements",
        "Bank statements"
      ],
      rightsAndProtections: [
        "Right to file complaint in jurisdiction of occurrence",
        "Right to recover property or compensation",
        "Right to attach property of accused",
        "Right to free legal aid if eligible"
      ]
    }
  },
  "307": {
    title: "Attempt to murder",
    description: "Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment and fine.",
    punishment: "Imprisonment up to 10 years and fine",
    essentialElements: [
      "Intention to cause death",
      "Act done towards causing death",
      "Act must be capable of causing death",
      "The act must be done with the intention or knowledge of causing death"
    ],
    caseLaws: [
      "State of Maharashtra v. Balram Bama Patil (1983)",
      "Hari Kishan v. State of Delhi (1988)"
    ],
    relatedSections: ["302", "300", "308"],
    victimGuidance: {
      immediateSteps: [
        "Seek immediate medical attention",
        "Contact police and file an FIR",
        "Document injuries through photographs",
        "Identify and note details of witnesses"
      ],
      legalRemedies: [
        "File FIR at nearest police station",
        "Request police protection if needed",
        "Apply for victim compensation",
        "File for restraining order if applicable"
      ],
      helplineNumbers: [
        { name: "Police Emergency", number: "100" },
        { name: "Ambulance", number: "102" },
        { name: "Crime Stopper", number: "1090" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Medical examination report",
        "Copy of FIR",
        "Photographs of injuries",
        "Witness statements",
        "CCTV footage if available"
      ],
      rightsAndProtections: [
        "Right to medical treatment",
        "Right to police protection",
        "Right to victim compensation",
        "Right to engage private lawyer",
        "Right to witness protection if needed"
      ]
    }
  },
  "354": {
    title: "Assault or criminal force to woman with intent to outrage her modesty",
    description: "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment and fine.",
    punishment: "Imprisonment not less than 1 year, may extend to 5 years, and fine",
    essentialElements: [
      "Use of criminal force or assault",
      "Against a woman",
      "Intention to outrage modesty",
      "Knowledge of likelihood of outraging modesty"
    ],
    caseLaws: [
      "State of Punjab v. Major Singh (1967)",
      "Rupan Deol Bajaj v. K.P.S. Gill (1995)"
    ],
    relatedSections: ["354A", "354B", "354C", "354D"],
    victimGuidance: {
      immediateSteps: [
        "Move to a safe location",
        "Contact women's helpline or police",
        "Document the incident details",
        "Seek support from trusted persons"
      ],
      legalRemedies: [
        "File Zero FIR at any police station",
        "Request female police officer",
        "Apply for protection order",
        "File complaint with women's commission"
      ],
      helplineNumbers: [
        { name: "Women Helpline", number: "1091" },
        { name: "Police Emergency", number: "100" },
        { name: "National Commission for Women", number: "1091" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Detailed incident report",
        "Copy of FIR",
        "Medical examination report if applicable",
        "Witness statements",
        "Any electronic evidence (CCTV, photos, etc.)"
      ],
      rightsAndProtections: [
        "Right to file complaint with female officer",
        "Right to privacy during investigation",
        "Right to protection order",
        "Right to free legal aid",
        "Right to compensation"
      ]
    }
  },
  "498A": {
    title: "Husband or relative of husband of a woman subjecting her to cruelty",
    description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment and fine.",
    punishment: "Imprisonment up to 3 years and fine",
    essentialElements: [
      "Marriage must be valid",
      "Cruelty by husband or his relatives",
      "Willful conduct causing danger to life/health",
      "Harassment for dowry demands"
    ],
    caseLaws: [
      "Arnesh Kumar v. State of Bihar (2014)",
      "Rajesh Sharma v. State of UP (2017)"
    ],
    relatedSections: ["304B", "406", "494", "495"],
    victimGuidance: {
      immediateSteps: [
        "Ensure personal safety first",
        "Document instances of cruelty",
        "Contact women's helpline",
        "Seek shelter if needed"
      ],
      legalRemedies: [
        "File domestic violence complaint",
        "Apply for protection order",
        "File for maintenance",
        "Request police protection"
      ],
      helplineNumbers: [
        { name: "Women Helpline", number: "1091" },
        { name: "Domestic Violence Helpline", number: "181" },
        { name: "Police Emergency", number: "100" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Marriage certificate",
        "Evidence of cruelty (photos, medical reports)",
        "Copy of domestic violence complaint",
        "Financial documents",
        "Communication records"
      ],
      rightsAndProtections: [
        "Right to residence in shared household",
        "Right to protection order",
        "Right to maintenance",
        "Right to custody of children",
        "Right to compensation"
      ]
    }
  },
  "304B": {
    title: "Dowry Death",
    description: "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called 'dowry death'.",
    punishment: "Imprisonment not less than 7 years but which may extend to imprisonment for life",
    essentialElements: [
      "Death of woman within 7 years of marriage",
      "Death caused by burns or bodily injury or abnormal circumstances",
      "Cruelty or harassment by husband or in-laws",
      "Connection with dowry demand"
    ],
    caseLaws: [
      "Pawan Kumar v. State of Haryana (2001)",
      "Kans Raj v. State of Punjab (2000)"
    ],
    relatedSections: ["498A", "304", "306"],
    victimGuidance: {
      immediateSteps: [
        "Report to police immediately",
        "Preserve all evidence of dowry demands",
        "Document any previous complaints",
        "Contact women's organizations for support"
      ],
      legalRemedies: [
        "File FIR under Section 304B",
        "Request for investigation by senior police officer",
        "Apply for compensation",
        "File parallel complaint with State Women's Commission"
      ],
      helplineNumbers: [
        { name: "Women Helpline", number: "1091" },
        { name: "Domestic Violence Helpline", number: "181" },
        { name: "Police Emergency", number: "100" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Marriage certificate",
        "Evidence of dowry demands",
        "Previous complaint records",
        "Medical reports",
        "Photographs of injuries/incidents"
      ],
      rightsAndProtections: [
        "Presumption in favor of prosecution",
        "Right to file complaint anywhere",
        "Protection for family members",
        "Right to compensation",
        "Right to speedy trial"
      ]
    }
  },
  "306": {
    title: "Abetment of Suicide",
    description: "If any person commits suicide, whoever abets the commission of such suicide, shall be punished with imprisonment and fine.",
    punishment: "Imprisonment up to 10 years and fine",
    essentialElements: [
      "Commission of suicide by a person",
      "Abetment by the accused",
      "Direct connection between abetment and suicide",
      "Intention to abet suicide"
    ],
    caseLaws: [
      "M. Mohan v. State (2011)",
      "State of West Bengal v. Orilal Jaiswal (1994)"
    ],
    relatedSections: ["304B", "498A", "107"],
    victimGuidance: {
      immediateSteps: [
        "Preserve all evidence of harassment",
        "Collect suicide note if any",
        "Document previous complaints or communications",
        "Contact mental health support"
      ],
      legalRemedies: [
        "File FIR with detailed complaint",
        "Request thorough investigation",
        "Apply for victim compensation",
        "File for preservation of electronic evidence"
      ],
      helplineNumbers: [
        { name: "Suicide Prevention", number: "9152987821" },
        { name: "Mental Health Helpline", number: "1800-599-0019" },
        { name: "Police Emergency", number: "100" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Suicide note if available",
        "Communication records",
        "Witness statements",
        "Medical/psychological treatment records",
        "Previous complaint records"
      ],
      rightsAndProtections: [
        "Right to fair investigation",
        "Protection for family members",
        "Right to victim compensation",
        "Right to legal representation",
        "Right to submit additional evidence"
      ]
    }
  },
  "509": {
    title: "Word, gesture or act intended to insult the modesty of a woman",
    description: "Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, or exhibits any object, intending that such word or sound shall be heard, or that such gesture or object shall be seen, by such woman, or intrudes upon the privacy of such woman.",
    punishment: "Simple imprisonment up to 3 years and fine",
    essentialElements: [
      "Intention to insult modesty",
      "Word, gesture, or act",
      "Directed towards a woman",
      "Intrusion of privacy"
    ],
    caseLaws: [
      "Ramkripal S/O Shyamlal Charmakar v. State of Madhya Pradesh (2007)",
      "Rupan Deol Bajaj v. K.P.S. Gill (1995)"
    ],
    relatedSections: ["354", "354A", "354D"],
    victimGuidance: {
      immediateSteps: [
        "Document the incident immediately",
        "Record or save any evidence",
        "Report to authorities",
        "Seek support from women's organizations"
      ],
      legalRemedies: [
        "File police complaint",
        "Apply for restraining order",
        "File complaint with workplace committee if applicable",
        "Approach women's commission"
      ],
      helplineNumbers: [
        { name: "Women Helpline", number: "1091" },
        { name: "Police Emergency", number: "100" },
        { name: "NCW Helpline", number: "7827170170" },
        { name: "Legal Aid", number: "1516" }
      ],
      documentationNeeded: [
        "Detailed incident report",
        "Witness statements",
        "Any recordings or messages",
        "Screenshots of online harassment if any",
        "Medical report if applicable"
      ],
      rightsAndProtections: [
        "Right to file complaint anonymously",
        "Protection from retaliation",
        "Right to dignity during investigation",
        "Right to legal assistance",
        "Right to safe workplace"
      ]
    }
  },
  "406": {
    title: "Criminal Breach of Trust",
    description: "Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property.",
    punishment: "Imprisonment up to 3 years, or fine, or both",
    essentialElements: [
      "Entrustment of property",
      "Dishonest misappropriation",
      "Conversion to own use",
      "Breach of trust"
    ],
    caseLaws: [
      "Rashmi Kumar v. Mahesh Kumar Bhada (1997)",
      "Pratibha Rani v. Suraj Kumar (1985)"
    ],
    relatedSections: ["405", "407", "408", "409"],
    victimGuidance: {
      immediateSteps: [
        "Document all property details",
        "Collect proof of entrustment",
        "Secure remaining property",
        "Stop further transactions"
      ],
      legalRemedies: [
        "File FIR with detailed inventory",
        "File civil suit for recovery",
        "Apply for property attachment",
        "Request interim compensation"
      ],
      helplineNumbers: [
        { name: "Police Emergency", number: "100" },
        { name: "Economic Offences Wing", number: "1090" },
        { name: "Legal Aid", number: "1516" },
        { name: "Crime Branch", number: "1090" }
      ],
      documentationNeeded: [
        "Property documents",
        "Proof of entrustment",
        "Financial records",
        "Communication records",
        "Witness statements"
      ],
      rightsAndProtections: [
        "Right to recover property",
        "Right to compensation",
        "Right to attach property",
        "Right to expedited hearing",
        "Right to file multiple complaints"
      ]
    }
  }
}

export default function SectionDetailsPage() {
  const params = useParams()
  const [sectionNumber, setSectionNumber] = useState<string>("")
  const [sectionData, setSectionData] = useState<SectionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.section) {
      const extractedNumber = typeof params.section === 'string'
        ? params.section.replace(/[^0-9A-Z]/g, '').match(/\d+[A-Z]?/)?.[0] || ""
        : ""
      
      setSectionNumber(extractedNumber)
      setSectionData(extractedNumber ? ipcSectionsData[extractedNumber] : null)
    }
    setIsLoading(false)
  }, [params.section])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!sectionData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Section Not Found</h1>
              <p className="mb-4">The requested IPC section details are not available.</p>
              <Link href="/handbook" className="text-primary hover:underline">
                Return to Handbook
              </Link>
            </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link href="/handbook" className="inline-flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Handbook
              </Link>
              <motion.h1
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Section {sectionNumber} - {sectionData.title}
              </motion.h1>
            </div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{sectionData.description}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Punishment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{sectionData.punishment}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Essential Elements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.essentialElements.map((element, index) => (
                        <li key={index} className="text-muted-foreground">
                          {element}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Important Case Laws</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.caseLaws.map((caseLaw, index) => (
                        <li key={index} className="text-muted-foreground">
                          {caseLaw}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Related Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {sectionData.relatedSections.map((section) => (
                        <Link
                          key={section}
                          href={`/handbook/Section-${section}`}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Section {section}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Immediate Steps for Victims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.victimGuidance.immediateSteps.map((step, index) => (
                        <li key={index} className="text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Remedies Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.victimGuidance.legalRemedies.map((remedy, index) => (
                        <li key={index} className="text-muted-foreground">
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Important Helpline Numbers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {sectionData.victimGuidance.helplineNumbers.map((helpline, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="font-medium">{helpline.name}:</span>
                          <span className="text-primary">{helpline.number}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Required Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.victimGuidance.documentationNeeded.map((doc, index) => (
                        <li key={index} className="text-muted-foreground">
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Victim Rights and Protections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sectionData.victimGuidance.rightsAndProtections.map((right, index) => (
                        <li key={index} className="text-muted-foreground">
                          {right}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 