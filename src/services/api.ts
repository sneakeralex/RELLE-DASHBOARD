import { User } from '../types/user';
import { Order } from '../types/order';
import { generateMockData } from './mockDataService';
import { DashboardData, TrendData, ServiceData, BusyHoursData } from '../types/statistics';
import { calculateUserStats, calculateOrderStats, generateTrendData } from '../utils/statisticsUtils';

// In a real application, these would be actual API calls
// For this demo, we're using mock data

let mockData = generateMockData();

export const fetchUserData = async (): Promise<User[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.users;
};

export const fetchOrderData = async (): Promise<Order[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.orders;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = mockData.users;
    const orders = mockData.orders;

    const userStats = calculateUserStats(users);
    const orderStats = calculateOrderStats(orders);

    // Get recent users (last 5)
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            totalSpent: user.totalSpent || 0
        }));

    // Get recent orders (last 5)
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5)
        .map(order => ({
            id: order.id,
            customerName: order.customerName || 'Unknown',
            totalAmount: order.totalAmount,
            orderDate: order.orderDate,
            status: order.status
        }));

    // Generate trend data for the last 30 days
    const userTrend = generateTrendData(users, 'createdAt', '', 30);
    const orderTrend = generateTrendData(orders, 'orderDate', '', 30);
    const revenueTrend = generateTrendData(orders, 'orderDate', 'totalAmount', 30);

    // Generate service distribution data
    const serviceTypes = ['Haircut', 'Coloring', 'Styling', 'Manicure', 'Pedicure', 'Facial', 'Massage', 'Waxing'];
    const serviceDistribution: ServiceData[] = serviceTypes.map(name => {
        const count = Math.floor(Math.random() * 100) + 20;
        const avgPrice = Math.floor(Math.random() * 50) + 30;
        return {
            name,
            count,
            revenue: count * avgPrice
        };
    });

    // Generate busy hours data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const busyHours: BusyHoursData[] = [];

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        for (let hour = 9; hour <= 18; hour++) {
            busyHours.push({
                day: days[dayIndex],
                hour,
                count: Math.floor(Math.random() * 30) + (hour >= 11 && hour <= 14 ? 10 : 0) + (dayIndex >= 4 ? 15 : 0)
            });
        }
    }

    return {
        userStats,
        orderStats,
        recentUsers,
        recentOrders,
        userTrend,
        orderTrend,
        revenueTrend,
        serviceDistribution,
        busyHours
    };
};

// In a real application, you would have functions to create/update/delete data
export const refreshMockData = () => {
    mockData = generateMockData();
    return mockData;
};