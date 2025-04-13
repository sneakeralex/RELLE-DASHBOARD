import { User } from '../types/user';
import { Order, OrderItem } from '../types/order';
import { subDays, addDays, format } from 'date-fns';
import { employeeNames } from './employeeNames';

// Generate random date within a range
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Generate random number within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate age from birthdate
const calculateAge = (birthdate: string): number => {
  if (!birthdate) return 0;
  
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Generate random birthdate
const generateBirthdate = (): string => {
  const year = randomNumber(1970, 2005);
  const month = randomNumber(1, 12).toString().padStart(2, '0');
  const day = randomNumber(1, 28).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate random users
export const generateMockUsers = (count: number = 100): User[] => {
  const users: User[] = [];
  const now = new Date();
  const startDate = subDays(now, 365); // 1 year ago
  
  for (let i = 0; i < count; i++) {
    const createdAt = randomDate(startDate, now);
    const updatedAt = randomDate(new Date(createdAt), now);
    const lastVisitDate = Math.random() > 0.3 ? randomDate(new Date(createdAt), now) : undefined;
    const birthdate = generateBirthdate();
    const age = calculateAge(birthdate);
    const gender = randomNumber(0, 2); // 0: unknown, 1: male, 2: female
    
    users.push({
      id: `user-${i + 1}`,
      name: `Customer ${i + 1}`,
      phone: `+1-${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`,
      createdAt,
      updatedAt,
      lastVisit: lastVisitDate,
      totalSpent: randomNumber(0, 5000),
      loyaltyPoints: randomNumber(0, 1000),
      preferredLocation: 'Downtown',
      gender,
      birthdate,
      age,
      avatarSrc: `https://ui-avatars.com/api/?name=Customer+${i + 1}&background=random`
    });
  }
  
  return users;
};

// Generate random order items
const generateOrderItems = (count: number): OrderItem[] => {
  const items: OrderItem[] = [];
  const serviceTypes = ['Haircut', 'Coloring', 'Styling', 'Manicure', 'Pedicure', 'Facial', 'Massage', 'Waxing'];
  
  for (let i = 0; i < count; i++) {
    const serviceType = serviceTypes[randomNumber(0, serviceTypes.length - 1)];
    const price = randomNumber(20, 200);
    const quantity = randomNumber(1, 3);
    
    items.push({
      id: `item-${i + 1}`,
      name: serviceType,
      price,
      quantity,
      serviceType
    });
  }
  
  return items;
};

// Generate random orders
export const generateMockOrders = (users: User[], count: number = 300): Order[] => {
  const orders: Order[] = [];
  const now = new Date();
  const startDate = subDays(now, 365); // 1 year ago
  const paymentMethods = ['Credit Card', 'Cash', 'Debit Card', 'Gift Card', 'Mobile Payment'];
  
  for (let i = 0; i < count; i++) {
    const userIndex = randomNumber(0, users.length - 1);
    const user = users[userIndex];
    const orderItems = generateOrderItems(randomNumber(1, 5));
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDate = randomDate(startDate, now);
    const staffId = `staff-${randomNumber(1, employeeNames.length)}`;
    const staffName = employeeNames[randomNumber(0, employeeNames.length - 1)];
    
    orders.push({
      id: `order-${i + 1}`,
      userId: user.id,
      customerName: user.name,
      totalAmount,
      orderDate,
      status: Math.random() > 0.9 ? 'pending' : (Math.random() > 0.1 ? 'completed' : 'canceled'),
      items: orderItems,
      paymentMethod: paymentMethods[randomNumber(0, paymentMethods.length - 1)],
      staffId,
      staffName
    });
  }
  
  return orders;
};

// Generate mock data for the dashboard
export const generateMockData = () => {
  const users = generateMockUsers();
  const orders = generateMockOrders(users);
  
  return {
    users,
    orders
  };
};
