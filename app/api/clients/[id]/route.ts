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
    console.log('DELETE request session:', session);

    if (!session) {
      return new NextResponse("Unauthorized", { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { 
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Attempting to delete client:', params.id);
    await prisma.client.delete({
      where: {
        id: params.id
      }
    });
    console.log('Client deleted successfully');

    return new NextResponse(JSON.stringify({ message: 'Client deleted successfully' }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("[CLIENT_DELETE]", error);
    
    if (error instanceof Error && 'code' in error && error.code === "P2025") {
      return new NextResponse(JSON.stringify({ error: 'Client not found' }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
