import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, isWithinInterval } from 'date-fns';

export function formatDate(dateString: string, formatStr: string = 'MMM dd, yyyy'): string {
    try {
        const date = parseISO(dateString);
        return format(date, formatStr);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

export function getDateRanges() {
    const today = new Date();

    return {
        today: {
            start: startOfDay(today),
            end: endOfDay(today)
        },
        yesterday: {
            start: startOfDay(subDays(today, 1)),
            end: endOfDay(subDays(today, 1))
        },
        thisWeek: {
            start: startOfWeek(today),
            end: endOfWeek(today)
        },
        lastWeek: {
            start: startOfWeek(subWeeks(today, 1)),
            end: endOfWeek(subWeeks(today, 1))
        },
        thisMonth: {
            start: startOfMonth(today),
            end: endOfMonth(today)
        },
        lastMonth: {
            start: startOfMonth(subMonths(today, 1)),
            end: endOfMonth(subMonths(today, 1))
        }
    };
}

export function isDateInRange(dateStr: string, startDate: Date, endDate: Date): boolean {
    try {
        const date = parseISO(dateStr);
        return isWithinInterval(date, { start: startDate, end: endDate });
    } catch (error) {
        console.error('Error checking date range:', error);
        return false;
    }
}

export function calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 1 : 0;
    return (current - previous) / previous;
}