import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from 'next/cache';
import { Decimal } from "@prisma/client/runtime/library";
import { JobStatus, PaymentStatus } from "@prisma/client";

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

// Type for the dashboard data
interface DashboardData {
  jobsByType: { type: string; count: number }[];
  paymentStatus: {
    client: { status: PaymentStatus; amount: number }[];
    worker: { status: PaymentStatus; amount: number }[];
  };
  workerEfficiency: { name: string; totalJobs: number; completedJobs: number }[];
  revenueByMonth: { date: Date; amount: number }[];
}

export async function GET() {
  try {
    // Add cache control headers
    const response = new NextResponse();
    response.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);

    // Calculate six months ago once
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Cache key based on current hour to refresh hourly
    const cacheKey = `dashboard-data-${new Date().toISOString().slice(0, 13)}`;

    // Get cached data or fetch new data
    const data = await unstable_cache(
      async (): Promise<DashboardData> => {
        // Create a transaction to ensure database connection consistency
        return await prisma.$transaction(async (tx) => {
          // Execute all queries in parallel within the transaction
          const [jobsByType, clientPayments, workerPayments, workerJobs] = await Promise.all([
          // Jobs by type
          tx.job.groupBy({
            by: ["type"],
            _count: {
              id: true,
            },
          }),

          // Client payments status
          tx.clientPayment.groupBy({
            by: ["status"],
            _sum: {
              amount: true,
            },
          }),

          // Worker payments status
          tx.workerPayment.groupBy({
            by: ["status"],
            _sum: {
              amount: true,
            },
          }),

          // Worker efficiency with optimized query
          tx.worker.findMany({
            select: {
              id: true,
              name: true,
              assignments: {
                select: {
                  job: {
                    select: {
                      id: true,
                      status: true,
                    },
                  },
                },
                where: {
                  job: {
                    created_at: {
                      gte: sixMonthsAgo
                    }
                  }
                }
              },
            },
          })
        ]);

          // Revenue trends query within transaction
          const revenueByMonth = await tx.clientPayment.groupBy({
          by: ['payment_date'],
          where: {
            AND: [
              { payment_date: { gte: sixMonthsAgo } },
              { status: 'COMPLETED' }
            ]
          },
          _sum: {
            amount: true,
          },
        });

        const formattedData: DashboardData = {
          jobsByType: jobsByType.map(item => ({
            type: item.type,
            count: item._count.id,
          })),
          paymentStatus: {
            client: clientPayments.map(item => ({
              status: item.status,
              amount: Number(item._sum.amount || 0),
            })),
            worker: workerPayments.map(item => ({
              status: item.status,
              amount: Number(item._sum.amount || 0),
            })),
          },
          workerEfficiency: workerJobs.map(worker => ({
            name: worker.name,
            totalJobs: worker.assignments.length,
            completedJobs: worker.assignments.filter(
              assignment => assignment.job.status === JobStatus.COMPLETED
            ).length,
          })),
          revenueByMonth: revenueByMonth
            .filter((item): item is { payment_date: Date; _sum: { amount: Decimal | null } } => 
              item.payment_date !== null
            )
            .map(item => ({
              date: item.payment_date,
              amount: Number(item._sum.amount || 0),
            })),
        };

          return formattedData;
        });
      },
      [cacheKey],
      {
        revalidate: CACHE_DURATION,
        tags: ['dashboard-data'],
      }
    )();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
