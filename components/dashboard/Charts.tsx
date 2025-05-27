"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "./ChartSkeleton";
import { useDashboardData } from "./hooks/useDashboardData";

const JobsPieChart = dynamic(() => import("./JobsPieChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const WorkerEfficiencyChart = dynamic(() => import("./WorkerEfficiencyChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export default function Charts() {
  const { data, error, isLoading } = useDashboardData();

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-500">
        <h3 className="text-lg font-semibold">Error loading dashboard</h3>
        <p>{error instanceof Error ? error.message : "Failed to load data"}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <ChartSkeleton />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Jobs by Type</h3>
            <div className="h-[250px] flex items-center justify-center">
              <JobsPieChart data={data.jobsByType} />
            </div>
          </div>
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Worker Efficiency</h3>
            <div className="h-[300px]">
              <WorkerEfficiencyChart data={data.workerEfficiency} />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}
