import React from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StatCard from './StatCard';
import LineChart from './Charts/LineChart';
import { UserStats as UserStatsType } from '../types/user';
import { RecentUser, TrendData } from '../types/statistics';
import { formatDate, formatCurrency } from '../utils/dateUtils';

interface UserStatsProps {
  userStats: UserStatsType;
  recentUsers: RecentUser[];
  userTrend: TrendData[];
}

const UserStats: React.FC<UserStatsProps> = ({ userStats, recentUsers, userTrend }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        User Statistics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={userStats.totalUsers}
            icon={<PeopleIcon />}
            color="#8e44ad"
            percentChange={userStats.userGrowthRate}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users (Today)"
            value={userStats.newUsersToday}
            icon={<PersonIcon />}
            color="#3498db"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users (Week)"
            value={userStats.newUsersThisWeek}
            icon={<PersonIcon />}
            color="#2ecc71"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Users (Month)"
            value={userStats.newUsersThisMonth}
            icon={<TrendingUpIcon />}
            color="#e74c3c"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Growth Trend
            </Typography>
            <LineChart 
              title="New Users Over Time" 
              data={userTrend} 
              color="#8e44ad" 
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
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
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{formatDate(user.createdAt, 'MMM dd')}</TableCell>
                      <TableCell align="right">{formatCurrency(user.totalSpent)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserStats;
