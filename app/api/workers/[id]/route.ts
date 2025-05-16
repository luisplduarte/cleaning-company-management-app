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
      include: {
        rate_history: {
          orderBy: { changed_at: 'desc' }
        }
      }
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
    const { id } = await params;
    const json = await req.json();
    const body = updateWorkerSchema.parse(json);

    // Get current worker data to check if rate changed
    const currentWorker = await prisma.worker.findUnique({
      where: { id },
      select: { hourly_rate: true }
    });

    if (!currentWorker) {
      return new Response("Worker not found", { status: 404 });
    }

    const worker = await prisma.$transaction(async (tx) => {
      // Update worker
      const updatedWorker = await tx.worker.update({
        where: { id },
        data: body,
        include: {
          rate_history: {
            orderBy: { changed_at: 'desc' }
          }
        }
      });

      // If hourly rate changed, create history entry
      if (Number(body.hourly_rate) !== Number(currentWorker.hourly_rate)) {
        await tx.workerRateHistory.create({
          data: {
            worker_id: id,
            old_rate: currentWorker.hourly_rate,
            new_rate: body.hourly_rate,
          }
        });
      }

      return updatedWorker;
    });

    revalidatePath("/workers");
    revalidatePath(`/workers/${id}`);
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
