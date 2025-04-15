USE relle_mall_release;

-- 查询一个月内有订单的天数超过4天的用户数量
-- 使用子查询代替WITH语法，以兼容旧版MySQL
SELECT
    COUNT(DISTINCT unionid) as user_count
FROM (
    SELECT
        unionid,
        order_year,
        order_month,
        COUNT(DISTINCT order_date) as days_with_orders
    FROM (
        SELECT
            unionid,
            DATE(create_time) as order_date,
            MONTH(create_time) as order_month,
            YEAR(create_time) as order_year
        FROM
            app_service_order
        WHERE
            deleted = 0
    ) as user_orders
    GROUP BY
        unionid, order_year, order_month
    HAVING
        days_with_orders >= 4
) as user_monthly_order_counts;
