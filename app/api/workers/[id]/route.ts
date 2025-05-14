import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { updateWorkerSchema } from "@/lib/validations/worker";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id: params.id },
    });

    if (!worker) {
      return new Response("Worker not found", { status: 404 });
    }

    return Response.json(worker);
  } catch (error) {
    console.error("[WORKER_GET]", error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await req.json();
    const body = updateWorkerSchema.parse(json);

    const worker = await prisma.worker.update({
      where: { id: params.id },
      data: body,
    });

    revalidatePath("/workers");
    revalidatePath(`/workers/${params.id}`);
    return Response.json(worker);
  } catch (error) {
    console.error("[WORKER_PUT]", error);
    return new Response("Invalid request", { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.worker.delete({
      where: { id: params.id },
    });

    revalidatePath("/workers");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[WORKER_DELETE]", error);
    return new Response("Internal server error", { status: 500 });
  }
}
