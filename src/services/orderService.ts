import { Order, OrderStats } from '../types/order';
import { fetchOrderData } from './api';
import { calculateOrderStats } from '../utils/statisticsUtils';
import { getDateRanges } from '../utils/dateUtils';

export const getOrders = async (): Promise<Order[]> => {
    return await fetchOrderData();
};

export const getOrderStats = async (): Promise<OrderStats> => {
    const orders = await fetchOrderData();
    return calculateOrderStats(orders);
};

export const getOrdersByDateRange = async (startDate: Date, endDate: Date): Promise<Order[]> => {
    const orders = await fetchOrderData();
    return orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
    });
};

export const getRecentOrders = async (limit: number = 10): Promise<Order[]> => {
    const orders = await fetchOrderData();
    return [...orders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, limit);
};

export const getOrdersByStatus = async (status: 'pending' | 'completed' | 'canceled'): Promise<Order[]> => {
    const orders = await fetchOrderData();
    return orders.filter(order => order.status === status);
};

export const getTopSellingServices = async (limit: number = 5): Promise<{ name: string; count: number; revenue: number }[]> => {
    const orders = await fetchOrderData();

    // Create a map to count service occurrences and revenue
    const serviceMap = new Map<string, { count: number; revenue: number }>();

    orders.forEach(order => {
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const serviceName = item.name;
                const currentStats = serviceMap.get(serviceName) || { count: 0, revenue: 0 };

                serviceMap.set(serviceName, {
                    count: currentStats.count + item.quantity,
                    revenue: currentStats.revenue + (item.price * item.quantity)
                });
            });
        }
    });

    // Convert map to array and sort by count
    return Array.from(serviceMap.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};