import { useQuery } from "@tanstack/react-query";

import { Rate } from "../types";

interface RateResponse {
  id: string;
  name: string;
  description: string;
  value: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

async function fetchRates(): Promise<Rate[]> {
  const response = await fetch("/api/rates", {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  if (!response.ok) {
    throw new Error("Failed to fetch rates");
  }
  const data: RateResponse[] = await response.json();
  
  // Transform the data to match the Rate type
  return data.map(rate => ({
    ...rate,
    created_at: new Date(rate.created_at),
    updated_at: new Date(rate.updated_at),
  }));
}

export function useRatesData() {
  return useQuery<Rate[], Error>({
    queryKey: ["rates"],
    queryFn: fetchRates,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
}
