import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LawyerDirectory } from "./lawyer-directory"

export default function LawyersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Find the Right Legal Expert
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse through our directory of experienced lawyers specializing in various IPC sections
            </p>
          </div>
          <LawyerDirectory />
        </div>
      </main>
      <Footer />
    </div>
  )
} 