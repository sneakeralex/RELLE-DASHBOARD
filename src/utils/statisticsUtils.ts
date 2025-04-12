import { User } from '../types/user';
import { Order } from '../types/order';
import { getDateRanges, isDateInRange, calculateGrowthRate } from './dateUtils';
import { UserStats } from '../types/user';
import { OrderStats } from '../types/order';

export function calculateUserStats(users: User[]): UserStats {
  const dateRanges = getDateRanges();

  // Filter users by date ranges
  const totalUsers = users.length;

  const usersToday = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.today.start, dateRanges.today.end)
  ).length;

  const usersYesterday = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.yesterday.start, dateRanges.yesterday.end)
  ).length;

  const usersThisWeek = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.thisWeek.start, dateRanges.thisWeek.end)
  ).length;

  const usersLastWeek = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.lastWeek.start, dateRanges.lastWeek.end)
  ).length;

  const usersThisMonth = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.thisMonth.start, dateRanges.thisMonth.end)
  ).length;

  const usersLastMonth = users.filter(user =>
    isDateInRange(user.createdAt, dateRanges.lastMonth.start, dateRanges.lastMonth.end)
  ).length;

  // Calculate active users (users with lastVisit in the date range)
  const activeUsersToday = users.filter(user =>
    user.lastVisit && isDateInRange(user.lastVisit, dateRanges.today.start, dateRanges.today.end)
  ).length;

  const activeUsersThisWeek = users.filter(user =>
    user.lastVisit && isDateInRange(user.lastVisit, dateRanges.thisWeek.start, dateRanges.thisWeek.end)
  ).length;

  const activeUsersThisMonth = users.filter(user =>
    user.lastVisit && isDateInRange(user.lastVisit, dateRanges.thisMonth.start, dateRanges.thisMonth.end)
  ).length;

  // Calculate growth rates
  const userGrowthRate = calculateGrowthRate(usersThisMonth, usersLastMonth);

  return {
    totalUsers,
    newUsersToday: usersToday,
    newUsersThisWeek: usersThisWeek,
    newUsersThisMonth: usersThisMonth,
    activeUsersToday,
    activeUsersThisWeek,
    activeUsersThisMonth,
    userGrowthRate
  };
}

export function calculateOrderStats(orders: Order[]): OrderStats {
  const dateRanges = getDateRanges();

  // Filter orders by date ranges
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersToday = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.today.start, dateRanges.today.end)
  );
  const revenueToday = ordersToday.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersYesterday = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.yesterday.start, dateRanges.yesterday.end)
  );
  const revenueYesterday = ordersYesterday.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersThisWeek = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.thisWeek.start, dateRanges.thisWeek.end)
  );
  const revenueThisWeek = ordersThisWeek.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersLastWeek = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.lastWeek.start, dateRanges.lastWeek.end)
  );
  const revenueLastWeek = ordersLastWeek.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersThisMonth = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.thisMonth.start, dateRanges.thisMonth.end)
  );
  const revenueThisMonth = ordersThisMonth.reduce((sum, order) => sum + order.totalAmount, 0);

  const ordersLastMonth = orders.filter(order =>
    isDateInRange(order.orderDate, dateRanges.lastMonth.start, dateRanges.lastMonth.end)
  );
  const revenueLastMonth = ordersLastMonth.reduce((sum, order) => sum + order.totalAmount, 0);

  // Calculate average order value and growth rates
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const orderGrowthRate = calculateGrowthRate(ordersThisMonth.length, ordersLastMonth.length);

  return {
    totalOrders,
    totalRevenue,
    ordersToday: ordersToday.length,
    revenueToday,
    ordersThisWeek: ordersThisWeek.length,
    revenueThisWeek,
    ordersThisMonth: ordersThisMonth.length,
    revenueThisMonth,
    averageOrderValue,
    orderGrowthRate
  };
}

export function generateTrendData(data: any[], dateField: string, valueField: string, days: number = 30): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = [];
  const today = new Date();

  // Create a map to store values by date
  const dateMap = new Map<string, number>();

  // Initialize the map with zeros for the last 'days' days
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dateMap.set(dateStr, 0);
  }

  // Aggregate data by date
  data.forEach(item => {
    const date = new Date(item[dateField]);
    const dateStr = date.toISOString().split('T')[0];

    if (dateMap.has(dateStr)) {
      const currentValue = dateMap.get(dateStr) || 0;
      if (typeof item[valueField] === 'number') {
        dateMap.set(dateStr, currentValue + item[valueField]);
      } else {
        dateMap.set(dateStr, currentValue + 1); // Count occurrences if not a numeric field
      }
    }
  });

  // Convert map to array and sort by date
  Array.from(dateMap.entries()).forEach(([date, value]) => {
    result.push({ date, value });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}
