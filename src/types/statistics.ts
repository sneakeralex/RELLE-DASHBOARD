import { UserStats } from './user';
import { OrderStats } from './order';
import { ReactNode } from 'react';

export interface ServiceData {
  name: string;
  count: number;
  revenue: number;
}

export interface BusyHoursData {
  day: string;
  hour: number;
  count: number;
}

export interface DashboardData {
  userStats: UserStats;
  orderStats: OrderStats;
  recentUsers: RecentUser[];
  recentOrders: RecentOrder[];
  userTrend: TrendData[];
  orderTrend: TrendData[];
  revenueTrend: TrendData[];
  serviceDistribution: ServiceData[];
  busyHours: BusyHoursData[];
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalSpent: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'canceled';
}

export interface TrendData {
  date: string;
  value: number;
}

export interface TimeRange {
  label: string;
  value: 'today' | 'week' | 'month' | 'year' | 'all';
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  percentChange?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
}
