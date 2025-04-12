export interface Order {
    id: string;
    userId: string;
    customerName?: string;
    totalAmount: number;
    orderDate: string;
    status: 'pending' | 'completed' | 'canceled';
    items?: OrderItem[];
    paymentMethod?: string;
    location?: string;
    staffId?: string;
    staffName?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    serviceType?: string;
}

export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    ordersToday: number;
    revenueToday: number;
    ordersThisWeek: number;
    revenueThisWeek: number;
    ordersThisMonth: number;
    revenueThisMonth: number;
    averageOrderValue: number;
    orderGrowthRate: number;
}