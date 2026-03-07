import { CVGenerator } from "@/components/CVGenerator";
import Link from "next/link";

export default function CVGeneratorPage() {
  return (
    <main className="min-h-screen bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Tools
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Modern CV Generator</h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume in minutes. Supports English, Spanish, and Arabic.
          </p>
        </div>

        <CVGenerator />
      </div>
    </main>
  );
}
