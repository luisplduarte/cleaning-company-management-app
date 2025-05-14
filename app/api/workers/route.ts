import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createWorkerSchema } from "@/lib/validations/worker";

export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(workers);
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

    revalidatePath("/workers");
    return Response.json(worker);
  } catch (error) {
    console.error("[WORKERS_POST]", error);
    return new Response("Invalid request", { status: 400 });
  }
}
