import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updatePaymentStatusSchema } from "@/lib/validations/payment";
import { ZodError } from "zod";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updatePaymentStatusSchema.parse(body);

    const payment = await prisma.workerPayment.update({
      where: {
        id: context.params.id,
      },
      data: {
        status: validatedData.status,
        payment_date: validatedData.status === "COMPLETED" ? new Date() : null,
      },
      include: {
        worker: {
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

    // Convert decimal and dates to serializable format
    const serializedPayment = {
      ...payment,
      amount: parseFloat(payment.amount.toString()),
      payment_date: payment.payment_date?.toISOString() ?? null,
      created_at: payment.created_at.toISOString(),
      updated_at: payment.updated_at.toISOString(),
      job: {
        ...payment.job,
        start_date: payment.job.start_date.toISOString(),
        end_date: payment.job.end_date.toISOString(),
      },
    };

    return NextResponse.json(serializedPayment);
  } catch (error) {
    console.error("Error updating worker payment:", error);
    if (error instanceof ZodError) {
      return new NextResponse(JSON.stringify({ error: "Invalid payment status" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
