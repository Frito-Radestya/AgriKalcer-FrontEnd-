// Copy paste ini ke browser console untuk force clear cache
console.log('=== FORCE CACHE CLEAR ===')

// 1. Clear localStorage
try {
  localStorage.clear()
  console.log('✅ LocalStorage cleared')
} catch (error) {
  console.log('❌ LocalStorage clear failed:', error.message)
}

// 2. Clear sessionStorage
try {
  sessionStorage.clear()
  console.log('✅ SessionStorage cleared')
} catch (error) {
  console.log('❌ SessionStorage clear failed:', error.message)
}

// 3. Clear service worker cache
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName).then(() => {
        console.log(`✅ Cache ${cacheName} cleared`)
      })
    })
  })
}

// 4. Force reload
console.log('🔄 Forcing page reload in 2 seconds...')
setTimeout(() => {
  window.location.reload(true)
}, 2000)

// 5. Test formatDate setelah reload
console.log('=== FORMATDATE TEST AFTER RELOAD ===')

// Test formatDate function
function formatDate(date) {
  if (!date) return 'Tanggal tidak tersedia'
  
  let dateObj
  try {
    dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    
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
  null,
  undefined,
  '',
  'invalid-date',
  '2025-11-23'
]

testCases.forEach((testCase, i) => {
  console.log(`Test ${i + 1}:`, testCase, '->', formatDate(testCase))
})

console.log('\n=== INSTRUCTIONS ===')
console.log('1. Copy paste script ini ke browser console')
console.log('2. Tunggu 2 detik untuk automatic reload')
console.log('3. Setelah reload, periksa halaman Maintenance')
console.log('4. Error seharusnya sudah hilang')

console.log('\n=== ALTERNATIF ===')
console.log('Jika masih error, coba:')
console.log('1. Close browser completely')
console.log('2. Open new browser window')
console.log('3. Go to Maintenance page')
console.log('4. Check if error persists')
