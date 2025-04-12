import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Box, Typography } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency, formatNumber, formatCompactCurrency, formatCompactNumber } from '../../utils/formatUtils';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  isCurrency?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  data,
  colors,
  isCurrency = false
}) => {
  const { t, language } = useLanguage();
  // Default colors if not provided
  const defaultColors = [
    '#8e44ad', // Purple
    '#2ecc71', // Green
    '#3498db', // Blue
    '#e74c3c', // Red
    '#f39c12', // Orange
    '#1abc9c', // Teal
    '#9b59b6', // Violet
    '#34495e', // Dark Blue
    '#16a085', // Dark Green
    '#c0392b', // Dark Red
  ];

  const chartColors = colors || defaultColors;

  // Translate labels if they are translation keys
  const translatedLabels = labels.map(label => t(label) || label);

  const chartData = {
    labels: translatedLabels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.slice(0, data.length),
        borderColor: chartColors.slice(0, data.length).map(color => color + '80'),
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }

            const value = context.raw as number;
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

            // Add percentage
            const total = data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            label += ` (${percentage}%)`;

            return label;
          }
        }
      }
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Typography variant="h6" align="center" gutterBottom>
        {t(title) || title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default PieChart;
