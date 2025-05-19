import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jobUpdateSchema, statusTransitions, JobStatus } from "@/lib/validations/job";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const body = jobUpdateSchema.parse(json);

    // Check current job status
    const currentJob = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!currentJob) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Validate status transition
    if (body.status) {
      const allowedTransitions = statusTransitions[currentJob.status];
      if (!allowedTransitions.includes(body.status)) {
        return Response.json(
          { error: `Cannot transition from ${currentJob.status} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    // If status is being updated to COMPLETED, create payment records
    if (body.status === JobStatus.COMPLETED) {
      const job = await prisma.job.findUnique({
        where: { id: params.id },
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

      // For each worker assigned to the job
      for (const assignment of job.assignments) {
        const workerPaymentAmount = Number(assignment.worker.hourly_rate) * durationHours;
        const clientPaymentAmount = workerPaymentAmount * (1 + Number(profitMarginRate.value));

        // Create worker payment record
        await prisma.workerPayment.create({
          data: {
            worker_id: assignment.worker.id,
            job_id: job.id,
            amount: workerPaymentAmount,
          },
        });

        // Create client payment record
        await prisma.clientPayment.create({
          data: {
            client_id: job.client.id,
            job_id: job.id,
            amount: clientPaymentAmount,
          },
        });
      }
    }

    // Format data for Prisma update
    const formattedData = {
      title: body.title,
      description: body.description,
      location: body.location,
      type: body.type,
      status: body.status,
      start_date: body.start_date ? new Date(body.start_date + ':00').toISOString() : undefined,
      end_date: body.end_date ? new Date(body.end_date + ':00').toISOString() : undefined,
    };

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
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
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
