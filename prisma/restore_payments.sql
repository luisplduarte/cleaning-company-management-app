-- Backup the current tables
CREATE TABLE IF NOT EXISTS "ClientPayment_backup" AS SELECT * FROM "ClientPayment";
CREATE TABLE IF NOT EXISTS "WorkerPayment_backup" AS SELECT * FROM "WorkerPayment";

-- Restore data to ClientPayment table
INSERT INTO "ClientPayment" (
  id, client_id, job_id, amount, status, created_at, updated_at
)
SELECT 
  id, client_id, job_id, amount, status, created_at, updated_at
FROM "ClientPayment_backup";

-- Restore data to WorkerPayment table
INSERT INTO "WorkerPayment" (
  id, worker_id, job_id, amount, status, created_at, updated_at
)
SELECT 
  id, worker_id, job_id, amount, status, created_at, updated_at
FROM "WorkerPayment_backup";
