import { calculateDaysDifference } from '../src/lib/utils.js';

// Test frontend integration
const plantingDate = '2025-11-23';
const harvestDate = '2026-01-21';
const today = new Date().toISOString().slice(0,10);

console.log('Planting Date:', plantingDate);
console.log('Harvest Date:', harvestDate);
console.log('Today:', today);

const daysSincePlanting = calculateDaysDifference(plantingDate, today);
const daysUntilHarvest = calculateDaysDifference(today, harvestDate);

console.log('Days since planting:', daysSincePlanting);
console.log('Days until harvest:', daysUntilHarvest);
console.log('Status:', daysUntilHarvest > 0 ? `${daysUntilHarvest} hari` : 'Siap panen');
