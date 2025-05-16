-- CreateTable
CREATE TABLE "WorkerRateHistory" (
    "id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "old_rate" DECIMAL(10,2) NOT NULL,
    "new_rate" DECIMAL(10,2) NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerRateHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerRateHistory" ADD CONSTRAINT "WorkerRateHistory_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
