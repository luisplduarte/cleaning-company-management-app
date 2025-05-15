import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          {
            start_date: {
              gte: new Date(start),
            },
          },
          {
            end_date: {
              lte: new Date(end),
            },
          },
        ],
      },
      include: {
        assignments: {
          include: {
            worker: true,
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching calendar jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
