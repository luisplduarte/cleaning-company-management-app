import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { jobUpdateSchema } from "@/lib/validations/job"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const body = jobUpdateSchema.parse(json)

    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!existingJob) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Get current assignment if it exists
    const currentAssignment = await prisma.assignment.findFirst({
      where: { jobId: params.id },
    });

    // Convert string dates to Date objects
    const data = {
      ...body,
      start_date: body.start_date ? new Date(body.start_date) : undefined,
      end_date: body.end_date ? new Date(body.end_date) : undefined,
    }

    // Start a transaction to handle job and assignment updates
    const updatedJob = await prisma.$transaction(async (tx) => {
      // Update the job
      const job = await tx.job.update({
        where: { id: params.id },
        data,
      });

      // If worker is being updated
      if (body.workerId) {
        // Delete existing assignment if it exists
        if (currentAssignment) {
          await tx.assignment.delete({
            where: { id: currentAssignment.id },
          });
        }

        // Create new assignment
        await tx.assignment.create({
          data: {
            jobId: params.id,
            workerId: body.workerId,
          },
        });
      }

      // Return updated job with relationships
      return await tx.job.findUnique({
        where: { id: params.id },
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
    });

    return Response.json(updatedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
    })

    if (!existingJob) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    await prisma.job.delete({
      where: { id: params.id },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting job:", error)
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
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
    })

    if (!job) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return Response.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
