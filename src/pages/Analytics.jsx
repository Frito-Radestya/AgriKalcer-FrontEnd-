import { useData } from '@/context/useData'
import { PLANT_TYPES } from '@/context/plantTypes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function Analytics() {
  const { plants, harvests, finances } = useData()
  const [timePeriod, setTimePeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filterDataByPeriod = (data, period) => {
    if (period === 'custom' && startDate && endDate) {
      return data.filter(item => {
        const itemDate = new Date(item.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return itemDate >= start && itemDate <= end
      })
    }
    
    const now = new Date()
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date)
      switch (period) {
        case 'daily':
          return itemDate.toDateString() === now.toDateString()
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return itemDate >= weekAgo
        case 'monthly':
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
        case 'yearly':
          return itemDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
    return filteredData
  }

  // Financial trend by period
  const filteredFinances = filterDataByPeriod(finances, timePeriod)
  const financialTrend = filteredFinances.reduce((acc, finance) => {
    let periodKey
    switch (timePeriod) {
      case 'daily':
        periodKey = new Date(finance.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        break
      case 'weekly':
        periodKey = `Minggu ${Math.ceil(new Date(finance.date).getDate() / 7)}`
        break
      case 'monthly':
        periodKey = new Date(finance.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
        break
      case 'yearly':
        periodKey = new Date(finance.date).getFullYear().toString()
        break
      case 'custom':
        periodKey = new Date(finance.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        break
      default:
        periodKey = new Date(finance.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    }
    
    if (!acc[periodKey]) {
      acc[periodKey] = { period: periodKey, income: 0, expense: 0 }
    }
    if (finance.type === 'income') {
      acc[periodKey].income += finance.amount
    } else {
      acc[periodKey].expense += finance.amount
    }
    return acc
  }, {})

  const financialData = Object.values(financialTrend).map(item => ({
    month: item.period,
    income: item.income || 0,
    expense: item.expense || 0,
    profit: (item.income || 0) - (item.expense || 0)
  })).sort((a, b) => {
    // Sort by date to ensure proper order
    const dateA = new Date(a.month)
    const dateB = new Date(b.month)
    return dateA - dateB
  })

  // Harvest by plant type
  const filteredHarvests = filterDataByPeriod(harvests, timePeriod)
  const harvestByType = filteredHarvests.reduce((acc, harvest) => {
    const plant = plants.find(p => p.id === harvest.plantId)
    if (plant) {
      const plantType = PLANT_TYPES.find(pt => pt.id === plant.plantType)
      const typeName = plantType?.name || 'Lainnya'
      if (!acc[typeName]) {
        acc[typeName] = 0
      }
      acc[typeName] += harvest.amount
    }
    return acc
  }, {})

  const harvestData = Object.entries(harvestByType).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  // Plant status distribution
  const plantStatusData = [
    { name: 'Aktif', value: plants.filter(p => p.status === 'active').length },
    { name: 'Panen', value: plants.filter(p => p.status === 'harvested').length },
  ]

  // Revenue by plant
  const revenueByPlant = filteredHarvests.reduce((acc, harvest) => {
    if (!acc[harvest.plantName]) {
      acc[harvest.plantName] = 0
    }
    acc[harvest.plantName] += harvest.revenue
    return acc
  }, {})

  const revenueData = Object.entries(revenueByPlant)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Calculate statistics
  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
  const totalProfit = totalIncome - totalExpense
  const avgHarvestAmount = harvests.length > 0 
    ? harvests.reduce((sum, h) => sum + h.amount, 0) / harvests.length 
    : 0

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight brand-title">Analisis & Statistik</h2>
        <p className="text-sm md:text-base text-muted-foreground">Visualisasi data pertanian Anda</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6 pt-1 md:pt-2">
            <p className="text-xs md:text-sm text-muted-foreground">Total Tanaman</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{plants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6 pt-1 md:pt-2">
            <p className="text-xs md:text-sm text-muted-foreground">Total Panen</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{harvests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6 pt-1 md:pt-2">
            <p className="text-xs md:text-sm text-muted-foreground">Rata-rata Hasil</p>
            <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{avgHarvestAmount.toFixed(1)} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6 pt-1 md:pt-2">
            <p className="text-xs md:text-sm text-muted-foreground">Laba Bersih</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 md:mt-2 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Financial Trend */}
        <Card>
          <CardHeader className="brand-header-gradient p-3 md:p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 tracking-tight">
                <TrendingUp className="h-5 w-5" />
                Tren Keuangan
              </CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="daily" className="bg-[#0b130f]">Harian</option>
                  <option value="weekly" className="bg-[#0b130f]">Mingguan</option>
                  <option value="monthly" className="bg-[#0b130f]">Bulanan</option>
                  <option value="yearly" className="bg-[#0b130f]">Tahunan</option>
                  <option value="custom" className="bg-[#0b130f]">Custom</option>
                </select>
                {timePeriod === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Mulai"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Selesai"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {financialData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data keuangan
              </p>
            ) : (
              <>
                {/* Debug info - remove this in production */}
                {console.log('Financial Data:', financialData)}
                {console.log('Filtered Finances:', filteredFinances)}
                {console.log('Income Data:', financialData.map(d => ({ month: d.month, income: d.income })))}
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9ca3af"
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#22c55e" 
                      name="Pemasukan" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 5 }}
                      activeDot={{ r: 7 }}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#ef4444" 
                      name="Pengeluaran" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#3b82f6" 
                      name="Laba" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                {/* Additional debug info */}
                <div className="text-xs text-gray-500 mt-2">
                  Debug: {financialData.length} data points | 
                  Income: {financialData.reduce((sum, d) => sum + d.income, 0).toLocaleString()} | 
                  Expense: {financialData.reduce((sum, d) => sum + d.expense, 0).toLocaleString()}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Plant */}
        <Card>
          <CardHeader className="brand-header-gradient">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 tracking-tight">
                <BarChart3 className="h-5 w-5" />
                Pendapatan per Tanaman (Top 5)
              </CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="daily" className="bg-[#0b130f]">Harian</option>
                  <option value="weekly" className="bg-[#0b130f]">Mingguan</option>
                  <option value="monthly" className="bg-[#0b130f]">Bulanan</option>
                  <option value="yearly" className="bg-[#0b130f]">Tahunan</option>
                  <option value="custom" className="bg-[#0b130f]">Custom</option>
                </select>
                {timePeriod === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Mulai"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/10 border border-white/20 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Selesai"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {revenueData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data panen
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#22c55e" name="Pendapatan" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Harvest by Type */}
        <Card>
          <CardHeader className="brand-header-gradient">
            <CardTitle className="flex items-center gap-2 tracking-tight">
              <PieChartIcon className="h-5 w-5" />
              Hasil Panen per Jenis Tanaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {harvestData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data panen
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={harvestData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {harvestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} kg`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Plant Status */}
        <Card>
          <CardHeader className="brand-header-gradient">
            <CardTitle className="flex items-center gap-2 tracking-tight">
              <PieChartIcon className="h-5 w-5" />
              Status Tanaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {plants.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data tanaman
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={plantStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {plantStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader className="brand-header-gradient">
          <CardTitle className="tracking-tight">Ringkasan Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Total Pemasukan</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Total Pengeluaran</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(totalExpense)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
              <span className="font-medium text-lg">Laba Bersih</span>
              <span className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
