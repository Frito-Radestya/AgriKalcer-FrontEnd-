import { calculateDaysDifference } from '../src/lib/utils.js';

// Test with the corrected data
const plantData = {
  plantDate: '2025-11-23',
  estimatedHarvestDate: '2026-02-06'
};

const today = new Date().toISOString().slice(0,10);

console.log('=== Final Integration Test ===');
console.log('Today:', today);
console.log('Plant Date:', plantData.plantDate);
console.log('Harvest Date:', plantData.estimatedHarvestDate);

const daysSincePlanting = calculateDaysDifference(plantData.plantDate, today);
const daysUntilHarvest = calculateDaysDifference(today, plantData.estimatedHarvestDate);

console.log('Days since planting:', daysSincePlanting);
console.log('Days until harvest:', daysUntilHarvest);

// Test the Plants.jsx logic
const status = daysUntilHarvest > 0 ? `${daysUntilHarvest} hari` : 'Siap panen';
console.log('Display status:', status);

// Test edge cases
console.log('\n=== Edge Cases ===');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const daysUntilTomorrow = calculateDaysDifference(today, tomorrow.toISOString().slice(0,10));
console.log('Days until tomorrow:', daysUntilTomorrow);
console.log('Status for tomorrow:', daysUntilTomorrow > 0 ? `${daysUntilTomorrow} hari` : 'Siap panen');

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const daysSinceYesterday = calculateDaysDifference(yesterday.toISOString().slice(0,10), today);
console.log('Days since yesterday:', daysSinceYesterday);
