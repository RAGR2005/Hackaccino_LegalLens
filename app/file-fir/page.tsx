// Add animations to the FIR filing page
'use client'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ChatbotButton from "@/components/chatbot-button"
import ClientFIRWrapper from "./client-fir-wrapper"

export default function FileFIRPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <ClientFIRWrapper />
        </div>
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  )
}

