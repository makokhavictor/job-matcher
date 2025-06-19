import { Metadata } from "next";
import { MatcherClient } from "./MatcherClient";

export const metadata: Metadata = {
  title: "CV Matcher - Match Your CV to Job Descriptions",
  description: "Upload your CV and job description to see how well they match and get suggestions for improvement.",
};

export default function MatcherPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary">CV Matcher</h1>
          <p className="mt-2 text-secondary-600">Match your CV with job descriptions and get instant feedback</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MatcherClient />
      </main>
    </div>
  );
}
