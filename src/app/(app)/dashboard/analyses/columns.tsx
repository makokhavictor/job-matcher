"use client"
import { ColumnDef } from "@tanstack/react-table"
import { RecentAnalysis } from '@/stores/analysis.store'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

// Function to determine score color
const getScoreColor = (score: number | undefined) => {
  if (score === undefined) return "text-gray-500"
  if (score >= 80) return "text-green-600 font-bold"
  if (score >= 60) return "text-yellow-600 font-medium"
  return "text-red-600 font-medium"
}

export const columns: ColumnDef<RecentAnalysis>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      // Get day with ordinal (e.g. 1st, 2nd, 3rd, 4th...)
      const day = date.getDate();
      const ordinal =
        day % 10 === 1 && day !== 11
          ? 'st'
          : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
      return `${day}${ordinal} ${format(date, 'MMM, yyyy')}`;
    },
  },
  {
    id: "title",
    header: "Titles",
    cell: ({ row }) => (
      <div className="max-w-[280px] truncate" title={row.original.result_data?.title || "No title"}>
        {row.original.result_data?.title || "No title"}
      </div>
    ),
  },
  {
    accessorKey: "result_data.match_score",
    header: "Score",
    size: 80,
    cell: ({ row }) => {
      const score = row.original.result_data?.match_score
      return (
        <div className="w-16 text-center">
          <span className={getScoreColor(score)}>
            {score !== undefined ? `${score}%` : "N/A"}
          </span>
        </div>
      )
    },
  },
  {
    id: "top_skills",
    header: "Top Skills",
    cell: ({ row }) => {
      const skills = row.original.result_data?.key_matches?.slice(0, 3).map((m) => m.skill).join(", ")
      return (
        <div className="w-48 truncate" title={skills || "N/A"}>
          {skills || "N/A"}
        </div>
      )
    },
  },
  // {
  //   id: "missing_skills",
  //   header: "Missing Skills",
  //   cell: ({ row }) => {
  //     const missing = row.original.result_data?.critical_missing_skills?.slice(0, 2).map((m) => m.skill).join(", ")
  //     return missing || "None"
  //   },
  // },
  {
    id: "cv_filename",
    header: "CV File",
    cell: ({ row }) => (
      <div className="max-w-xs break-words">
        {row.original.input_data?.cv_filename || "N/A"}
      </div>
    ),
  },
  {
    id: "job_filename",
    header: "Job File",
    cell: ({ row }) => (
      <div className="max-w-xs break-words">
        {row.original.input_data?.job_filename || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      // The parent page will inject a function via meta to handle view details
      const onViewDetails = (table.options.meta as { onViewDetails?: (analysis: RecentAnalysis) => void })?.onViewDetails;
      return (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(row.original)}
          >
            View Details
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 