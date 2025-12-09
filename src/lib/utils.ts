// Format currency (Indonesian Rupiah)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// Format date for input fields
export function formatDateForInput(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

// Calculate days until warranty expires
export function daysUntilExpiry(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if warranty is active
export function isWarrantyActive(endDate: string): boolean {
  return daysUntilExpiry(endDate) > 0;
}

// Get warranty status label
export function getWarrantyStatus(endDate: string): { label: string; class: string } {
  const days = daysUntilExpiry(endDate);
  
  if (days < 0) {
    return { label: 'Expired', class: 'bg-red-100 text-red-800' };
  } else if (days <= 30) {
    return { label: 'Expiring Soon', class: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { label: 'Active', class: 'bg-green-100 text-green-800' };
  }
}

// Get asset status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-blue-100 text-blue-800',
    broken: 'bg-red-100 text-red-800',
    disposed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Get condition color
export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800',
  };
  return colors[condition] || 'bg-gray-100 text-gray-800';
}

// Get service status color
export function getServiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    process: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Generate unique filename for uploads
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Asset categories
export const ASSET_CATEGORIES = [
  'Vehicle',
  'Electronics',
  'Furniture',
  'Appliance',
  'Tool',
  'Sports Equipment',
  'Musical Instrument',
  'Jewelry',
  'Art',
  'Collectible',
  'Other',
] as const;

// Asset conditions
export const ASSET_CONDITIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
] as const;

// Asset statuses
export const ASSET_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'broken', label: 'Broken' },
  { value: 'disposed', label: 'Disposed' },
] as const;

// Service statuses
export const SERVICE_STATUSES = [
  { value: 'process', label: 'In Process' },
  { value: 'completed', label: 'Completed' },
] as const;

