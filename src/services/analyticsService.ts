import api from './api';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  unpaidInvoices: number;
  unpaidTotal: number;
  topSelling: { name: string; totalSold: number; totalRevenue: number }[];
  categoryRevenue: { name: string; revenue: number }[];
  revenueTrend: { name: string; revenue: number; orders: number }[];
}

export const analyticsService = {
  async get(): Promise<AnalyticsData> {
    const res = await api.get<AnalyticsData>('/analytics');
    return res.data;
  },
};
