// Test date formatting methods
console.log('=== DATE FORMAT TEST ===\n')

// Test 1: toISOString().split('T')[0] (OLD - problematic)
const oldMethod = new Date().toISOString().split('T')[0]
console.log('❌ Old method (toISOString):', oldMethod)

// Test 2: toLocaleDateString('en-CA') (NEW - fixed)
const newMethod = new Date().toLocaleDateString('en-CA')
console.log('✅ New method (toLocaleDateString):', newMethod)

// Test 3: Manual YYYY-MM-DD format (alternative)
const manualFormat = new Date().getFullYear() + '-' + 
  String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
  String(new Date().getDate()).padStart(2, '0')
console.log('✅ Manual format:', manualFormat)

// Test 4: Specific date test
const testDate = new Date('2025-11-23')
console.log('\n=== SPECIFIC DATE TEST (2025-11-23) ===')
console.log('toISOString():', testDate.toISOString().split('T')[0])
console.log('toLocaleDateString():', testDate.toLocaleDateString('en-CA'))
console.log('Manual:', testDate.getFullYear() + '-' + 
  String(testDate.getMonth() + 1).padStart(2, '0') + '-' + 
  String(testDate.getDate()).padStart(2, '0'))

console.log('\n=== TIMEZONE INFO ===')
console.log('Current timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log('Current time:', new Date().toString())
console.log('UTC time:', new Date().toUTCString())

console.log('\n=== RECOMMENDATION ===')
console.log('✅ Use toLocaleDateString("en-CA") for consistent YYYY-MM-DD format')
console.log('✅ Avoid toISOString() for local date display')
console.log('✅ This should fix the timezone issue in Plants.jsx')
