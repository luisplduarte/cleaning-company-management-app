"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const JobsPieChart = dynamic(() => import("./JobsPieChart"), { ssr: false });
const WorkerEfficiencyChart = dynamic(() => import("./WorkerEfficiencyChart"), { ssr: false });

interface DashboardData {
  jobsByType: {
    type: string;
    count: number;
  }[];
  paymentStatus: {
    client: {
      status: string;
      amount: number;
    }[];
    worker: {
      status: string;
      amount: number;
    }[];
  };
  workerEfficiency: {
    name: string;
    totalJobs: number;
    completedJobs: number;
  }[];
  revenueByMonth: {
    date: string;
    amount: number;
  }[];
}

export default function Charts() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading charts...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!data) return null;

  return (
    <div className="grid gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Jobs by Type</h3>
          <div className="h-[250px] flex items-center justify-center">
            <JobsPieChart data={data.jobsByType} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Worker Efficiency</h3>
          <div className="h-[300px]">
            <WorkerEfficiencyChart data={data.workerEfficiency} />
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
      </div>
    </div>
  );
}
