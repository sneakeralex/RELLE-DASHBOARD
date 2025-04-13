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

  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { fetchUserData } from '../services/api';
import { User } from '../types/user';
import { formatCurrency } from '../utils/formatUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof User | 'actions';
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const getHeadCells = (t: any): HeadCell[] => [
  { id: 'id', label: t('users.id') || 'ID', numeric: false, sortable: true },
  { id: 'name', label: t('users.name') || 'Name', numeric: false, sortable: true },
  { id: 'phone', label: t('users.phone') || 'Phone', numeric: false, sortable: true },
  { id: 'gender', label: t('users.gender') || 'Gender', numeric: false, sortable: true },
  { id: 'age', label: t('users.age') || 'Age', numeric: true, sortable: true },
  { id: 'createdAt', label: t('users.joined') || 'Joined Date', numeric: false, sortable: true },
  { id: 'lastVisit', label: t('users.lastVisit') || 'Last Visit', numeric: false, sortable: true },
  { id: 'totalSpent', label: t('users.spent') || 'Total Spent', numeric: true, sortable: true },
  { id: 'loyaltyPoints', label: t('users.loyaltyPoints') || 'Loyalty Points', numeric: true, sortable: true },
  { id: 'actions', label: t('common.actions') || 'Actions', numeric: false, sortable: false }
];

const UsersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof User>('createdAt');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...users];

    // Apply search
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(lowerCaseSearch) ||
          (user.phone ? user.phone.includes(searchTerm) : false) ||
          user.id.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Apply date filters
    if (startDate) {
      result = result.filter(
        user => new Date(user.createdAt) >= startDate
      );
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(
        user => new Date(user.createdAt) <= endOfDay
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

    setFilteredUsers(result);
  }, [users, searchTerm, startDate, endDate, order, orderBy]);

  const handleRequestSort = (property: keyof User) => {
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
      const data = await fetchUserData();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  // Calculate statistics
  const totalUsers = filteredUsers.length;
  const totalSpent = filteredUsers.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  const avgSpent = totalUsers > 0 ? totalSpent / totalUsers : 0;
  const avgLoyaltyPoints = totalUsers > 0
    ? filteredUsers.reduce((sum, user) => sum + (user.loyaltyPoints || 0), 0) / totalUsers
    : 0;

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

  const headCells = getHeadCells(t);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('users.title') || 'Users'}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('users.totalUsers') || 'Total Users'}
              </Typography>
              <Typography variant="h4">
                {totalUsers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('users.totalSpent') || 'Total Spent'}
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalSpent, language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('users.averageSpent') || 'Average Spent'}
              </Typography>
              <Typography variant="h4">
                {formatCurrency(avgSpent, language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('users.avgLoyaltyPoints') || 'Avg. Loyalty Points'}
              </Typography>
              <Typography variant="h4">
                {Math.round(avgLoyaltyPoints).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label={t('users.searchUsers') || 'Search Users'}
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
              <Grid item xs={12} sm={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('common.startDate') || 'Start Date'}
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('common.endDate') || 'End Date'}
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={2}>
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

      {/* Users Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
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
                        onClick={() => handleRequestSort(headCell.id as keyof User)}
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
                  <TableCell colSpan={headCells.length} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    {t('users.noUsersFound') || 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {user.gender === 0 ? (t('users.genderUnknown') || 'Unknown') : 
                         user.gender === 1 ? (t('users.genderMale') || 'Male') : 
                         (t('users.genderFemale') || 'Female')}
                      </TableCell>
                      <TableCell>{user.age || '-'}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                      </TableCell>
                      <TableCell>
                        {user.lastVisit
                          ? new Date(user.lastVisit).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')
                          : t('common.never') || 'Never'}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(user.totalSpent || 0, language)}
                      </TableCell>
                      <TableCell align="right">
                        {user.loyaltyPoints?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default UsersPage;
