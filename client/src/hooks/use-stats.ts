import { useQuery } from "@tanstack/react-query";
import { api, type StatsResponse } from "@shared/routes";

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
  });
}
