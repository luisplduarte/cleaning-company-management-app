import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@/types/dashboard";

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard", {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  
  return response.json();
}

export function useDashboardData() {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
}
