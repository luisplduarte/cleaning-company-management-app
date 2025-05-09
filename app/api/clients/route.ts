import { createClientSchema } from "@/lib/validations/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clients = await prisma.client.findMany();

    return NextResponse.json(clients);
  } catch (error) {
    console.error("[CLIENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await req.json();
    const body = createClientSchema.parse(json);

    const client = await prisma.client.create({
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
    if (error instanceof Error && 'code' in error && error.code === "P2002") {
      return new NextResponse("Client already exists", { status: 409 });
    }

    console.error("[CLIENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
