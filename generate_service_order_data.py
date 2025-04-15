import random
import string
import time
from datetime import datetime, timedelta
import uuid

# Number of records to generate
NUM_RECORDS = 37222  # To reach 41,491 total (current 4,269 + 37,222 new)

# Last ID in the database
STARTING_ID = 10000  # Using a much higher starting ID to avoid conflicts

# Function to generate a random date between start_date and end_date
def random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return start_date + timedelta(days=random_number_of_days)

# Function to generate a random order ID
def generate_order_id(store_id):
    timestamp = datetime.now().strftime("%y%m%d%H%M%S")
    random_num = ''.join(random.choices(string.digits, k=3))
    return f"{store_id}{timestamp}{random_num}"

# Function to generate a random phone number
def generate_phone_number():
    prefix = random.choice(['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                           '150', '151', '152', '153', '155', '156', '157', '158', '159',
                           '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'])
    suffix = ''.join(random.choices(string.digits, k=8))
    return f"{prefix}{suffix}"

# Function to get unionid from app_customer_info table
def get_unionids_from_db():
    # This is a placeholder. In a real scenario, you would query the database.
    # For now, we'll generate random unionids
    return [f"ojqzL{uuid.uuid4().hex[:24]}" for _ in range(1000)]

# Constants based on the database analysis
STORE_IDS = ['SH0001', 'SH0002', 'SH0003']
ROOM_IDS = ['01', '02', '03', '04', '05', '06']
ORDER_STATUSES = [2, 4, 16, 1024]  # Based on the distinct values in the database
CUSTOMER_SOURCES = ['小程序']  # Default value from the database

# Chinese names for contact_name
CHINESE_NAMES = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
    '郑一', '王二', '陈三', '李四', '张五', '刘六', '黄七', '周八',
    '吴九', '郑十', '孙一', '朱二', '马三', '胡四', '林五', '郭六',
    '何七', '高八', '罗九', '郑十', '梁一', '谢二', '宋三', '唐四',
    '许五', '韩六', '冯七', '邓八', '曹九', '彭十', '曾一', '萧二',
    '田三', '董四', '袁五', '潘六', '蔡七', '贾八', '蒋九', '沈十',
    '钟一', '汪二', '苏三', '王丽', '李娜', '张燕', '刘洋', '陈静',
    '杨华', '赵敏', '吴秀', '郑丽', '王芳', '李玲', '张敏', '刘静',
    '陈丽', '杨芳', '赵娟', '吴丽', '郑秀', '王娟', '李秀', '张丽',
    '刘芳', '陈娟', '杨静', '赵芳', '吴静', '郑娟', '王静', '李芳'
]

# Get unionids (in a real scenario, you would query the database)
unionids = get_unionids_from_db()

# Generate SQL file
with open('service_order_mock_data.sql', 'w', encoding='utf-8') as f:
    f.write("USE relle_mall_release;\n\n")
    f.write("START TRANSACTION;\n\n")

    batch_size = 1000
    for i in range(0, NUM_RECORDS, batch_size):
        batch_end = min(i + batch_size, NUM_RECORDS)
        values_list = []

        for j in range(i, batch_end):
            # Generate unique IDs and values
            id = STARTING_ID + j
            store_id = random.choice(STORE_IDS)
            order_id = generate_order_id(store_id)
            unionid = random.choice(unionids)
            room_id = random.choice(ROOM_IDS)

            # Generate prices
            origin_price = round(random.uniform(100, 2000), 2)
            reduction_amount = round(random.uniform(0, origin_price * 0.3), 2) if random.random() < 0.3 else 0
            order_amount = origin_price - reduction_amount

            # Generate contact information
            contact_name = random.choice(CHINESE_NAMES)
            contact_phone = generate_phone_number()

            # Generate order status and related fields
            order_status = random.choice(ORDER_STATUSES)

            # Generate timestamps
            start_time = datetime(2022, 1, 1)
            end_time = datetime(2023, 12, 31)
            create_time = random_date(start_time, end_time)
            update_time = random_date(create_time, end_time)

            # Other fields
            create_by = unionid
            update_by = random.choice([unionid, 'signIn', 'AutoCloseOrderJob'])
            deleted = 0
            modify_num = random.randint(0, 3)
            customer_source = '小程序'
            source_order_id = 'NULL'
            write_off = 0
            write_off_time = 'NULL'
            write_off_user = "''"

            # Format the values for SQL
            values = f"({id}, '{order_id}', '{unionid}', '{store_id}', '{room_id}', {order_amount:.2f}, '{contact_name}', '{contact_phone}', {origin_price:.2f}, {reduction_amount:.2f}, {order_status}, '{create_time.strftime('%Y-%m-%d %H:%M:%S')}', '{create_by}', '{update_time.strftime('%Y-%m-%d %H:%M:%S')}', '{update_by}', {deleted}, {modify_num}, '{customer_source}', {source_order_id}, {write_off}, {write_off_time}, {write_off_user})"
            values_list.append(values)

        # Write batch insert statement
        f.write("INSERT INTO `app_service_order` (`id`, `order_id`, `unionid`, `sotre_id`, `room_id`, `order_amount`, `contact_name`, `contact_phone`, `origin_price`, `reduction_amount`, `order_status`, `create_time`, `create_by`, `update_time`, `update_by`, `deleted`, `modify_num`, `customer_source`, `source_order_id`, `write_off`, `write_off_time`, `write_off_user`) VALUES\n")
        f.write(",\n".join(values_list))
        f.write(";\n\n")

    f.write("COMMIT;\n")

print("Mock data SQL script generated successfully!")
