export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product';
  message: string;
  timestamp: string;
  user?: string;
}

export interface ChartData {
  name: string;
  revenue: number;
  orders: number;
}