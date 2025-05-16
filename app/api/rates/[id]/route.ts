import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { updateRateSchema } from "@/lib/validations/rate";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rate = await prisma.rate.findUnique({
      where: { id: params.id },
    });

    if (!rate) {
      return new Response("Rate not found", { status: 404 });
    }

    return Response.json(rate);
  } catch (error) {
    console.error("[RATE_GET]", error);
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
    const body = updateRateSchema.parse(json);

    const rate = await prisma.rate.update({
      where: { id },
      data: body,
    });

    revalidatePath("/rates");
    revalidatePath(`/rates/${id}`);
    return Response.json(rate);
  } catch (error) {
    console.error("[RATE_PUT]", error);
    return new Response("Invalid request", { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rate.delete({
      where: { id: params.id },
    });

    revalidatePath("/rates");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[RATE_DELETE]", error);
    return new Response("Internal server error", { status: 500 });
  }
}
