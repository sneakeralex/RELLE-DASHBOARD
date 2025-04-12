import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { StatCardProps } from '../types/statistics';
import { formatPercentage } from '../utils/dateUtils';
import { formatCurrency, formatNumber, formatCompactCurrency, formatCompactNumber } from '../utils/formatUtils';
import { useLanguage } from '../contexts/LanguageContext';

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  percentChange = 0,
  isPercentage = false,
  isCurrency = false
}) => {
  const { language } = useLanguage();

  const formattedValue = React.useMemo(() => {
    if (typeof value === 'string') return value;
    if (isPercentage) return formatPercentage(value);

    // 使用自适应格式化函数
    const threshold = 10000; // 超过这个阈值使用紧凑格式

    if (isCurrency) {
      return Math.abs(value) >= threshold
        ? formatCompactCurrency(value, language)
        : formatCurrency(value, language);
    }

    return Math.abs(value) >= threshold
      ? formatCompactNumber(value, language)
      : formatNumber(value, language);
  }, [value, isPercentage, isCurrency, language]);

  return (
    <Card
      className="stats-card"
      sx={{
        height: '100%',
        borderTop: `4px solid ${color}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" fontWeight="bold" mb={1}>
          {formattedValue}
        </Typography>

        {percentChange !== 0 && (
          <Chip
            icon={percentChange > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${percentChange > 0 ? '+' : ''}${formatPercentage(percentChange)}`}
            color={percentChange > 0 ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
