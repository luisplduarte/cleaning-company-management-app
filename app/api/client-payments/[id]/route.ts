import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { paymentUpdateSchema } from "@/lib/validations/payment";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = paymentUpdateSchema.parse(body);

    const payment = await prisma.clientPayment.update({
      where: {
        id: params.id,
      },
      data: {
        status: validatedData.status,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error updating client payment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
