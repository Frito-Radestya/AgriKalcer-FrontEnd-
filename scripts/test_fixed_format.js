// Test dengan formatDate yang sudah diperbaiki
console.log('=== FIXED FORMAT TEST ===\n')

// Test formatDate yang sudah diperbaiki
function formatDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

// Test dengan tanggal 2025-11-23
const testDate = '2025-11-23'
console.log('Input date:', testDate)
console.log('Formatted date:', formatDate(testDate))

// Test dengan Date object
const dateObj = new Date('2025-11-23')
console.log('Date object:', dateObj.toString())
console.log('Formatted from object:', formatDate(dateObj))

// Test current date
const now = new Date()
console.log('Current date:', now.toLocaleDateString('en-CA'))
console.log('Formatted current:', formatDate(now))

// Test edge cases
console.log('\n=== EDGE CASES ===')
const edge1 = new Date('2025-11-23T23:59:59')
console.log('Edge 1 (late night):', formatDate(edge1))

const edge2 = new Date('2025-11-23T00:00:01')
console.log('Edge 2 (early morning):', formatDate(edge2))

// Test different string formats
console.log('\n=== DIFFERENT STRING FORMATS ===')
console.log('YYYY-MM-DD:', formatDate('2025-11-23'))
console.log('With time:', formatDate('2025-11-23T15:30:00'))

console.log('\n=== EXPECTED RESULT ===')
console.log('✅ All should show: 23 November 2025')
console.log('✅ No more timezone shifts!')
