import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchShopData } from '../services/api';
import { Shop, ShopStatus } from '../types/shop';

const Shops: React.FC = () => {
  const { t } = useLanguage();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchShopData();
        setShops(data);
        setFilteredShops(data);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShops(filtered);
    }
  }, [searchTerm, shops]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case ShopStatus.Active:
        return <Chip label={t('shops.active') || 'Active'} color="success" size="small" />;
      case ShopStatus.Inactive:
        return <Chip label={t('shops.inactive') || 'Inactive'} color="default" size="small" />;
      case ShopStatus.Maintenance:
        return <Chip label={t('shops.maintenance') || 'Maintenance'} color="warning" size="small" />;
      case ShopStatus.Closed:
        return <Chip label={t('shops.closed') || 'Closed'} color="error" size="small" />;
      default:
        return <Chip label={t('shops.unknown') || 'Unknown'} color="default" size="small" />;
    }
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
        {t('shops.title') || 'Shops'}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('shops.description') || 'View and manage all shops in the beauty chain.'}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('shops.allShops') || 'All Shops'}</Typography>
          <TextField
            size="small"
            placeholder={t('common.search') || 'Search'}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <Grid item xs={12} sm={6} md={4} key={shop.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={shop.coverImg}
                    alt={shop.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {shop.name}
                      </Typography>
                      {getStatusChip(shop.status)}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {shop.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('shops.openedOn') || 'Opened on'}: {shop.openDate}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {shop.introduce.length > 100 ? `${shop.introduce.substring(0, 100)}...` : shop.introduce}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <StoreIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('shops.noShopsFound') || 'No shops found'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Shops;
