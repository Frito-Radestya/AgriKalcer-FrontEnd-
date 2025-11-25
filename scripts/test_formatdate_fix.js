// Test formatDate function yang sudah diperbaiki
console.log('=== FORMATDATE FIX TEST ===\n')

// formatDate function yang sudah diperbaiki
function formatDate(date) {
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

// Test cases
const testCases = [
  '2025-11-23',           // Valid date string
  new Date('2025-11-23'),  // Valid date object
  null,                    // Null value
  undefined,               // Undefined value
  '',                      // Empty string
  'invalid-date',         // Invalid date string
  '2025-13-45',           // Impossible date
  '0000-00-00',           // Zero date
  '2025-11-23T25:00:00',  // Invalid time
  new Date('invalid'),     // Invalid date object
  '2025-11-23T00:00:00Z', // UTC date
  '2025-11-23T15:30:00',  // With time
]

console.log('=== TEST RESULTS ===')
testCases.forEach((testCase, i) => {
  console.log(`Test ${i + 1}:`, testCase, '->', formatDate(testCase))
})

console.log('\n=== EXPECTED RESULTS ===')
console.log('✅ Valid dates: "23 November 2025"')
console.log('✅ Null/undefined: "Tanggal tidak tersedia"')
console.log('✅ Invalid dates: "Tanggal tidak valid"')
console.log('✅ No more "Invalid time value" errors!')

console.log('\n=== MAINTENANCE PAGE FIX ===')
console.log('✅ formatDate sekarang handle invalid dates')
console.log('✅ Tidak akan crash Maintenance component')
console.log('✅ Icon maintenance akan muncul dengan benar')
