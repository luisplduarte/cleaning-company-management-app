-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('WAITING_PAYMENT', 'ISSUED', 'COMPLETED');

-- CreateTable
CREATE TABLE "WorkerPayment" (
    "id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPayment" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "payment_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerPayment" ADD CONSTRAINT "WorkerPayment_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerPayment" ADD CONSTRAINT "WorkerPayment_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPayment" ADD CONSTRAINT "ClientPayment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPayment" ADD CONSTRAINT "ClientPayment_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
