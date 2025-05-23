import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { fetchOrderData } from '../services/api';
import { Order, OrderItem } from '../types/order';
import { formatCurrency } from '../utils/formatUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type SortOrder = 'asc' | 'desc';

interface HeadCell {
  id: keyof Order | 'actions';
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const getHeadCells = (t: any): HeadCell[] => [
  { id: 'id', label: t('orders.orderId') || 'Order ID', numeric: false, sortable: true },
  { id: 'customerName', label: t('orders.customer') || 'Customer', numeric: false, sortable: true },
  { id: 'orderDate', label: t('orders.orderDate') || 'Order Date', numeric: false, sortable: true },
  { id: 'totalAmount', label: t('orders.amount') || 'Amount', numeric: true, sortable: true },
  { id: 'status', label: t('orders.status') || 'Status', numeric: false, sortable: true },
  { id: 'paymentMethod', label: t('orders.paymentMethod') || 'Payment Method', numeric: false, sortable: true },
  { id: 'staffName', label: t('orders.beautician') || 'Beautician', numeric: false, sortable: true },
  { id: 'actions', label: t('common.actions') || 'Actions', numeric: false, sortable: false }
];

const OrdersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = useState<keyof Order>('orderDate');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderData();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error loading order data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...orders];

    // Apply search
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          (order.customerName?.toLowerCase().includes(lowerCaseSearch) || false) ||
          order.id.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply staff filter
    if (staffFilter !== 'all') {
      result = result.filter(order => order.staffName === staffFilter);
    }

    // Apply date filters
    if (startDate) {
      result = result.filter(
        order => new Date(order.orderDate) >= startDate
      );
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(
        order => new Date(order.orderDate) <= endOfDay
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (!aValue && !bValue) return 0;
      if (!aValue) return order === 'asc' ? -1 : 1;
      if (!bValue) return order === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numeric values
      return order === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, staffFilter, startDate, endDate, order, orderBy]);

  const handleRequestSort = (property: keyof Order) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderData();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error refreshing order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
    setStatusFilter('all');
    setStaffFilter('all');
  };

  const handleExpandRow = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Get unique staff names for filter
  const uniqueStaffNames = orders.map(order => order.staffName || '').filter(Boolean);
  const staffNames = ['all', ...Array.from(new Set(uniqueStaffNames))];

  // Calculate statistics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
  const canceledOrders = filteredOrders.filter(order => order.status === 'canceled').length;

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length) : 0;

  const headCells = getHeadCells(t);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('orders.title') || 'Orders'}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('orders.totalOrders') || 'Total Orders'}
              </Typography>
              <Typography variant="h4">
                {totalOrders.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('orders.totalRevenue') || 'Total Revenue'}
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalRevenue, language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('orders.avgOrderValue') || 'Average Order Value'}
              </Typography>
              <Typography variant="h4">
                {formatCurrency(avgOrderValue, language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('orders.orderStatus') || 'Order Status'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Chip
                  label={`${t('orders.pending') || 'Pending'}: ${pendingOrders}`}
                  color="warning"
                  size="small"
                  sx={{ mr: 0.5 }}
                />
                <Chip
                  label={`${t('orders.completed') || 'Completed'}: ${completedOrders}`}
                  color="success"
                  size="small"
                  sx={{ mr: 0.5 }}
                />
                <Chip
                  label={`${t('orders.canceled') || 'Canceled'}: ${canceledOrders}`}
                  color="error"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label={t('orders.searchOrders') || 'Search Orders'}
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1, whiteSpace: 'nowrap' }}
          >
            {showFilters ? t('common.hideFilters') || 'Hide Filters' : t('common.showFilters') || 'Show Filters'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t('common.refresh') || 'Refresh'}
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('common.startDate') || 'Start Date'}
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('common.endDate') || 'End Date'}
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('orders.status') || 'Status'}</InputLabel>
                  <Select
                    value={statusFilter}
                    label={t('orders.status') || 'Status'}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">{t('orders.allStatuses') || 'All Statuses'}</MenuItem>
                    <MenuItem value="pending">{t('orders.pending') || 'Pending'}</MenuItem>
                    <MenuItem value="completed">{t('orders.completed') || 'Completed'}</MenuItem>
                    <MenuItem value="canceled">{t('orders.canceled') || 'Canceled'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('orders.beautician') || 'Beautician'}</InputLabel>
                  <Select
                    value={staffFilter}
                    label={t('orders.beautician') || 'Beautician'}
                    onChange={(e) => setStaffFilter(e.target.value)}
                  >
                    {staffNames.map((staff) => (
                      <MenuItem key={staff} value={staff}>
                        {staff === 'all' ? t('orders.allBeauticians') || 'All Beauticians' : staff}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  fullWidth
                >
                  {t('common.clearFilters') || 'Clear Filters'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id as keyof Order)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    {t('orders.noOrdersFound') || 'No orders found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow hover>
                        <TableCell padding="checkbox">
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(order.id)}
                            aria-label="expand row"
                          >
                            {expandedOrderId === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {new Date(order.orderDate).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(order.totalAmount, language)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={
                              order.status === 'completed' ? 'success' :
                              order.status === 'pending' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>{order.staffName}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                          <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Order Details
                              </Typography>
                              <Table size="small" aria-label="order items">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>{t('orders.item') || 'Item'}</TableCell>
                                    <TableCell>{t('orders.serviceType') || 'Service Type'}</TableCell>
                                    <TableCell align="right">{t('orders.price') || 'Price'}</TableCell>
                                    <TableCell align="right">{t('orders.quantity') || 'Quantity'}</TableCell>
                                    <TableCell align="right">{t('orders.total') || 'Total'}</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.items?.map((item: OrderItem) => (
                                    <TableRow key={item.id}>
                                      <TableCell component="th" scope="row">
                                        {item.name}
                                      </TableCell>
                                      <TableCell>{item.serviceType}</TableCell>
                                      <TableCell align="right">{formatCurrency(item.price, language)}</TableCell>
                                      <TableCell align="right">{item.quantity}</TableCell>
                                      <TableCell align="right">
                                        {formatCurrency(item.price * item.quantity, language)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell colSpan={3} />
                                    <TableCell align="right">
                                      <strong>{t('orders.total') || 'Total'}:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>{formatCurrency(order.totalAmount, language)}</strong>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography variant="body2">
                                    <strong>Staff:</strong> {order.staffName}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>{t("orders.beautician") || "Beautician"}:</strong> {order.staffName}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2">
                                    <strong>Payment Method:</strong> {order.paymentMethod}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Status:</strong> {order.status}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default OrdersPage;
