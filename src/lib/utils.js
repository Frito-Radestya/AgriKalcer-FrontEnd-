import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  // Handle invalid dates and timezone issues
  if (!date) return 'Tanggal tidak tersedia'
  
  let dateObj
  try {
    dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Tanggal tidak valid'
    }
  } catch (error) {
    return 'Tanggal error'
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

export function calculateDaysDifference(startDate, endDate) {
  // Handle invalid dates
  if (!startDate || !endDate) return 1
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1
    
    // Use local time to avoid timezone issues
    // Set both times to midnight to compare full days
    const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const endLocal = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    
    const diffTime = endLocal - startLocal
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Hari pertama dimulai dari 1, bukan 0
    return diffDays + 1
  } catch (error) {
    return 1
  }
}

export function addDays(date, days) {
  // Handle invalid dates
  if (!date) return new Date()
  
  try {
    const result = new Date(date)
    
    if (isNaN(result.getTime())) return new Date()
    
    result.setDate(result.getDate() + days)
    return result
  } catch (error) {
    return new Date()
  }
}
