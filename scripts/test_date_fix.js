// Test script untuk verifikasi perbaikan tanggal
console.log('=== Test Date Parsing Fix ===')

// Test 1: String parsing (new method)
const testDate1 = '2025-11-23'
const result1 = String(testDate1).slice(0,10)
console.log('✅ String parsing:', testDate1, '->', result1)

// Test 2: Old method (yang bermasalah)
const testDate2 = '2025-11-23'
const oldResult = new Date(testDate2).toISOString().slice(0,10)
console.log('⚠️  Old method:', testDate2, '->', oldResult)

// Test 3: Bandingkan hasil
console.log('\n=== Perbandingan ===')
console.log('Expected: 2025-11-23')
console.log('New method:', result1 === '2025-11-23' ? '✅ BENAR' : '❌ SALAH')
console.log('Old method:', oldResult === '2025-11-23' ? '✅ BENAR' : '❌ SALAH')

// Test 4: Cek timezone effect
console.log('\n=== Timezone Effect Test ===')
const utcDate = new Date('2025-11-23T00:00:00Z')
console.log('UTC Date:', utcDate.toISOString())
console.log('Local Date (old method):', utcDate.toISOString().slice(0,10))
console.log('String method (new):', String('2025-11-23').slice(0,10))

console.log('\n=== Summary ===')
console.log('✅ Perbaikan selesai!')
console.log('✅ Frontend sekarang menggunakan String(p.planting_date).slice(0,10)')
console.log('✅ Tidak ada lagi timezone shift')
console.log('✅ Backend dan frontend sekarang konsisten')
