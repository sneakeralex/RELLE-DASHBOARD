import random
import string
import time
from datetime import datetime, timedelta
import uuid
import re

# Number of records to generate
NUM_RECORDS = 36320  # To reach 39,450 total (current 3,130 + 36,320 new)

# Last customer ID in the database is 00000058, so we'll start from 00000059
STARTING_ID = 59

# Chinese surnames and given names for generating realistic names
chinese_surnames = [
    "王", "李", "张", "刘", "陈", "杨", "黄", "赵", "吴", "周", "徐", "孙", "马", "朱", "胡", "林", "郭", "何", "高", "罗",
    "郑", "梁", "谢", "宋", "唐", "许", "邓", "冯", "韩", "曹", "曾", "彭", "萧", "蔡", "潘", "田", "董", "袁", "于", "余",
    "叶", "蒋", "杜", "苏", "魏", "程", "吕", "丁", "沈", "任", "姚", "卢", "傅", "钟", "姜", "崔", "谭", "廖", "范", "汪",
    "陆", "金", "石", "戴", "贾", "韦", "夏", "邱", "方", "侯", "邹", "熊", "孟", "秦", "白", "江", "阎", "薛", "尹", "段",
    "雷", "黎", "史", "龙", "贺", "陶", "顾", "毛", "郝", "龚", "邵", "万", "钱", "严", "赖", "覃", "洪", "武", "莫", "孔"
]

# Function to generate a random date between start_date and end_date
def random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return start_date + timedelta(days=random_number_of_days)

# Common Chinese characters for given names (male-oriented)
male_given_name_chars = '一二三四五六七八九十百千万甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥春夏秋冬东南西北中华国建军民伟刚强明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛雄琛钧冠策腾楠榕风航弘'

# Common Chinese characters for female given names
female_given_name_chars = '芳华美雅静淑惠珠莉娜婷婉娟妍媛妮琳琪琼瑶瑾璐嘉佳欣颖琳琴璇玲珊珍珺瑛瑗瑶璐璟丽丹云亦予仪伊优宜姿姝娅娆婵婧嫣嫦妙妍妮好如姗姝姣姿婕婧婵婷媚媛娅娆娉娜娟娥娴婉婷媛嫣妍妙妃妍姗姝娅娆婵婧嫣嫦妙妍妮好如姗姝姣姿婕婧婵婷媚媛娅娆娉娜娟娥娴婉婷媛嫣妍妙妃'

# Emoji and special characters for WeChat nicknames
emojis = '😊😂🥰😍😘💕❤️🌸🌹🌺🌷🌈🌟⭐️✨💫🔆🌞🌝🌙🌛🌜☀️🌤️⛅️🌥️☁️🌦️🌧️⛈️🌩️🌨️❄️☃️⛄️🔥💥✨🌟⚡️🌈☄️💫🌊🍓🍒🍎🍉🍊🍋🍌🍍🥭🍇🍏🍐🍑🍈🍋🍄🥝🥥🥑🥦🥬🥒🌽🌶️🥕🧄🧅🥔🍠🌰🥜'

# WeChat nickname prefixes and suffixes
nickname_prefixes = ['小', '大', '帅', '美', '可爱', '甜甜', '萌萌', '酷酷', '乖乖', '暖暖', '软软', '呆呆', '笨笨', '懒懒', '傻傻', '酷酷', '潇洒', '温柔', '可爱', '迷人', '魅力', '优雅', '高贵', '知性', '清新', '淡雅', '时尚', '靓丽', '漂亮', '美丽', '可人', '娇媚', '妩媚', '婉约', '温婉', '贤淑', '端庄', '大方', '得体', '优美', '秀丽', '秀美', '秀气', '秀雅', '秀逸', '秀色', '秀外慧中', '秀色可餐', '秀色可餐', '秀色可餐']
nickname_suffixes = ['宝宝', '贝贝', '公主', '王子', '小姐姐', '小哥哥', '小仙女', '小可爱', '小甜心', '小宝贝', '小天使', '小魔女', '小精灵', '小公举', '小公主', '小王子', '小仙子', '小魔王', '小天使', '小恶魔', '小妖精', '小妖女', '小妖男', '小魔女', '小魔男', '小仙女', '小仙男', '小公主', '小王子', '小天使', '小恶魔', '小妖精', '小妖女', '小妖男', '小魔女', '小魔男', '小仙女', '小仙男', '小公主', '小王子', '小天使', '小恶魔', '小妖精', '小妖女', '小妖男', '小魔女', '小魔男', '小仙女', '小仙男']

# Popular WeChat nickname patterns
popular_nicknames = [
    '一笑奈何', '一世长安', '一世浮华', '一世繁华', '一世倾城', '一世倾心', '一世情深', '一世深情', '一世深爱', '一世深情',
    '梦里花落', '梦里花开', '梦里花香', '梦里花醉', '梦里花飞', '梦里花舞', '梦里花语', '梦里花影', '梦里花雨', '梦里花海',
    '倾城一笑', '倾城之恋', '倾城之爱', '倾城之情', '倾城之心', '倾城之恋', '倾城之爱', '倾城之情', '倾城之心', '倾城之恋',
    '浅浅微笑', '浅浅心事', '浅浅心语', '浅浅心情', '浅浅心思', '浅浅心意', '浅浅心愿', '浅浅心念', '浅浅心动', '浅浅心跳',
    '淡淡微笑', '淡淡心事', '淡淡心语', '淡淡心情', '淡淡心思', '淡淡心意', '淡淡心愿', '淡淡心念', '淡淡心动', '淡淡心跳',
    '微微一笑', '微微心事', '微微心语', '微微心情', '微微心思', '微微心意', '微微心愿', '微微心念', '微微心动', '微微心跳',
    '安静如水', '安静如花', '安静如云', '安静如风', '安静如月', '安静如星', '安静如雪', '安静如梦', '安静如影', '安静如画',
    '清风徐来', '清风拂面', '清风明月', '清风明媚', '清风朗月', '清风皓月', '清风皎月', '清风如水', '清风如画', '清风如梦',
    '明月清风', '明月皎洁', '明月皓洁', '明月如水', '明月如画', '明月如梦', '明月如影', '明月如霜', '明月如雪', '明月如镜',
    '流年似水', '流年如水', '流年如梦', '流年如画', '流年如影', '流年如霜', '流年如雪', '流年如镜', '流年如花', '流年如云',
    '岁月如歌', '岁月如诗', '岁月如画', '岁月如梦', '岁月如影', '岁月如霜', '岁月如雪', '岁月如镜', '岁月如花', '岁月如云',
    '时光如水', '时光如梦', '时光如画', '时光如影', '时光如霜', '时光如雪', '时光如镜', '时光如花', '时光如云', '时光如风',
    '青春如歌', '青春如诗', '青春如画', '青春如梦', '青春如影', '青春如霜', '青春如雪', '青春如镜', '青春如花', '青春如云',
    '温柔如水', '温柔如花', '温柔如云', '温柔如风', '温柔如月', '温柔如星', '温柔如雪', '温柔如梦', '温柔如影', '温柔如画',
    '温暖如阳', '温暖如春', '温暖如夏', '温暖如秋', '温暖如冬', '温暖如风', '温暖如雨', '温暖如雪', '温暖如梦', '温暖如影',
]

# Female names (first names only)
female_names = [
    '芳', '华', '美', '雅', '静', '淑', '惠', '珠', '莉', '娜', '婷', '婉', '娟', '妍', '媛', '妮', '琳', '琪', '琼', '瑶',
    '瑾', '璐', '嘉', '佳', '欣', '颖', '琳', '琴', '璇', '玲', '珊', '珍', '珺', '瑛', '瑗', '瑶', '璐', '璟', '丽', '丹',
    '云', '亦', '予', '仪', '伊', '优', '宜', '姿', '姝', '娅', '娆', '婵', '婧', '嫣', '嫦', '妙', '妍', '妮', '好', '如',
    '姗', '姝', '姣', '姿', '婕', '婧', '婵', '婷', '媚', '媛', '娅', '娆', '娉', '娜', '娟', '娥', '娴', '婉', '婷', '媛',
    '嫣', '妍', '妙', '妃', '妍', '姗', '姝', '娅', '娆', '婵', '婧', '嫣', '嫦', '妙', '妍', '妮', '好', '如', '姗', '姝',
    '姣', '姿', '婕', '婧', '婵', '婷', '媚', '媛', '娅', '娆', '娉', '娜', '娟', '娥', '娴', '婉', '婷', '媛', '嫣', '妍',
    '妙', '妃', '小雨', '小云', '小燕', '小玉', '小芳', '小红', '小花', '小兰', '小丽', '小丹', '小娟', '小芬', '小英', '小梅',
    '小莉', '小华', '小琴', '小萍', '小玲', '小娜', '小雪', '小艳', '小凤', '小婷', '小霞', '小静', '小敏', '小洁', '小燕', '小娥',
    '小菊', '小珍', '小芹', '小娣', '小芸', '小莹', '小萱', '小蓉', '小颖', '小倩', '小婧', '小瑶', '小璐', '小琳', '小雯', '小楠',
    '小茜', '小菲', '小媛', '小琪', '小璇', '小颖', '小瑾', '小婕', '小蕾', '小莎', '小蓓', '小妍', '小瑜', '小璟', '小颍', '小婵',
    '小瑛', '小瑗', '小瑶', '小璐', '小璟', '小丽', '小丹', '小云', '小亦', '小予', '小仪', '小伊', '小优', '小宜', '小姿', '小姝',
    '小娅', '小娆', '小婵', '小婧', '小嫣', '小嫦', '小妙', '小妍', '小妮', '小好', '小如', '小姗', '小姝', '小姣', '小姿', '小婕',
    '小婧', '小婵', '小婷', '小媚', '小媛', '小娅', '小娆', '小娉', '小娜', '小娟', '小娥', '小娴', '小婉', '小婷', '小媛', '小嫣',
    '小妍', '小妙', '小妃', '小妍', '小姗', '小姝', '小娅', '小娆', '小婵', '小婧', '小嫣', '小嫦', '小妙', '小妍', '小妮', '小好',
    '小如', '小姗', '小姝', '小姣', '小姿', '小婕', '小婧', '小婵', '小婷', '小媚', '小媛', '小娅', '小娆', '小娉', '小娜', '小娟',
    '小娥', '小娴', '小婉', '小婷', '小媛', '小嫣', '小妍', '小妙', '小妃',
]

# Function to generate a random Chinese name
def generate_chinese_name(gender=None):
    surname = random.choice(chinese_surnames)

    # Determine gender if not specified
    if gender is None:
        gender = random.choices([0, 1, 2], weights=[0.05, 0.1, 0.85])[0]  # 85% female

    # Generate given name based on gender
    if gender == 1:  # male
        given_name_length = random.choice([1, 2])
        given_name = ''.join(random.choice(male_given_name_chars) for _ in range(given_name_length))
    else:  # female or unknown
        given_name_length = random.choice([1, 2])
        given_name = ''.join(random.choice(female_given_name_chars) for _ in range(given_name_length))

    return surname + given_name

# Function to generate a WeChat nickname
def generate_wechat_nickname(gender=None):
    # Determine gender if not specified
    if gender is None:
        gender = random.choices([0, 1, 2], weights=[0.05, 0.1, 0.85])[0]  # 85% female

    nickname_type = random.choices([
        'name',          # Just a name
        'prefix_name',   # Prefix + name
        'name_suffix',   # Name + suffix
        'popular',       # Popular nickname pattern
        'emoji_name',    # Emoji + name
        'name_emoji',    # Name + emoji
        'full_custom'    # Fully customized
    ], weights=[0.15, 0.15, 0.15, 0.2, 0.1, 0.1, 0.15])[0]

    name = generate_chinese_name(gender)

    if nickname_type == 'name':
        return name
    elif nickname_type == 'prefix_name':
        prefix = random.choice(nickname_prefixes)
        return prefix + name
    elif nickname_type == 'name_suffix':
        suffix = random.choice(nickname_suffixes)
        return name + suffix
    elif nickname_type == 'popular':
        return random.choice(popular_nicknames)
    elif nickname_type == 'emoji_name':
        emoji = random.choice(emojis)
        return emoji + name
    elif nickname_type == 'name_emoji':
        emoji = random.choice(emojis)
        return name + emoji
    elif nickname_type == 'full_custom':
        # Create a fully customized nickname
        if random.random() < 0.5:
            # Use a popular nickname with emoji
            nickname = random.choice(popular_nicknames)
            if random.random() < 0.7:  # 70% chance to add emoji
                emoji_count = random.randint(1, 3)
                for _ in range(emoji_count):
                    if random.random() < 0.5:
                        nickname = random.choice(emojis) + nickname
                    else:
                        nickname = nickname + random.choice(emojis)
            return nickname
        else:
            # Create a custom nickname with prefix/suffix
            if random.random() < 0.5:
                nickname = random.choice(nickname_prefixes) + name
            else:
                nickname = name + random.choice(nickname_suffixes)

            # Add emoji
            if random.random() < 0.7:  # 70% chance to add emoji
                emoji_count = random.randint(1, 2)
                for _ in range(emoji_count):
                    if random.random() < 0.5:
                        nickname = random.choice(emojis) + nickname
                    else:
                        nickname = nickname + random.choice(emojis)
            return nickname

# Function to generate a female name
def generate_female_name():
    if random.random() < 0.7:  # 70% chance for a simple female name
        return random.choice(female_names)
    else:  # 30% chance for a compound name
        surname = random.choice(chinese_surnames)
        given_name = random.choice(female_names)
        return surname + given_name

# Generate SQL file
with open('mock_data.sql', 'w', encoding='utf-8') as f:
    f.write("USE relle_mall_release;\n\n")
    f.write("START TRANSACTION;\n\n")

    batch_size = 1000
    for i in range(0, NUM_RECORDS, batch_size):
        batch_end = min(i + batch_size, NUM_RECORDS)
        values_list = []

        for j in range(i, batch_end):
            # Generate unique IDs
            customer_id = f"{STARTING_ID + j:08d}"
            unionid = f"ojqzL{uuid.uuid4().hex[:24]}"
            mini_openid = f"o4GyE5{uuid.uuid4().hex[:24]}"

            # Determine gender - 85% female
            user_gender = random.choices([0, 1, 2], weights=[0.05, 0.1, 0.85])[0]  # 0: unknown, 1: male, 2: female

            # Generate user information
            has_nickname = random.random() > 0.2  # 80% chance to have a nickname
            if has_nickname:
                wechat_nickname = generate_wechat_nickname(user_gender)
                # Escape single quotes for SQL
                wechat_nickname = wechat_nickname.replace("'", "\\'")
                wechat_nickname = f"'{wechat_nickname}'"
            else:
                wechat_nickname = "''"

            # Generate user_name (mostly female names)
            has_username = random.random() > 0.6  # 40% chance to have a username
            if has_username:
                user_name = f"'{generate_female_name()}'"
            else:
                user_name = "''"

            has_phone = random.random() > 0.2  # 80% chance to have a phone
            wechat_phone = f"'1{random.choice(['3', '4', '5', '6', '7', '8', '9'])}{random.randint(10000000, 99999999)}'" if has_phone else "''"

            has_birthdate = random.random() > 0.3  # 70% chance to have a birthdate
            if has_birthdate:
                # Women tend to be younger in the dataset
                if user_gender == 2:  # female
                    start_date = datetime(1980, 1, 1)
                    end_date = datetime(2005, 12, 31)
                else:
                    start_date = datetime(1960, 1, 1)
                    end_date = datetime(2000, 12, 31)
                birthdate = random_date(start_date, end_date)
                user_birthdate = f"'{birthdate.strftime('%Y-%m-%d')}'"
            else:
                user_birthdate = "''"

            # Generate timestamps
            start_time = datetime(2022, 1, 1)
            end_time = datetime(2023, 12, 31)
            create_time = random_date(start_time, end_time)
            update_time = random_date(create_time, end_time)

            # Format the values for SQL
            values = f"(NULL, '{unionid}', '{mini_openid}', '{customer_id}', {wechat_nickname}, {wechat_phone}, '/relle-media/avatar/default.png', {user_name}, {user_gender}, {user_birthdate}, '/relle-media/avatar/default.png', '{unionid}', '{create_time.strftime('%Y-%m-%d %H:%M:%S')}', '{unionid}', '{update_time.strftime('%Y-%m-%d %H:%M:%S')}', 0)"
            values_list.append(values)

        # Write batch insert statement
        f.write("INSERT INTO `app_customer_info` (`id`, `unionid`, `mini_openid`, `customer_id`, `wechat_nickname`, `wechat_phone`, `wechat_avatar_src`, `user_name`, `user_gender`, `user_birthdate`, `user_avatar_src`, `create_by`, `create_time`, `update_by`, `update_time`, `deleted`) VALUES\n")
        f.write(",\n".join(values_list))
        f.write(";\n\n")

    f.write("COMMIT;\n")

print("Mock data SQL script generated successfully!")
