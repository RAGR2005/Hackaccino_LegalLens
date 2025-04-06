import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ChatbotButton from "@/components/chatbot-button"
import AboutContent from "./client"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <AboutContent />
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  )
}

