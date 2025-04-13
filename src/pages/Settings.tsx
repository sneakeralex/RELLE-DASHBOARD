import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { refreshMockData, setMockDataConfig } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { authState } = useAuth();
  const { t, language } = useLanguage();
  const isAdmin = authState.user?.role === 'admin';

  const [userCount, setUserCount] = useState<number>(1000);
  const [orderCount, setOrderCount] = useState<number>(500);
  const [dateRange, setDateRange] = useState<number>(365);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Update the mock data configuration
      await setMockDataConfig(userCount, orderCount);

      // Refresh the mock data with the new configuration
      const newData = refreshMockData();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // In a real app, we would export the mock data to a JSON file
    // For now, we'll just show a success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleImportData = () => {
    // In a real app, we would import mock data from a JSON file
    // For now, we'll just show a success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('settings.title') || 'Settings'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.mockDataConfig') || 'Mock Data Configuration'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('settings.mockDataDesc')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                {t('settings.numberOfUsers') || 'Number of Users'}: {userCount.toLocaleString()}
              </Typography>
              <Slider
                value={userCount}
                onChange={(_, newValue) => setUserCount(newValue as number)}
                min={100}
                max={100000}
                step={100}
                marks={[
                  { value: 100, label: '100' },
                  { value: 25000, label: '25K' },
                  { value: 50000, label: '50K' },
                  { value: 75000, label: '75K' },
                  { value: 100000, label: '100K' }
                ]}
                disabled={!isAdmin || loading}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                {t('settings.numberOfOrders') || 'Number of Orders'}: {orderCount.toLocaleString()}
              </Typography>
              <Slider
                value={orderCount}
                onChange={(_, newValue) => setOrderCount(newValue as number)}
                min={100}
                max={50000}
                step={100}
                marks={[
                  { value: 100, label: '100' },
                  { value: 12500, label: '12.5K' },
                  { value: 25000, label: '25K' },
                  { value: 37500, label: '37.5K' },
                  { value: 50000, label: '50K' }
                ]}
                disabled={!isAdmin || loading}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                {t('settings.dateRange') || 'Date Range (days)'}: {dateRange}
              </Typography>
              <Slider
                value={dateRange}
                onChange={(_, newValue) => setDateRange(newValue as number)}
                min={30}
                max={730}
                step={30}
                marks={[
                  { value: 30, label: '30' },
                  { value: 365, label: '365' },
                  { value: 730, label: '730' }
                ]}
                disabled={!isAdmin || loading}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshData}
                disabled={!isAdmin || loading}
              >
                {loading ? <CircularProgress size={24} /> : t('settings.refreshData') || 'Refresh Data'}
              </Button>

              <FormControlLabel
                control={
                  <Switch
                    checked={advancedMode}
                    onChange={(e) => setAdvancedMode(e.target.checked)}
                    disabled={!isAdmin}
                  />
                }
                label={t('settings.advancedMode') || 'Advanced Mode'}
              />
            </Box>
          </Paper>

          {advancedMode && isAdmin && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('settings.advancedOptions') || 'Advanced Options'}
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{t('settings.exportImportData') || 'Export/Import Data'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportData}
                    >
                      {t('settings.exportData') || 'Export Data'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={handleImportData}
                    >
                      {t('settings.importData') || 'Import Data'}
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{t('settings.customJsonConfig') || 'Custom JSON Configuration'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label={t('settings.customConfig') || 'Custom Configuration'}
                    multiline
                    rows={10}
                    fullWidth
                    variant="outlined"
                    placeholder={t('settings.jsonPlaceholder') || 'Paste your JSON configuration here'}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    {t('settings.applyConfig') || 'Apply Configuration'}
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('settings.currentConfig') || 'Current Configuration'}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {t('dashboard.totalUsers')}
                    </Typography>
                    <Typography variant="h4">
                      {userCount.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {t('dashboard.totalOrders')}
                    </Typography>
                    <Typography variant="h4">
                      {orderCount.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {t('settings.dateRange')}
                    </Typography>
                    <Typography variant="h4">
                      {dateRange} {t('common.days') || 'days'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Last Refreshed
                    </Typography>
                    <Typography variant="h6">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Access Control
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              Only administrators can modify mock data settings.
            </Alert>

            <Typography variant="body2" color="text.secondary" paragraph>
              Your current role: <strong>{authState.user?.role.toUpperCase()}</strong>
            </Typography>

            {!isAdmin && (
              <Alert severity="warning">
                You need administrator privileges to modify these settings.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Operation completed successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
