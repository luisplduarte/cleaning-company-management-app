import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createWorkerSchema } from "@/lib/validations/worker";
import { Worker } from "@prisma/client";

export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Convert dates to ISO strings for consistent serialization
    const serializedWorkers = workers.map((worker: Worker) => ({
      ...worker,
      created_at: worker.created_at.toISOString(),
      updated_at: worker.updated_at.toISOString(),
    }));

    return Response.json(serializedWorkers);
  } catch (error) {
    console.error("[WORKERS_GET]", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = createWorkerSchema.parse(json);

    const worker = await prisma.worker.create({
      data: body,
    });

    // Convert dates to ISO strings for consistent serialization
    const serializedWorker = {
      ...worker,
      created_at: worker.created_at.toISOString(),
      updated_at: worker.updated_at.toISOString(),
    };

    revalidatePath("/workers");
    return Response.json(serializedWorker);
  } catch (error) {
    console.error("[WORKERS_POST]", error);
    return new Response("Invalid request", { status: 400 });
  }
}
