import { User, UserStats } from '../types/user';
import { fetchUserData } from './api';
import { calculateUserStats } from '../utils/statisticsUtils';

export const getUsers = async (): Promise<User[]> => {
    return await fetchUserData();
};

export const getUserStats = async (): Promise<UserStats> => {
    const users = await fetchUserData();
    return calculateUserStats(users);
};

export const getUsersByDateRange = async (startDate: Date, endDate: Date): Promise<User[]> => {
    const users = await fetchUserData();
    return users.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
    });
};

export const getTopSpendingUsers = async (limit: number = 10): Promise<User[]> => {
    const users = await fetchUserData();
    return [...users]
        .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
        .slice(0, limit);
};

export const getMostLoyalUsers = async (limit: number = 10): Promise<User[]> => {
    const users = await fetchUserData();
    return [...users]
        .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
        .slice(0, limit);
};