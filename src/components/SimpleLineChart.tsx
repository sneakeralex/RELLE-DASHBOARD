import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Box, CircularProgress } from '@mui/material';
import { TrendData } from '../types/statistics';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency, formatNumber, formatCompactCurrency, formatCompactNumber } from '../utils/formatUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SimpleLineChartProps {
  data: TrendData[];
  title: string;
  color?: string;
  isCurrency?: boolean;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  color = '#8e44ad',
  isCurrency = false
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  // Format dates for display
  const labels = data.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: t(title) || title,  // Use translated title if available
        data: data.map(item => item.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t(title) || title,  // Use translated title if available
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              const threshold = 10000; // 超过这个阈值使用紧凑格式

              if (isCurrency) {
                label += Math.abs(value) >= threshold
                  ? formatCompactCurrency(value, language)
                  : formatCurrency(value, language);
              } else {
                label += Math.abs(value) >= threshold
                  ? formatCompactNumber(value, language)
                  : formatNumber(value, language);
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            const threshold = 10000; // 超过这个阈值使用紧凑格式
            const numValue = Number(value);

            if (isCurrency) {
              const symbol = language === 'zh' ? '¥' : '$';
              if (!isNaN(numValue) && Math.abs(numValue) >= threshold) {
                // 使用紧凑格式，但不包含货币符号（因为我们手动添加）
                const formatted = formatCompactNumber(numValue, language).replace(symbol, '');
                return symbol + formatted;
              }
              return symbol + numValue;
            }

            if (!isNaN(numValue) && Math.abs(numValue) >= threshold) {
              return formatCompactNumber(numValue, language);
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
          position="absolute"
          top={0}
          left={0}
        >
          <CircularProgress size={40} />
        </Box>
      ) : null}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SimpleLineChart;
