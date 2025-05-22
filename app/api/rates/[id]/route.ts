import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { updateRateSchema } from "@/app/(authenticated)/rates/utils/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const rate = await prisma.rate.findUnique({
      where: { id },
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

    // Check if this is a system rate
    const existingRate = await prisma.rate.findUnique({
      where: { id },
    });

    if (!existingRate) {
      return Response.json(
        { error: "Rate not found" },
        { status: 404 }
      );
    }

    if (existingRate.is_system) {
      return Response.json(
        { error: "System rates cannot be modified through this endpoint. Use the dedicated system rate API instead." },
        { status: 403 }
      );
    }

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
    const { id } = await params;
    
    const rate = await prisma.rate.findUnique({
      where: { id },
    });

    if (!rate) {
      return Response.json(
        { error: "Rate not found" },
        { status: 404 }
      );
    }

    if (rate.is_system) {
      return Response.json(
        { error: "System rates cannot be deleted" },
        { status: 403 }
      );
    }

    await prisma.rate.delete({
      where: { id },
    });

    revalidatePath("/rates");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[RATE_DELETE]", error);
    return new Response("Internal server error", { status: 500 });
  }
}
