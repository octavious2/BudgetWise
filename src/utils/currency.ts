/**
 * Formats a number or string into a standard Ugandan Shilling format.
 * Example: 1000 -> UGX 1,000
 */
export const formatUGX = (amount: number | string): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) return 'UGX 0';

    return new Intl.NumberFormat('en-UG', {
        style: 'currency',
        currency: 'UGX',
        maximumFractionDigits: 2, 
    }).format(numericAmount).replace('UGX', 'UGX '); 
};