import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientPredictForm from "./client-predict-form"

export default function PredictPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <ClientPredictForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

