import React from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StatCard from './StatCard';
import LineChart from './Charts/LineChart';
import BarChart from './Charts/BarChart';
import { OrderStats as OrderStatsType } from '../types/order';
import { RecentOrder, TrendData } from '../types/statistics';
import { formatDate, formatCurrency } from '../utils/dateUtils';

interface OrderStatsProps {
  orderStats: OrderStatsType;
  recentOrders: RecentOrder[];
  orderTrend: TrendData[];
  revenueTrend: TrendData[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ 
  orderStats, 
  recentOrders, 
  orderTrend,
  revenueTrend
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Order Statistics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={orderStats.totalOrders}
            icon={<ShoppingCartIcon />}
            color="#e74c3c"
            percentChange={orderStats.orderGrowthRate}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={orderStats.totalRevenue}
            icon={<AttachMoneyIcon />}
            color="#2ecc71"
            isCurrency={true}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders This Week"
            value={orderStats.ordersThisWeek}
            icon={<ReceiptIcon />}
            color="#3498db"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Order Value"
            value={orderStats.averageOrderValue}
            icon={<TrendingUpIcon />}
            color="#f39c12"
            isCurrency={true}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Trend
            </Typography>
            <LineChart 
              title="Orders Over Time" 
              data={orderTrend} 
              color="#e74c3c" 
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue Trend
            </Typography>
            <LineChart 
              title="Revenue Over Time" 
              data={revenueTrend} 
              color="#2ecc71"
              isCurrency={true}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.orderDate, 'MMM dd')}</TableCell>
                      <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status) as "success" | "warning" | "error" | "default"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue by Period
            </Typography>
            <BarChart
              title="Revenue Comparison"
              labels={['Today', 'This Week', 'This Month']}
              data={[orderStats.revenueToday, orderStats.revenueThisWeek, orderStats.revenueThisMonth]}
              color="#f39c12"
              isCurrency={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderStats;
