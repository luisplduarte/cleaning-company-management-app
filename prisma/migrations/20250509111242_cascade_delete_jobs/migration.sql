-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
