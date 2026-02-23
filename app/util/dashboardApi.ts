import { sendRequest } from "@/app/util/api";

const DASHBOARD_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/dashboard`;

export const dashboardApi = {
    /**
     * Lấy toàn bộ dashboard data
     * GET /api/v1/admin/dashboard?period=month
     */
    getFullDashboard: async (
        period: DashboardPeriod = "month",
        accessToken: string
    ): Promise<IBackendRes<DashboardDTO>> => {
        return await sendRequest<IBackendRes<DashboardDTO>>({
            url: `${DASHBOARD_BASE}`,
            method: "GET",
            queryParams: { period },
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

    /**
     * Chỉ lấy overview cards + order status (nhẹ hơn)
     * GET /api/v1/admin/dashboard/overview?period=month
     */
    getOverview: async (
        period: DashboardPeriod = "month",
        accessToken: string
    ): Promise<IBackendRes<DashboardDTO>> => {
        return await sendRequest<IBackendRes<DashboardDTO>>({
            url: `${DASHBOARD_BASE}/overview`,
            method: "GET",
            queryParams: { period },
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },

    /**
     * Chỉ lấy chart doanh thu
     * GET /api/v1/admin/dashboard/revenue-chart?period=month
     */
    getRevenueChart: async (
        period: DashboardPeriod = "month",
        accessToken: string
    ): Promise<IBackendRes<RevenueChartItem[]>> => {
        return await sendRequest<IBackendRes<RevenueChartItem[]>>({
            url: `${DASHBOARD_BASE}/revenue-chart`,
            method: "GET",
            queryParams: { period },
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    },
};
