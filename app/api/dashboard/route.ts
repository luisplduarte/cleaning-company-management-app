import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Jobs by type
    const jobsByType = await prisma.job.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    });

    // Payment status overview
    const clientPayments = await prisma.clientPayment.groupBy({
      by: ["status"],
      _sum: {
        amount: true,
      },
    });

    const workerPayments = await prisma.workerPayment.groupBy({
      by: ["status"],
      _sum: {
        amount: true,
      },
    });

    // Worker efficiency (jobs per worker)
    const workerJobs = await prisma.worker.findMany({
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
        },
      },
    });

    // Revenue trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await prisma.clientPayment.groupBy({
      by: ['payment_date'],
      where: {
        payment_date: {
          gte: sixMonthsAgo,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const formattedData = {
      jobsByType: jobsByType.map(item => ({
        type: item.type,
        count: item._count.id,
      })),
      paymentStatus: {
        client: clientPayments.map(item => ({
          status: item.status,
          amount: item._sum.amount || 0,
        })),
        worker: workerPayments.map(item => ({
          status: item.status,
          amount: item._sum.amount || 0,
        })),
      },
      workerEfficiency: workerJobs.map(worker => ({
        name: worker.name,
        totalJobs: worker.assignments.length,
        completedJobs: worker.assignments.filter(a => a.job.status === 'COMPLETED').length,
      })),
      revenueByMonth: revenueByMonth.map(item => ({
        date: item.payment_date,
        amount: item._sum.amount || 0,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
