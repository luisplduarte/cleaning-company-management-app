-- DropWorkerTimestamps
ALTER TABLE "Worker" DROP COLUMN IF EXISTS "created_at",
                     DROP COLUMN IF EXISTS "updated_at";
