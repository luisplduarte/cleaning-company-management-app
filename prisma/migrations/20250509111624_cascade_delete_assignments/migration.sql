-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_jobId_fkey";

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
