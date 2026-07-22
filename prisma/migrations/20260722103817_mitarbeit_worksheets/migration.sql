/*
  Warnings:

  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_uploadedById_fkey";

-- DropTable
DROP TABLE "Material";

-- CreateTable
CREATE TABLE "WorksheetResponse" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "worksheetKey" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorksheetResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorksheetResponse_participantId_worksheetKey_key" ON "WorksheetResponse"("participantId", "worksheetKey");

-- AddForeignKey
ALTER TABLE "WorksheetResponse" ADD CONSTRAINT "WorksheetResponse_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
