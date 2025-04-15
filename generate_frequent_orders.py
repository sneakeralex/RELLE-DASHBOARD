import random
import string
import time
from datetime import datetime, timedelta
import uuid

# 我们需要增加 3991 - 809 = 3182 个符合条件的用户
ADDITIONAL_USERS_NEEDED = 3182

# 每个用户在一个月内至少需要4天有订单
MIN_DAYS_WITH_ORDERS = 4

# 从现有用户中选择一些用户，为他们生成额外的订单
# 假设我们从 app_customer_info 表中选择用户
def get_customer_ids():
    # 这里应该从数据库中获取用户ID，但为了简化，我们生成一些随机ID
    return [f"ojqzL{uuid.uuid4().hex[:24]}" for _ in range(ADDITIONAL_USERS_NEEDED)]

# 生成一个随机日期，确保在同一个月内
def generate_dates_in_same_month(num_days, year=2023):
    # 随机选择一个月
    month = random.randint(1, 12)
    
    # 确定这个月有多少天
    if month in [4, 6, 9, 11]:
        max_day = 30
    elif month == 2:
        # 简单处理闰年
        if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
            max_day = 29
        else:
            max_day = 28
    else:
        max_day = 31
    
    # 随机选择不重复的天数
    days = random.sample(range(1, max_day + 1), min(num_days, max_day))
    
    # 转换为日期对象
    return [datetime(year, month, day) for day in days]

# 生成订单ID
def generate_order_id(store_id):
    timestamp = datetime.now().strftime("%y%m%d%H%M%S")
    random_num = ''.join(random.choices(string.digits, k=3))
    return f"{store_id}{timestamp}{random_num}"

# 生成联系人姓名
def generate_contact_name():
    first_names = ["张", "王", "李", "赵", "钱", "孙", "周", "吴", "郑", "王"]
    last_names = ["芳", "娜", "静", "敏", "丽", "艳", "娟", "婷", "洁", "燕"]
    return random.choice(first_names) + random.choice(last_names)

# 生成手机号
def generate_phone_number():
    prefix = random.choice(['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                           '150', '151', '152', '153', '155', '156', '157', '158', '159',
                           '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'])
    suffix = ''.join(random.choices(string.digits, k=8))
    return f"{prefix}{suffix}"

# 常量
STORE_IDS = ['SH0001', 'SH0002', 'SH0003']
ROOM_IDS = ['01', '02', '03', '04', '05', '06']
ORDER_STATUSES = [2, 4, 16, 1024]

# 生成SQL文件
with open('frequent_orders_mock_data.sql', 'w', encoding='utf-8') as f:
    f.write("USE relle_mall_release;\n\n")
    f.write("START TRANSACTION;\n\n")
    
    # 获取用户ID
    customer_ids = get_customer_ids()
    
    # 为每个用户生成多个订单
    order_id_counter = 50000  # 起始ID，确保不与现有ID冲突
    
    batch_size = 1000
    values_list = []
    
    for user_index, unionid in enumerate(customer_ids):
        # 为每个用户生成4-7天的订单日期（在同一个月内）
        num_days = random.randint(MIN_DAYS_WITH_ORDERS, MIN_DAYS_WITH_ORDERS + 3)
        order_dates = generate_dates_in_same_month(num_days)
        
        # 为每天生成1-3个订单
        for date in order_dates:
            num_orders_per_day = random.randint(1, 3)
            
            for _ in range(num_orders_per_day):
                order_id_counter += 1
                
                # 生成订单数据
                store_id = random.choice(STORE_IDS)
                order_id = generate_order_id(store_id)
                room_id = random.choice(ROOM_IDS)
                
                # 生成价格
                origin_price = round(random.uniform(100, 2000), 2)
                reduction_amount = round(random.uniform(0, origin_price * 0.3), 2) if random.random() < 0.3 else 0
                order_amount = origin_price - reduction_amount
                
                # 生成联系人信息
                contact_name = generate_contact_name()
                contact_phone = generate_phone_number()
                
                # 生成订单状态
                order_status = random.choice(ORDER_STATUSES)
                
                # 在当天的随机时间
                hour = random.randint(9, 21)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                create_time = date.replace(hour=hour, minute=minute, second=second)
                
                # 更新时间在创建时间之后
                update_time = create_time + timedelta(minutes=random.randint(30, 180))
                
                # 其他字段
                create_by = unionid
                update_by = random.choice([unionid, 'signIn', 'AutoCloseOrderJob'])
                deleted = 0
                modify_num = random.randint(0, 3)
                customer_source = '小程序'
                source_order_id = 'NULL'
                write_off = 0
                write_off_time = 'NULL'
                write_off_user = "''"
                
                # 格式化SQL值
                values = f"({order_id_counter}, '{order_id}', '{unionid}', '{store_id}', '{room_id}', {order_amount:.2f}, '{contact_name}', '{contact_phone}', {origin_price:.2f}, {reduction_amount:.2f}, {order_status}, '{create_time.strftime('%Y-%m-%d %H:%M:%S')}', '{create_by}', '{update_time.strftime('%Y-%m-%d %H:%M:%S')}', '{update_by}', {deleted}, {modify_num}, '{customer_source}', {source_order_id}, {write_off}, {write_off_time}, {write_off_user})"
                values_list.append(values)
                
                # 每1000条记录写入一次
                if len(values_list) >= batch_size:
                    f.write("INSERT INTO `app_service_order` (`id`, `order_id`, `unionid`, `sotre_id`, `room_id`, `order_amount`, `contact_name`, `contact_phone`, `origin_price`, `reduction_amount`, `order_status`, `create_time`, `create_by`, `update_time`, `update_by`, `deleted`, `modify_num`, `customer_source`, `source_order_id`, `write_off`, `write_off_time`, `write_off_user`) VALUES\n")
                    f.write(",\n".join(values_list))
                    f.write(";\n\n")
                    values_list = []
    
    # 写入剩余的记录
    if values_list:
        f.write("INSERT INTO `app_service_order` (`id`, `order_id`, `unionid`, `sotre_id`, `room_id`, `order_amount`, `contact_name`, `contact_phone`, `origin_price`, `reduction_amount`, `order_status`, `create_time`, `create_by`, `update_time`, `update_by`, `deleted`, `modify_num`, `customer_source`, `source_order_id`, `write_off`, `write_off_time`, `write_off_user`) VALUES\n")
        f.write(",\n".join(values_list))
        f.write(";\n\n")
    
    f.write("COMMIT;\n")

print("Frequent orders mock data generated successfully!")
