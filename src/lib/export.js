import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatDate, formatCurrency } from './utils'

export function exportToExcel(data, filename, sheetName = 'Data') {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportPlantsToPDF(plants) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Laporan Data Tanam', 14, 20)
  
  doc.setFontSize(11)
  doc.text(`Tanggal: ${formatDate(new Date())}`, 14, 28)
  
  // Table
  const tableData = plants.map(plant => [
    plant.plantName,
    plant.landName,
    `${plant.landArea} m²`,
    formatDate(plant.plantDate),
    plant.status === 'active' ? 'Aktif' : 'Panen',
  ])
  
  doc.autoTable({
    startY: 35,
    head: [['Nama Tanaman', 'Lahan', 'Luas', 'Tanggal Tanam', 'Status']],
    body: tableData,
  })
  
  doc.save('laporan-data-tanam.pdf')
}

export function exportHarvestsToPDF(harvests) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Laporan Data Panen', 14, 20)
  
  doc.setFontSize(11)
  doc.text(`Tanggal: ${formatDate(new Date())}`, 14, 28)
  
  // Table
  const tableData = harvests.map(harvest => [
    harvest.plantName,
    formatDate(harvest.date),
    `${harvest.amount} ${harvest.unit}`,
    formatCurrency(harvest.pricePerKg),
    formatCurrency(harvest.revenue),
  ])
  
  doc.autoTable({
    startY: 35,
    head: [['Tanaman', 'Tanggal', 'Hasil', 'Harga/kg', 'Pendapatan']],
    body: tableData,
  })
  
  // Summary
  const totalRevenue = harvests.reduce((sum, h) => sum + h.revenue, 0)
  const finalY = doc.lastAutoTable.finalY || 35
  
  doc.setFontSize(12)
  doc.text(`Total Pendapatan: ${formatCurrency(totalRevenue)}`, 14, finalY + 10)
  
  doc.save('laporan-data-panen.pdf')
}

export function exportFinancesToPDF(finances) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Laporan Keuangan', 14, 20)
  
  doc.setFontSize(11)
  doc.text(`Tanggal: ${formatDate(new Date())}`, 14, 28)
  
  // Table
  const tableData = finances.map(finance => [
    formatDate(finance.date),
    finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    finance.category,
    finance.description,
    formatCurrency(finance.amount),
  ])
  
  doc.autoTable({
    startY: 35,
    head: [['Tanggal', 'Jenis', 'Kategori', 'Deskripsi', 'Jumlah']],
    body: tableData,
  })
  
  // Summary
  const income = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
  const expense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
  const profit = income - expense
  
  const finalY = doc.lastAutoTable.finalY || 35
  
  doc.setFontSize(12)
  doc.text(`Total Pemasukan: ${formatCurrency(income)}`, 14, finalY + 10)
  doc.text(`Total Pengeluaran: ${formatCurrency(expense)}`, 14, finalY + 18)
  doc.text(`Laba Bersih: ${formatCurrency(profit)}`, 14, finalY + 26)
  
  doc.save('laporan-keuangan.pdf')
}

export function exportPlantsToExcel(plants) {
  const data = plants.map(plant => ({
    'Nama Tanaman': plant.plantName,
    'Jenis': plant.plantType,
    'Lahan': plant.landName,
    'Luas (m²)': plant.landArea,
    'Tanggal Tanam': formatDate(plant.plantDate),
    'Estimasi Panen': formatDate(plant.estimatedHarvestDate),
    'Bibit': plant.seedType,
    'Jumlah Benih': plant.seedAmount,
    'Status': plant.status === 'active' ? 'Aktif' : 'Panen',
  }))
  
  exportToExcel(data, 'data-tanam', 'Data Tanam')
}

export function exportHarvestsToExcel(harvests) {
  const data = harvests.map(harvest => ({
    'Tanaman': harvest.plantName,
    'Tanggal Panen': formatDate(harvest.date),
    'Hasil (kg)': harvest.amount,
    'Satuan': harvest.unit,
    'Harga per kg': harvest.pricePerKg,
    'Total Pendapatan': harvest.revenue,
    'Kualitas': harvest.quality === 'excellent' ? 'Sangat Baik' : harvest.quality === 'good' ? 'Baik' : 'Cukup',
  }))
  
  exportToExcel(data, 'data-panen', 'Data Panen')
}

export function exportFinancesToExcel(finances) {
  const data = finances.map(finance => ({
    'Tanggal': formatDate(finance.date),
    'Jenis': finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    'Kategori': finance.category,
    'Deskripsi': finance.description,
    'Jumlah': finance.amount,
  }))
  
  exportToExcel(data, 'data-keuangan', 'Data Keuangan')
}
