import { api } from "./api";
import { mapDashboardSummary, type DashboardSummary, type RawDashboardSummary } from "@/types/dashboard";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<RawDashboardSummary>("/dashboard/summary");
    return mapDashboardSummary(data);
  },
};
