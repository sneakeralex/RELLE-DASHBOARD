import { Language } from '../contexts/LanguageContext';

/**
 * Format a number as currency based on the current language
 * @param value The number to format
 * @param language The current language ('en' or 'zh')
 * @param options Additional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  language: Language = 'en',
  options: Intl.NumberFormatOptions = {}
): string => {
  const currencyCode = language === 'zh' ? 'CNY' : 'USD';
  const formatter = new Intl.NumberFormat(
    language === 'zh' ? 'zh-CN' : 'en-US',
    {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }
  );

  return formatter.format(value);
};

/**
 * Format a number with commas as thousands separators
 * @param value The number to format
 * @param language The current language ('en' or 'zh')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  language: Language = 'en'
): string => {
  return new Intl.NumberFormat(
    language === 'zh' ? 'zh-CN' : 'en-US'
  ).format(value);
};

/**
 * Format a number in a responsive way, using K, M, B suffixes for large numbers
 * @param value The number to format
 * @param language The current language ('en' or 'zh')
 * @param decimals Number of decimal places to show
 * @returns Formatted number string with appropriate suffix
 */
export const formatCompactNumber = (
  value: number,
  language: Language = 'en',
  decimals: number = 1
): string => {
  if (value === 0) return '0';

  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // For Chinese, use 万 (10,000) and 亿 (100,000,000) as units
  if (language === 'zh') {
    if (absValue < 1000) {
      return (isNegative ? '-' : '') + absValue.toFixed(decimals).replace(/\.0+$/, '');
    } else if (absValue < 10000) {
      return (isNegative ? '-' : '') + (absValue / 1000).toFixed(decimals).replace(/\.0+$/, '') + '千';
    } else if (absValue < 100000000) {
      return (isNegative ? '-' : '') + (absValue / 10000).toFixed(decimals).replace(/\.0+$/, '') + '万';
    } else {
      return (isNegative ? '-' : '') + (absValue / 100000000).toFixed(decimals).replace(/\.0+$/, '') + '亿';
    }
  } else {
    // For English, use K (1,000), M (1,000,000), B (1,000,000,000) as units
    if (absValue < 1000) {
      return (isNegative ? '-' : '') + absValue.toFixed(decimals).replace(/\.0+$/, '');
    } else if (absValue < 1000000) {
      return (isNegative ? '-' : '') + (absValue / 1000).toFixed(decimals).replace(/\.0+$/, '') + 'K';
    } else if (absValue < 1000000000) {
      return (isNegative ? '-' : '') + (absValue / 1000000).toFixed(decimals).replace(/\.0+$/, '') + 'M';
    } else {
      return (isNegative ? '-' : '') + (absValue / 1000000000).toFixed(decimals).replace(/\.0+$/, '') + 'B';
    }
  }
};

/**
 * Format currency in a responsive way, using K, M, B suffixes for large numbers
 * @param value The number to format
 * @param language The current language ('en' or 'zh')
 * @param decimals Number of decimal places to show
 * @returns Formatted currency string with appropriate suffix
 */
export const formatCompactCurrency = (
  value: number,
  language: Language = 'en',
  decimals: number = 1
): string => {
  const symbol = getCurrencySymbol(language);
  return symbol + formatCompactNumber(value, language, decimals);
};

/**
 * Get currency symbol based on language
 * @param language The current language ('en' or 'zh')
 * @returns Currency symbol
 */
export const getCurrencySymbol = (language: Language = 'en'): string => {
  return language === 'zh' ? '¥' : '$';
};

/**
 * Format a date based on the current language
 * @param date The date to format
 * @param language The current language ('en' or 'zh')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  language: Language = 'en'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(
    language === 'zh' ? 'zh-CN' : 'en-US'
  );
};
