"use client"
import { ColumnDef } from "@tanstack/react-table"
import { RecentAnalysis } from '@/stores/analysis.store'

export const columns: ColumnDef<RecentAnalysis>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "result_data.match_score",
    header: "Score",
    cell: ({ row }) => row.original.result_data?.match_score ?? "N/A",
  },
  {
    id: "top_skills",
    header: "Top Skills",
    cell: ({ row }) => {
      const skills = row.original.result_data?.key_matches?.slice(0, 3).map((m) => m.skill).join(", ")
      return skills || "N/A"
    },
  },
  {
    id: "missing_skills",
    header: "Missing Skills",
    cell: ({ row }) => {
      const missing = row.original.result_data?.critical_missing_skills?.slice(0, 2).map((m) => m.skill).join(", ")
      return missing || "None"
    },
  },
  {
    id: "cv_filename",
    header: "CV File",
    cell: ({ row }) => row.original.input_data?.cv_filename || "N/A",
  },
  {
    id: "job_filename",
    header: "Job File",
    cell: ({ row }) => row.original.input_data?.job_filename || "N/A",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      // The parent page will inject a function via meta to handle view details
      const onViewDetails = table.options.meta?.onViewDetails as (analysis: RecentAnalysis) => void
      return (
        <button
          className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/80 text-sm"
          onClick={() => onViewDetails?.(row.original)}
        >
          View Details
        </button>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 