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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight brand-title">Keuangan</h2>
          <p className="text-sm md:text-base text-muted-foreground">Kelola pemasukan dan pengeluaran</p>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <ExportButtons type="finances" data={finances} />
          <Button onClick={() => setIsModalOpen(true)} className="brand-btn text-sm md:text-base">
            <Plus className="h-4 w-4 mr-1.5 md:mr-2" />
            <span className="hidden sm:inline">Tambah Transaksi</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="text-lg md:text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(income)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-2 md:p-3 rounded-lg">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-lg md:text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(expenses)}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-2 md:p-3 rounded-lg">
                <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Laba Bersih</p>
                <p className={`text-lg md:text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </p>
              </div>
              <div className={`${profit >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} p-2 md:p-3 rounded-lg`}>
                <DollarSign className={`h-5 w-5 md:h-6 md:w-6 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      {finances.length === 0 ? (
        <Card>
          <CardContent className="py-8 md:py-14 text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Belum ada data keuangan. Klik tombol &quot;Tambah Transaksi&quot; untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {Object.entries(financesByMonth).reverse().map(([month, items]) => (
            <Card key={month}>
              <CardHeader className="brand-header-gradient">
                <CardTitle className="tracking-tight">{month}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2.5 md:space-y-3">
                  {items.map((finance) => (
                    <div
                      key={finance.id}
                      className="flex flex-col gap-2.5 md:gap-3 p-3 md:p-4 bg-muted rounded-xl border border-white/5"
                    >
                      {/* Baris atas: icon + deskripsi + amount */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 md:gap-3 min-w-0">
                          <div className={`mt-0.5 p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                            finance.type === 'income'
                              ? 'bg-green-100 dark:bg-green-900'
                              : 'bg-red-100 dark:bg-red-900'
                          }`}>
                            {finance.type === 'income' ? (
                              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm md:text-base text-white truncate">
                              {finance.description}
                            </h4>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 md:gap-2">
                              <Badge variant="secondary" className="text-[10px] md:text-xs">
                                {formatDate(finance.date)}
                              </Badge>
                              <Badge
                                variant={finance.type === 'income' ? 'success' : 'danger'}
                                className="text-[10px] md:text-xs"
                              >
                                {finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0 text-right">
                          <span
                            className={`text-sm md:text-base font-semibold ${
                              finance.type === 'income' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {finance.type === 'income' ? '+' : '-'} {formatCurrency(finance.amount)}
                          </span>
                          <span className="text-[10px] md:text-xs text-muted-foreground capitalize">
                            {finance.category}
                          </span>
                        </div>
                      </div>

                      {/* Baris kedua: info tambahan + tombol aksi */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] md:text-xs text-muted-foreground truncate">
                          {finance.plantId
                            ? `Terkait tanaman #${finance.plantId}`
                            : 'Tidak terkait tanaman tertentu'}
                        </div>
                        <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(finance)}
                            className="h-7 w-7 md:h-8 md:w-8"
                          >
                            <Edit className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(finance.id)}
                            className="h-7 w-7 md:h-8 md:w-8"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>
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
