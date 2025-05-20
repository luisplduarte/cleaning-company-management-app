import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jobUpdateSchema, statusTransitions, JobStatus, JobType } from "@/lib/validations/job";
import { sendJobCompletionEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const session = await auth();

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the current job first
    const currentJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!currentJob) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const json = await req.json();
    const body = jobUpdateSchema.parse({
      ...json,
      currentStatus: currentJob.status
    });

    // Validate status transition
    if (body.status) {
      const allowedTransitions = statusTransitions[currentJob.status];
      if (!allowedTransitions?.includes(body.status)) {
        return Response.json(
          { error: `Cannot transition from ${currentJob.status} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    // If status is being updated to COMPLETED, create payment records
    if (body.status === JobStatus.COMPLETED) {
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          assignments: {
            include: {
              worker: true,
            },
          },
          client: true,
        },
      });

      if (!job) {
        return Response.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }

      // Get profit margin rate
      const profitMarginRate = await prisma.rate.findFirst({
        where: { name: "Company Profit Margin" },
      });

      if (!profitMarginRate) {
        return Response.json(
          { error: "Profit margin rate not found" },
          { status: 500 }
        );
      }

      // Calculate job duration in hours
      const durationHours = (job.end_date.getTime() - job.start_date.getTime()) / (1000 * 60 * 60);

      // Calculate total worker payments
      let totalWorkerPayments = 0;

      // Create worker payment records
      for (const assignment of job.assignments) {
        const workerPaymentAmount = Number(assignment.worker.hourly_rate) * durationHours;
        totalWorkerPayments += workerPaymentAmount;

        await prisma.workerPayment.create({
          data: {
            worker_id: assignment.worker.id,
            job_id: job.id,
            amount: workerPaymentAmount,
          },
        });
      }

      // Calculate client payment based on total worker payments
      const clientPaymentAmount = totalWorkerPayments * (1 + Number(profitMarginRate.value));

      // Create single client payment record
      await prisma.clientPayment.create({
        data: {
          client_id: job.client.id,
          job_id: job.id,
          amount: clientPaymentAmount,
        },
      });

      // Send email notification to client
      await sendJobCompletionEmail({
        clientEmail: job.client.email,
        jobTitle: job.title,
        jobLocation: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        amount: Number(clientPaymentAmount)
      });
    }

    // Format data for Prisma update
    // Only include defined fields in the update
    const formattedData: Partial<{
      title: string;
      description: string;
      location: string;
      type: JobType;
      status: JobStatus;
      start_date: string;
      end_date: string;
    }> = {};
    
    if (body.title) formattedData.title = body.title;
    if (body.description) formattedData.description = body.description;
    if (body.location) formattedData.location = body.location;
    if (body.type) formattedData.type = body.type;
    if (body.status) formattedData.status = body.status;
    if (body.start_date) formattedData.start_date = new Date(body.start_date + ':00').toISOString();
    if (body.end_date) formattedData.end_date = new Date(body.end_date + ':00').toISOString();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: formattedData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        assignments: {
          select: {
            id: true,
            worker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return Response.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    if (error instanceof Error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
