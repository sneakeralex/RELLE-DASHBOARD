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
import { refreshMockData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { authState } = useAuth();
  const isAdmin = authState.user?.role === 'admin';
  
  const [userCount, setUserCount] = useState<number>(100);
  const [orderCount, setOrderCount] = useState<number>(300);
  const [dateRange, setDateRange] = useState<number>(365);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we would pass these parameters to the refreshMockData function
      // For now, we'll just call it without parameters
      await refreshMockData();
      
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
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mock Data Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Adjust the settings below to configure the mock data for the dashboard.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Number of Users: {userCount}
              </Typography>
              <Slider
                value={userCount}
                onChange={(_, newValue) => setUserCount(newValue as number)}
                min={10}
                max={500}
                step={10}
                marks={[
                  { value: 10, label: '10' },
                  { value: 250, label: '250' },
                  { value: 500, label: '500' }
                ]}
                disabled={!isAdmin || loading}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Number of Orders: {orderCount}
              </Typography>
              <Slider
                value={orderCount}
                onChange={(_, newValue) => setOrderCount(newValue as number)}
                min={50}
                max={1000}
                step={50}
                marks={[
                  { value: 50, label: '50' },
                  { value: 500, label: '500' },
                  { value: 1000, label: '1000' }
                ]}
                disabled={!isAdmin || loading}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Date Range (days): {dateRange}
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
                {loading ? <CircularProgress size={24} /> : 'Refresh Data'}
              </Button>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={advancedMode}
                    onChange={(e) => setAdvancedMode(e.target.checked)}
                    disabled={!isAdmin}
                  />
                }
                label="Advanced Mode"
              />
            </Box>
          </Paper>
          
          {advancedMode && isAdmin && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Advanced Options
              </Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Export/Import Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportData}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={handleImportData}
                    >
                      Import Data
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Custom JSON Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Custom Configuration"
                    multiline
                    rows={10}
                    fullWidth
                    variant="outlined"
                    placeholder="Paste your JSON configuration here"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    Apply Configuration
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Configuration
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      100
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4">
                      300
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Date Range
                    </Typography>
                    <Typography variant="h4">
                      365 days
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
