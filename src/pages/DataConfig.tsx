import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Slider,
  Stack
} from '@mui/material';
import { refreshMockData, fetchUserData, fetchOrderData, setMockDataConfig } from '../services/api';
import { User } from '../types/user';
import { Order } from '../types/order';
import { useLanguage } from '../contexts/LanguageContext';

const DataConfig: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userCount, setUserCount] = useState<number>(1000);
  const [orderCount, setOrderCount] = useState<number>(500);
  const [configChanged, setConfigChanged] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserData();
        const orderData = await fetchOrderData();
        setUsers(userData);
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserCountChange = (_event: Event, newValue: number | number[]) => {
    setUserCount(newValue as number);
    setConfigChanged(true);
  };

  const handleOrderCountChange = (_event: Event, newValue: number | number[]) => {
    setOrderCount(newValue as number);
    setConfigChanged(true);
  };

  const handleApplyConfig = async () => {
    setRefreshing(true);
    try {
      // Update the mock data configuration
      await setMockDataConfig(userCount, orderCount);
      const newData = refreshMockData();
      setUsers(newData.users);
      setOrders(newData.orders);
      setConfigChanged(false);
      showSnackbar('Configuration applied successfully', 'success');
    } catch (error) {
      console.error('Error applying configuration:', error);
      showSnackbar('Error applying configuration', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      const newData = refreshMockData();
      setUsers(newData.users);
      setOrders(newData.orders);
      showSnackbar('Mock data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showSnackbar('Error refreshing data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('dataConfig.title') || 'Data Configuration'}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('dataConfig.description') || 'Configure and refresh mock data for the dashboard.'}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dataConfig.currentData') || 'Current Data'}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1">
                {t('dataConfig.users') || 'Users'}: {users.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1">
                {t('dataConfig.orders') || 'Orders'}: {orders.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dataConfig.dataSettings') || 'Data Settings'}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('dataConfig.dataSettingsDescription') || 'Configure the amount of mock data to generate. The number of users can range from 100 to 100,000, and the number of orders can range from 100 to 50,000.'}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('dataConfig.userCount') || 'Number of Users'} ({userCount.toLocaleString()})
            </Typography>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <Typography variant="body2">100</Typography>
              <Slider
                value={userCount}
                onChange={handleUserCountChange}
                min={100}
                max={100000}
                step={100}
                valueLabelDisplay="auto"
                aria-labelledby="user-count-slider"
                marks={[
                  { value: 100, label: '100' },
                  { value: 25000, label: '25K' },
                  { value: 50000, label: '50K' },
                  { value: 75000, label: '75K' },
                  { value: 100000, label: '100K' },
                ]}
              />
              <Typography variant="body2">100,000</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('dataConfig.orderCount') || 'Number of Orders'} ({orderCount.toLocaleString()})
            </Typography>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <Typography variant="body2">100</Typography>
              <Slider
                value={orderCount}
                onChange={handleOrderCountChange}
                min={100}
                max={50000}
                step={100}
                valueLabelDisplay="auto"
                aria-labelledby="order-count-slider"
                marks={[
                  { value: 100, label: '100' },
                  { value: 12500, label: '12.5K' },
                  { value: 25000, label: '25K' },
                  { value: 37500, label: '37.5K' },
                  { value: 50000, label: '50K' },
                ]}
              />
              <Typography variant="body2">50,000</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyConfig}
            disabled={refreshing || !configChanged}
            startIcon={refreshing ? <CircularProgress size={20} /> : undefined}
            sx={{ mr: 2 }}
          >
            {refreshing
              ? t('dataConfig.applying') || 'Applying...'
              : t('dataConfig.applyConfig') || 'Apply Configuration'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRefreshData}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={20} /> : undefined}
          >
            {refreshing
              ? t('dataConfig.refreshing') || 'Refreshing...'
              : t('dataConfig.refresh') || 'Refresh Data'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dataConfig.dataSource') || 'Data Source'}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('dataConfig.dataSourceDescription') || 'The mock data is based on the relle_mall database structure.'}
        </Typography>
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`Database: relle_mall
Host: 1.116.2.247:3306
Tables: Users, Orders, Products, etc.`}
          </Typography>
        </Box>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataConfig;
