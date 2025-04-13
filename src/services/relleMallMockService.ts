import { User } from '../types/user';
import { Order, OrderItem } from '../types/order';
import { Shop } from '../types/shop';
import { subDays, addDays, format } from 'date-fns';
import { employeeNames } from './employeeNames';
import { shopNames, shopIntroductions } from './shopNames';

// Generate random date within a range
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Generate random number within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random decimal number within a range
const randomDecimal = (min: number, max: number, decimals: number = 2): number => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

// Chinese names for more realistic data
const chineseFirstNames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
const chineseLastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞'];

// Chinese locations/addresses
const chineseLocations = [
  '北京市朝阳区建国路88号',
  '上海市静安区南京西路1266号',
  '广州市天河区天河路385号',
  '深圳市福田区深南大道7888号',
  '成都市锦江区红星路三段1号',
  '杭州市西湖区西湖文化广场19号',
  '南京市鼓楼区中山北路8号',
  '武汉市江汉区解放大道688号',
  '西安市碑林区南关正街88号',
  '重庆市渝中区解放碑步行街18号'
];

// Chinese service types
const chineseServiceTypes = ['剪发', '染发', '造型', '美甲', '足疗', '面部护理', '按摩', '脱毛'];

// Chinese payment methods
const chinesePaymentMethods = ['支付宝', '微信支付', '银联卡', '现金', '礼品卡'];

// Generate random Chinese name
const generateChineseName = (): string => {
  const firstName = chineseFirstNames[randomNumber(0, chineseFirstNames.length - 1)];
  const lastName = chineseLastNames[randomNumber(0, chineseLastNames.length - 1)];
  return `${firstName}${lastName}`;
};

// Generate random Chinese phone number
const generateChinesePhoneNumber = (): string => {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '186', '187', '188', '189'];
  const prefix = prefixes[randomNumber(0, prefixes.length - 1)];
  const suffix = Array(8).fill(0).map(() => randomNumber(0, 9)).join('');
  return `${prefix}${suffix}`;
};

// Generate random unionid (similar to WeChat unionid)
const generateUnionId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  return 'ojqzL' + Array(23).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// Generate random mini_openid
const generateMiniOpenId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  return 'o4GyE5' + Array(22).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// Generate customer ID with leading zeros
const generateCustomerId = (index: number): string => {
  return String(index).padStart(8, '0');
};

// Generate random birthday
const generateBirthday = (): string => {
  const year = randomNumber(1970, 2000);
  const month = randomNumber(1, 12).toString().padStart(2, '0');
  const day = randomNumber(1, 28).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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

// Generate random avatar URL
const generateAvatarUrl = (): string => {
  return `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${randomNumber(1, 99)}.jpg`;
};

// Generate random order number
const generateOrderNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-10);
  const random = randomNumber(1000, 9999).toString();
  return `ORD${timestamp}${random}`;
};

// Generate mock shops based on relle_shop table
export const generateRelleShops = (count: number = 10): Shop[] => {
  const shops: Shop[] = [];
  const now = new Date();
  const oneYearAgo = subDays(now, 365);
  
  for (let i = 0; i < count; i++) {
    const openDate = randomDate(subDays(oneYearAgo, 1000), oneYearAgo);
    const createTime = randomDate(new Date(openDate), now);
    const updateTime = randomDate(new Date(createTime), now);
    
    shops.push({
      id: i + 1,
      name: shopNames[i % shopNames.length],
      address: chineseLocations[i % chineseLocations.length],
      coverImg: `https://picsum.photos/800/600?random=${i + 1}`,
      longitude: randomDecimal(116.0, 116.5, 6),
      latitude: randomDecimal(39.5, 40.0, 6),
      openDate: openDate.split('T')[0],
      introduce: shopIntroductions[i % shopIntroductions.length],
      status: 1, // 1 for active
      createdAt: createTime,
      updatedAt: updateTime
    });
  }
  
  return shops;
};

// Generate mock users based on app_customer_info table in relle_mall_release database
export const generateRelleCustomers = (count: number = 100): any[] => {
  const customers: any[] = [];
  const now = new Date();
  const startDate = subDays(now, 365); // 1 year ago
  
  for (let i = 0; i < count; i++) {
    const customerId = generateCustomerId(i + 54); // Starting from 54 as seen in the database
    const unionid = generateUnionId();
    const miniOpenid = generateMiniOpenId();
    const wechatNickname = Math.random() > 0.7 ? generateChineseName() : '';
    const wechatPhone = Math.random() > 0.5 ? generateChinesePhoneNumber() : '';
    const userGender = randomNumber(0, 2); // 0: unknown, 1: male, 2: female
    const userBirthdate = Math.random() > 0.6 ? generateBirthday() : '';
    const createdAt = randomDate(startDate, now);
    const updatedAt = randomDate(new Date(createdAt), now);
    
    customers.push({
      id: customerId,
      unionid: unionid,
      mini_openid: miniOpenid,
      wechat_nickname: wechatNickname,
      wechat_phone: wechatPhone,
      user_gender: userGender,
      user_birthdate: userBirthdate,
      avatar: '/relle-media/avatar/default.png',
      name: wechatNickname || `用户${customerId}`, // For compatibility with existing code
      phone: wechatPhone,
      create_time: createdAt,
      update_time: updatedAt
    });
  }
  
  return customers;
};

// Generate mock orders based on relle_order table
export const generateRelleOrders = (customers: any[], count: number = 300): any[] => {
  const orders: any[] = [];
  const now = new Date();
  const startDate = subDays(now, 365); // 1 year ago
  
  for (let i = 0; i < count; i++) {
    const customerIndex = randomNumber(0, customers.length - 1);
    const customer = customers[customerIndex];
    const amount = randomDecimal(50, 2000, 2);
    const placeOrderTime = randomDate(startDate, now);
    const status = randomNumber(0, 3); // 0: pending, 1: paid, 2: completed, 3: canceled
    const payTime = status >= 1 ? randomDate(new Date(placeOrderTime), now) : null;
    const createTime = placeOrderTime;
    const updateTime = payTime || createTime;
    
    orders.push({
      order_no: generateOrderNumber(),
      customer_id: customer.id,
      amount: amount,
      status: status,
      place_order_time: placeOrderTime,
      pay_time: payTime,
      create_user_id: `admin${randomNumber(1, 5)}`,
      create_time: createTime,
      update_user_id: `admin${randomNumber(1, 5)}`,
      update_time: updateTime
    });
  }
  
  return orders;
};

// Convert relle_customer to User type for the dashboard
const convertToUser = (customer: any): User => {
  const birthdate = customer.user_birthdate || '';
  const age = calculateAge(birthdate);
  
  return {
    id: customer.id, // Use customer_id directly as id
    name: customer.name,
    phone: customer.phone || generateChinesePhoneNumber(), // Ensure phone is always populated
    createdAt: customer.create_time,
    updatedAt: customer.update_time,
    lastVisit: customer.update_time,
    totalSpent: randomNumber(0, 10000),
    loyaltyPoints: randomNumber(0, 2000),
    preferredLocation: chineseLocations[randomNumber(0, chineseLocations.length - 1)],
    // Additional fields from app_customer_info
    unionid: customer.unionid,
    miniOpenid: customer.mini_openid,
    gender: customer.user_gender || 0, // Renamed from userGender to gender
    birthdate: birthdate, // Renamed from userBirthdate to birthdate
    age: age, // Added age field
    avatarSrc: customer.avatar || '/relle-media/avatar/default.png'
  };
};

// Convert relle_order to Order type for the dashboard
const convertToOrder = (order: any, customers: any[]): Order => {
  const customer = customers.find(c => c.id === order.customer_id) || { name: 'Unknown' };
  const orderItems = Array(randomNumber(1, 5)).fill(0).map((_, index) => {
    const serviceType = chineseServiceTypes[randomNumber(0, chineseServiceTypes.length - 1)];
    const price = randomDecimal(50, 500, 2);
    const quantity = randomNumber(1, 3);
    
    return {
      id: `item-${index + 1}`,
      name: serviceType,
      price,
      quantity,
      serviceType
    };
  });
  
  let status: 'pending' | 'completed' | 'canceled';
  switch (order.status) {
    case 0:
      status = 'pending';
      break;
    case 1:
    case 2:
      status = 'completed';
      break;
    case 3:
      status = 'canceled';
      break;
    default:
      status = 'pending';
  }
  
  return {
    id: order.order_no,
    userId: order.customer_id,
    customerName: customer.name,
    totalAmount: order.amount,
    orderDate: order.place_order_time,
    status,
    items: orderItems,
    paymentMethod: chinesePaymentMethods[randomNumber(0, chinesePaymentMethods.length - 1)],
    staffId: `staff-${randomNumber(1, employeeNames.length)}`,
    staffName: employeeNames[randomNumber(0, employeeNames.length - 1)]
  };
};

// Generate mock data for the dashboard based on relle database
export const generateRelleMallMockData = (userCount: number = 100, orderCount: number = 300) => {
  // Ensure the counts are within the allowed ranges
  const validUserCount = Math.max(100, Math.min(100000, userCount));
  const validOrderCount = Math.max(100, Math.min(50000, orderCount));
  
  console.log(`Generating mock data with ${validUserCount} customers and ${validOrderCount} orders`);
  
  // Generate data based on relle database tables
  const shops = generateRelleShops(10);
  const customers = generateRelleCustomers(validUserCount);
  const orders = generateRelleOrders(customers, validOrderCount);
  
  // Convert to dashboard data types
  const users: User[] = customers.map(convertToUser);
  const dashboardOrders: Order[] = orders.map(order => convertToOrder(order, customers));
  
  return {
    users,
    orders: dashboardOrders,
    shops,
    rawData: {
      customers,
      orders
    }
  };
};
