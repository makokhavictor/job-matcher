import { Metadata } from "next";
import { MatcherClient } from "./MatcherClient";

export const metadata: Metadata = {
  title: "CV Matcher - Match Your CV to Job Descriptions",
  description: "Upload your CV and job description to see how well they match and get suggestions for improvement.",
};

export default function MatcherPage() {
  return <MatcherClient />;
}
