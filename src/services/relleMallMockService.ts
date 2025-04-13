import { User } from '../types/user';
import { Order, OrderItem } from '../types/order';
import { Shop } from '../types/shop';
import { subDays, addDays, format } from 'date-fns';

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

// Chinese staff names
const chineseStaffNames = ['小红', '小明', '小芳', '小丽', '小强', '小杰', '小娟', '小华', '小燕', '小龙'];

// Shop names
const shopNames = [
  '美丽空间旗舰店',
  '魅力风尚店',
  '靓颜美妆中心',
  '时尚美肤馆',
  '优雅美容院',
  '尚美造型店',
  '丽人美妆店',
  '美丽传奇店',
  '魅力无限店',
  '美丽人生店'
];

// Shop introductions
const shopIntroductions = [
  '本店专注于提供高品质的美容美发服务，拥有专业的技术团队和舒适的环境，致力于为每位顾客带来美丽与自信。',
  '作为美丽空间连锁的旗舰店，我们提供全方位的美容美发服务，包括剪发、染发、造型、美甲、足疗、面部护理等，让您焕发光彩。',
  '我们的店铺环境舒适，设备先进，技术精湛，为顾客提供一站式美容美发服务，让您在忙碌的生活中找到放松与美丽。',
  '本店秉承"美丽源于专业"的理念，提供个性化的美容美发方案，满足不同顾客的需求，让每位顾客都能找到属于自己的美丽。',
  '我们的团队由经验丰富的美容美发师组成，他们不断学习国际最新技术，为顾客带来时尚前沿的美容美发体验。'
];

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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array(28).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// Generate random birthday
const generateBirthday = (): string => {
  const year = randomNumber(1970, 2000);
  const month = randomNumber(1, 12).toString().padStart(2, '0');
  const day = randomNumber(1, 28).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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

// Generate mock users based on relle_customer table
export const generateRelleCustomers = (count: number = 100): any[] => {
  const customers: any[] = [];
  const now = new Date();
  const startDate = subDays(now, 365); // 1 year ago

  for (let i = 0; i < count; i++) {
    const createTime = randomDate(startDate, now);
    const updateTime = randomDate(new Date(createTime), now);

    customers.push({
      id: i + 1,
      unionid: generateUnionId(),
      name: generateChineseName(),
      phone: generateChinesePhoneNumber(),
      avatar: generateAvatarUrl(),
      birthday: generateBirthday(),
      create_user_id: `admin${randomNumber(1, 5)}`,
      create_time: createTime,
      update_user_id: `admin${randomNumber(1, 5)}`,
      update_time: updateTime
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
  return {
    id: `user-${customer.id}`,
    name: customer.name,
    email: `${customer.phone}@example.com`, // Generate email from phone
    phone: customer.phone,
    createdAt: customer.create_time,
    updatedAt: customer.update_time,
    lastVisit: customer.update_time,
    totalSpent: randomNumber(0, 10000),
    loyaltyPoints: randomNumber(0, 2000),
    preferredLocation: chineseLocations[randomNumber(0, chineseLocations.length - 1)]
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
    userId: `user-${order.customer_id}`,
    customerName: customer.name,
    totalAmount: order.amount,
    orderDate: order.place_order_time,
    status,
    items: orderItems,
    paymentMethod: chinesePaymentMethods[randomNumber(0, chinesePaymentMethods.length - 1)],
    location: chineseLocations[randomNumber(0, chineseLocations.length - 1)],
    staffId: `staff-${randomNumber(1, 10)}`,
    staffName: chineseStaffNames[randomNumber(0, chineseStaffNames.length - 1)]
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
