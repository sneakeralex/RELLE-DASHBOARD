export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
    lastVisit?: string;
    totalSpent?: number;
    loyaltyPoints?: number;
    preferredLocation?: string;
}

export interface UserStats {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsersToday: number;
    activeUsersThisWeek: number;
    activeUsersThisMonth: number;
    userGrowthRate: number;
}