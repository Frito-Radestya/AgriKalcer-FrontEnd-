import { useData, PLANT_TYPES } from '@/context/DataContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
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

  // Financial trend by month
  const financialTrend = finances.reduce((acc, finance) => {
    const month = new Date(finance.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 }
    }
    if (finance.type === 'income') {
      acc[month].income += finance.amount
    } else {
      acc[month].expense += finance.amount
    }
    return acc
  }, {})

  const financialData = Object.values(financialTrend).map(item => ({
    ...item,
    profit: item.income - item.expense
  }))

  // Harvest by plant type
  const harvestByType = harvests.reduce((acc, harvest) => {
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
  const revenueByPlant = harvests.reduce((acc, harvest) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analisis & Statistik</h2>
        <p className="text-muted-foreground">Visualisasi data pertanian Anda</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Tanaman</p>
            <p className="text-3xl font-bold mt-2">{plants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Panen</p>
            <p className="text-3xl font-bold mt-2">{harvests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Rata-rata Hasil</p>
            <p className="text-3xl font-bold mt-2">{avgHarvestAmount.toFixed(1)} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Laba Bersih</p>
            <p className={`text-2xl font-bold mt-2 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tren Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {financialData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data keuangan
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" name="Pemasukan" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Pengeluaran" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Laba" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Plant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pendapatan per Tanaman (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada data panen
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Hasil Panen per Jenis Tanaman
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Status Tanaman
            </CardTitle>
          </CardHeader>
          <CardContent>
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
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
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
