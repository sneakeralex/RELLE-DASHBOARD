export interface User {
    id: string;
    name: string;
    phone: string; // 将 phone 改为必填字段
    createdAt: string;
    updatedAt: string;
    lastVisit?: string;
    totalSpent?: number;
    loyaltyPoints?: number;
    preferredLocation?: string;
    // Additional fields from app_customer_info
    unionid?: string;
    miniOpenid?: string;
    gender?: number; // 性别字段
    birthdate?: string; // 出生日期字段
    age?: number; // 年龄字段
    avatarSrc?: string;
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
