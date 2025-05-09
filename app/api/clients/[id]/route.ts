import { updateClientSchema } from "@/lib/validations/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: params.id,
      }
    });

    if (!client) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("[CLIENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await req.json();
    const body = updateClientSchema.parse(json);

    const client = await prisma.client.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        country: body.country,
        town: body.town,
        zipCode: body.zipCode,
      }
    });

    return NextResponse.json(client);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === "P2025") {
      return new NextResponse("Not found", { status: 404 });
    }

    console.error("[CLIENT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.client.delete({
      where: {
        id: params.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === "P2025") {
      return new NextResponse("Not found", { status: 404 });
    }

    console.error("[CLIENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
