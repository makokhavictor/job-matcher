-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "matchedSkills" TEXT[],
    "matchedKeywords" TEXT[],
    "missingSkills" TEXT[],
    "suggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cvId" TEXT NOT NULL,
    "jobDescriptionId" TEXT NOT NULL,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisResult_cvId_idx" ON "AnalysisResult"("cvId");

-- CreateIndex
CREATE INDEX "AnalysisResult_jobDescriptionId_idx" ON "AnalysisResult"("jobDescriptionId");

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_jobDescriptionId_fkey" FOREIGN KEY ("jobDescriptionId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
