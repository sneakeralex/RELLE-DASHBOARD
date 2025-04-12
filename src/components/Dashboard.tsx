import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchDashboardData, refreshMockData } from '../services/api';
import { DashboardData } from '../types/statistics';
import SimpleLineChart from './SimpleLineChart';
import PieChart from './Charts/PieChart';
import HeatMap from './Charts/HeatMap';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Mock data for service distribution
  const [serviceData, setServiceData] = useState({
    labels: ['Haircut', 'Coloring', 'Styling', 'Manicure', 'Pedicure', 'Facial', 'Massage', 'Waxing'],
    data: [120, 85, 65, 95, 75, 55, 40, 35]
  });

  // Mock data for busy hours heatmap
  const [busyHoursData, setBusyHoursData] = useState({
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yLabels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'],
    data: [
      [12, 15, 8, 10, 18, 25, 5],
      [15, 18, 12, 14, 22, 28, 8],
      [20, 22, 18, 16, 25, 30, 12],
      [25, 20, 22, 18, 20, 25, 15],
      [15, 18, 20, 22, 24, 20, 10],
      [18, 20, 22, 24, 28, 22, 12],
      [22, 24, 26, 20, 22, 18, 8],
      [18, 20, 15, 16, 20, 15, 5],
      [12, 15, 10, 12, 18, 10, 3],
      [8, 10, 8, 6, 12, 5, 2]
    ]
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      refreshMockData();
      await loadDashboardData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="error">
          Failed to load dashboard data
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={loadDashboardData}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Beauty Chain Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Orders" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to the Beauty Chain Dashboard. Here you can view key metrics for your beauty salon chain business.
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f4fc' }}>
                    <Typography variant="h6" color="primary">
                      Total Users
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.userStats.totalUsers.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4f8fc' }}>
                    <Typography variant="h6" color="primary">
                      Total Orders
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.orderStats.totalOrders.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4fcf8' }}>
                    <Typography variant="h6" color="primary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h3">
                      ${dashboardData.orderStats.totalRevenue.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fcf4f8' }}>
                    <Typography variant="h6" color="primary">
                      Avg. Order Value
                    </Typography>
                    <Typography variant="h3">
                      ${dashboardData.orderStats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User Growth Trend
              </Typography>
              <SimpleLineChart
                data={dashboardData.userTrend}
                title="New Users Over Time"
                color="#8e44ad"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Trend
              </Typography>
              <SimpleLineChart
                data={dashboardData.revenueTrend}
                title="Revenue Over Time"
                color="#2ecc71"
                isCurrency={true}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Service Distribution
              </Typography>
              <PieChart
                title="Popular Services"
                labels={serviceData.labels}
                data={serviceData.data}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Busy Hours by Day
              </Typography>
              <HeatMap
                title="Customer Traffic"
                data={busyHoursData.data}
                xLabels={busyHoursData.xLabels}
                yLabels={busyHoursData.yLabels}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Users
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${user.totalSpent.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
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
                    {dashboardData.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={order.status}
                            color={
                              order.status === 'completed' ? 'success' :
                              order.status === 'pending' ? 'warning' : 'error'
                            }
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

          {authState.user?.role === 'admin' && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Admin Controls
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  As an administrator, you can modify the dashboard settings and refresh the data.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh All Data'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component="a"
                    href="/settings"
                  >
                    Data Configuration
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                User Statistics
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f4fc' }}>
                    <Typography variant="h6" color="primary">
                      Total Users
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.userStats.totalUsers.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4f8fc' }}>
                    <Typography variant="h6" color="primary">
                      New Users (Today)
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.userStats.newUsersToday.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4fcf8' }}>
                    <Typography variant="h6" color="primary">
                      New Users (Week)
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.userStats.newUsersThisWeek.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fcf4f8' }}>
                    <Typography variant="h6" color="primary">
                      New Users (Month)
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.userStats.newUsersThisMonth.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User Growth Trend
              </Typography>
              <SimpleLineChart
                data={dashboardData.userTrend}
                title="New Users Over Time"
                color="#8e44ad"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Users
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Spent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${user.totalSpent.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Order Statistics
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f4fc' }}>
                    <Typography variant="h6" color="primary">
                      Total Orders
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.orderStats.totalOrders.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4f8fc' }}>
                    <Typography variant="h6" color="primary">
                      Orders (Today)
                    </Typography>
                    <Typography variant="h3">
                      {dashboardData.orderStats.ordersToday.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f4fcf8' }}>
                    <Typography variant="h6" color="primary">
                      Revenue (Today)
                    </Typography>
                    <Typography variant="h3">
                      ${dashboardData.orderStats.revenueToday.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fcf4f8' }}>
                    <Typography variant="h6" color="primary">
                      Avg. Order Value
                    </Typography>
                    <Typography variant="h3">
                      ${dashboardData.orderStats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Trend
              </Typography>
              <SimpleLineChart
                data={dashboardData.orderTrend}
                title="Orders Over Time"
                color="#e74c3c"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Trend
              </Typography>
              <SimpleLineChart
                data={dashboardData.revenueTrend}
                title="Revenue Over Time"
                color="#2ecc71"
                isCurrency={true}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
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
                    {dashboardData.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={order.status}
                            color={
                              order.status === 'completed' ? 'success' :
                              order.status === 'pending' ? 'warning' : 'error'
                            }
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
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;