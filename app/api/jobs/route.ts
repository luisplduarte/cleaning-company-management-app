import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { jobFormSchema } from "@/lib/validations/job"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const body = jobFormSchema.parse(json)

    // Convert string dates to Date objects
    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        type: body.type,
        status: body.status,
        start_date: new Date(body.start_date + ':00').toISOString(), // Add seconds before converting
        end_date: new Date(body.end_date + ':00').toISOString(),     // Add seconds before converting
        clientId: body.clientId,
        assignments: {
          create: {
            workerId: body.workerId,
          },
        },
      },
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

    return Response.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const jobs = await prisma.job.findMany({
      orderBy: { created_at: "desc" },
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

    return Response.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
