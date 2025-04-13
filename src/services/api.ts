import { User } from '../types/user';
import { Order } from '../types/order';
import { Shop } from '../types/shop';
import { generateMockData } from './mockDataService';
import { generateRelleMallMockData } from './relleMallMockService';
import { DashboardData, TrendData, ServiceData, BusyHoursData } from '../types/statistics';
import { calculateUserStats, calculateOrderStats, generateTrendData } from '../utils/statisticsUtils';

// In a real application, these would be actual API calls
// For this demo, we're using mock data based on the relle database structure

// Configuration for mock data generation
let mockDataConfig = {
    userCount: 1000,
    orderCount: 500
};

// Use relle database mock data
let mockData = generateRelleMallMockData(mockDataConfig.userCount, mockDataConfig.orderCount);

// Store shops data
let shops = mockData.shops;

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
            phone: user.phone || "",
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

    // Generate service distribution data based on Chinese service types
    const serviceTypes = ['剪发', '染发', '造型', '美甲', '足疗', '面部护理', '按摩', '脱毛'];
    const serviceDistribution: ServiceData[] = serviceTypes.map(name => {
        const count = Math.floor(Math.random() * 100) + 20;
        const avgPrice = Math.floor(Math.random() * 200) + 100; // Higher prices for Chinese market
        return {
            name: name,
            count,
            revenue: count * avgPrice
        };
    });

    // Generate busy hours data with Chinese day names
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
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
export const setMockDataConfig = async (userCount: number, orderCount: number): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the configuration
    mockDataConfig = {
        userCount,
        orderCount
    };
};

export const fetchShopData = async (): Promise<Shop[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.shops || [];
};

export const refreshMockData = () => {
    mockData = generateRelleMallMockData(mockDataConfig.userCount, mockDataConfig.orderCount);
    shops = mockData.shops;
    return mockData;
};