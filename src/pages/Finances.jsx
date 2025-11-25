import { useState } from 'react'
import { useData } from '@/context/useData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ExportButtons } from '@/components/ExportButtons'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function Finances() {
  const { finances, addFinance, updateFinance, deleteFinance, plants } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFinance, setEditingFinance] = useState(null)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toLocaleDateString('en-CA'),
    plantId: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const financeData = {
      ...formData,
      amount: parseFloat(formData.amount),
      plantId: formData.plantId ? parseInt(formData.plantId) : null,
    }
    
    if (editingFinance) {
      updateFinance(editingFinance.id, financeData)
    } else {
      addFinance(financeData)
    }
    
    handleCloseModal()
  }

  const handleEdit = (finance) => {
    setEditingFinance(finance)
    setFormData({
      type: finance.type,
      category: finance.category,
      amount: finance.amount.toString(),
      description: finance.description,
      date: finance.date,
      plantId: finance.plantId?.toString() || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data keuangan ini?')) {
      deleteFinance(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFinance(null)
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toLocaleDateString('en-CA'),
      plantId: '',
    })
  }

  // Calculate totals
  const income = finances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0)
  const expenses = finances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0)
  const profit = income - expenses

  // Group by month
  const financesByMonth = finances.reduce((acc, finance) => {
    if (!finance.date) return acc
    const month = new Date(finance.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(finance)
    return acc
  }, {})

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight brand-title">Keuangan</h2>
          <p className="text-muted-foreground">Kelola pemasukan dan pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <ExportButtons type="finances" data={finances} />
          <Button onClick={() => setIsModalOpen(true)} className="brand-btn">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(income)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(expenses)}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Laba Bersih</p>
                <p className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </p>
              </div>
              <div className={`${profit >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} p-3 rounded-lg`}>
                <DollarSign className={`h-6 w-6 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      {finances.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-muted-foreground">
              Belum ada data keuangan. Klik tombol &quot;Tambah Transaksi&quot; untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(financesByMonth).reverse().map(([month, items]) => (
            <Card key={month}>
              <CardHeader className="brand-header-gradient">
                <CardTitle className="tracking-tight">{month}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {items.map((finance) => (
                    <div
                      key={finance.id}
                      className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                    >
                      <div className={`p-2 rounded-lg ${
                        finance.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {finance.type === 'income' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{finance.description}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(finance.date)}
                          </Badge>
                          <Badge 
                            variant={finance.type === 'income' ? 'success' : 'danger'}
                            className="text-xs"
                          >
                            {finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Kategori: <strong className="capitalize">{finance.category}</strong>
                          </span>
                          <span className={`font-semibold ${
                            finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {finance.type === 'income' ? '+' : '-'} {formatCurrency(finance.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(finance)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(finance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFinance ? 'Edit Transaksi' : 'Tambah Transaksi'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Jenis Transaksi *</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Input
              id="category"
              placeholder="Contoh: Pupuk, Pestisida, Panen"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="100000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Input
              id="description"
              placeholder="Contoh: Pembelian pupuk NPK"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantId">Tanaman (Opsional)</Label>
            <Select
              id="plantId"
              value={formData.plantId}
              onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
            >
              <option value="">Tidak terkait tanaman tertentu</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.plantName}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingFinance ? 'Simpan Perubahan' : 'Tambah Transaksi'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
