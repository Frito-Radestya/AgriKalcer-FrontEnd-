import { useState, useEffect } from 'react'
import { useData } from '@/context/useData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ExportButtons } from '@/components/ExportButtons'
import { formatDate, formatCurrency } from '@/lib/utils'
import { PLANT_TYPES } from '@/context/plantTypes'
import { Plus, Edit, Trash2, TrendingUp, Calendar, DollarSign, Target, Sprout } from 'lucide-react'

export function Harvests() {
  const { harvests, addHarvest, updateHarvest, deleteHarvest, plants } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHarvest, setEditingHarvest] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [formData, setFormData] = useState({
    plantId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    unit: 'kg',
    pricePerKg: '',
    quality: 'good',
    notes: '',
  })

  // Check if data is loaded
  useEffect(() => {
    if (harvests.length > 0 || plants.length > 0) {
      setIsDataLoaded(true)
    }
  }, [harvests, plants])

  const activePlants = plants.filter(p => p.status === 'active')

  const getPlantTypeInfo = (plantTypeId) => {
    // Use PLANT_TYPES for consistent icon mapping
    const plantType = PLANT_TYPES.find(p => p.id === plantTypeId)
    return plantType || { icon: '🌱' }
  }

  const safeParseNumber = (value, fallback = 0) => {
    if (value === undefined || value === null || value === '') return fallback
    const parsed = typeof value === 'number' ? value : parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const calculateProductivity = (harvest, plant) => {
    const landArea = safeParseNumber(plant?.landArea)
    if (landArea <= 0) return 0
    
    const amount = safeParseNumber(harvest.amount)
    const unit = harvest.unit || 'kg'
    
    // Convert amount to kg based on unit
    let amountInKg = amount
    if (unit === 'ton') {
      amountInKg = amount * 1000 // 1 ton = 1000 kg
    } else if (unit === 'kuintal') {
      amountInKg = amount * 100 // 1 kuintal = 100 kg
    }
    
    const productivity = Number((amountInKg / landArea).toFixed(2))
    
    return productivity
  }

  const getRevenue = (harvest) => {
    const revenue = safeParseNumber(harvest.revenue, null)
    if (revenue !== null) {
      return revenue
    }
    
    const amount = safeParseNumber(harvest.amount)
    const price = safeParseNumber(harvest.pricePerKg)
    const unit = harvest.unit || 'kg'
    
    // Convert amount to kg based on unit
    let amountInKg = amount
    if (unit === 'ton') {
      amountInKg = amount * 1000 // 1 ton = 1000 kg
    } else if (unit === 'kuintal') {
      amountInKg = amount * 100 // 1 kuintal = 100 kg
    }
    
    return Number((amountInKg * price).toFixed(2))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const plant = plants.find(p => p.id === parseInt(formData.plantId))
    const harvestData = {
      ...formData,
      plantId: parseInt(formData.plantId),
      plantName: plant?.plantName || '',
      amount: parseFloat(formData.amount),
      unit: formData.unit,
      pricePerKg: parseFloat(formData.pricePerKg),
      quality: formData.quality,
    }
    
    try {
      if (editingHarvest) {
        await updateHarvest(editingHarvest.id, harvestData)
      } else {
        await addHarvest(harvestData)
      }
      
      
    } catch (error) {
      console.error('Error saving harvest:', error)
    }
    
    handleCloseModal()
  }

  const handleEdit = (harvest) => {
    setEditingHarvest(harvest)
    setFormData({
      plantId: harvest.plantId.toString(),
      date: harvest.date,
      amount: harvest.amount.toString(),
      unit: harvest.unit,
      pricePerKg: harvest.pricePerKg.toString(),
      quality: harvest.quality,
      notes: harvest.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data panen ini?')) {
      deleteHarvest(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingHarvest(null)
    setFormData({
      plantId: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      unit: 'kg',
      pricePerKg: '',
      quality: 'good',
      notes: '',
    })
  }

  // Calculate totals only when data is loaded
  const totalAmount = harvests.reduce((sum, h) => sum + safeParseNumber(h.amount), 0)
  const totalRevenue = harvests.reduce((sum, h) => sum + getRevenue(h), 0)
  const productivityData = isDataLoaded ? harvests.reduce((acc, harvest) => {
    const plant = plants.find(p => p.id === harvest.plantId)
    const productivity = calculateProductivity(harvest, plant)
    acc[harvest.id] = productivity
    return acc
  }, {}) : {}
  const totalProductivity = Object.values(productivityData).reduce((sum, value) => sum + value, 0)
  const averageProductivity = harvests.length ? totalProductivity / harvests.length : 0

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight brand-title">Data Panen</h2>
          <p className="text-muted-foreground">Catat hasil panen dan pendapatan</p>
        </div>
        <div className="flex gap-2">
          <ExportButtons type="harvests" data={harvests} />
          <Button onClick={() => setIsModalOpen(true)} disabled={activePlants.length === 0} className="brand-btn">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Panen
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Panen</p>
                <p className="text-2xl font-bold mt-1">{harvests.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hasil</p>
                <p className="text-2xl font-bold mt-1">{totalAmount.toFixed(1)} kg</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produktivitas Rata-rata</p>
                <p className="text-2xl font-bold mt-1">{averageProductivity.toFixed(2)} kg/m²</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activePlants.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-muted-foreground">
              Tidak ada tanaman aktif. Tambahkan tanaman terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Harvests List */}
      {harvests.length === 0 ? (
        activePlants.length > 0 && (
          <Card>
            <CardContent className="py-14 text-center">
              <p className="text-muted-foreground">
                Belum ada data panen. Klik tombol &quot;Tambah Panen&quot; untuk memulai.
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardHeader className="brand-header-gradient">
            <CardTitle className="tracking-tight">Riwayat Panen</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {harvests.map((harvest) => {
                const plant = plants.find(p => p.id === harvest.plantId)
                const productivity = productivityData[harvest.id] ?? 0
                const plantTypeInfo = getPlantTypeInfo(plant?.plantType)
                
                return (
                  <div
                    key={harvest.id}
                    className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <span className="text-2xl">
                          {plantTypeInfo?.icon || '🌱'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{harvest.plantName}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(harvest.date)}
                        </Badge>
                        <Badge 
                          variant={
                            harvest.quality === 'excellent' ? 'success' :
                            harvest.quality === 'good' ? 'info' : 'warning'
                          }
                          className="text-xs"
                        >
                          {harvest.quality === 'excellent' ? 'Sangat Baik' :
                           harvest.quality === 'good' ? 'Baik' : 'Cukup'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Hasil Panen</span>
                          <p className="font-medium">{harvest.amount} {harvest.unit}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Harga/kg</span>
                          <p className="font-medium">{formatCurrency(harvest.pricePerKg)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Pendapatan</span>
                          <p className="font-medium text-green-600">
                            {formatCurrency(getRevenue(harvest))}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Produktivitas</span>
                          <p className="font-medium text-purple-600">
                            {productivity.toFixed(2)} kg/m²
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(() => {
                              const amount = safeParseNumber(harvest.amount)
                              const unit = harvest.unit || 'kg'
                              let amountInKg = amount
                              if (unit === 'ton') {
                                amountInKg = amount * 1000
                              } else if (unit === 'kuintal') {
                                amountInKg = amount * 100
                              }
                              return `${amountInKg} kg ÷ ${safeParseNumber(plant?.landArea)} m²`
                            })()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Luas Lahan</span>
                          <p className="font-medium">
                            {plant?.landArea || 0} m²
                          </p>
                        </div>
                      </div>
                    
                      {harvest.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Catatan: {harvest.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(harvest)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(harvest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingHarvest ? 'Edit Data Panen' : 'Tambah Data Panen'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantId">Tanaman *</Label>
            <Select
              id="plantId"
              value={formData.plantId}
              onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
              required
            >
              <option value="">Pilih Tanaman</option>
              {activePlants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.plantName}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Panen *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Hasil *</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                placeholder="100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Satuan *</Label>
              <Select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="ton">Ton</option>
                <option value="kuintal">Kuintal</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerKg">Harga per Kilogram (Rp) *</Label>
            <Input
              id="pricePerKg"
              type="number"
              placeholder="5000"
              value={formData.pricePerKg}
              onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              💡 Harga per kg (sistem akan otomatis konversi untuk ton/kuintal)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Kualitas Hasil *</Label>
            <Select
              id="quality"
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              required
            >
              <option value="excellent">Sangat Baik</option>
              <option value="good">Baik</option>
              <option value="fair">Cukup</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              placeholder="Catatan tambahan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {formData.amount && formData.pricePerKg && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              <p className="text-2xl font-bold text-primary">
                {(() => {
                  const amount = parseFloat(formData.amount)
                  const price = parseFloat(formData.pricePerKg)
                  const unit = formData.unit || 'kg'
                  
                  // Convert amount to kg based on unit
                  let amountInKg = amount
                  if (unit === 'ton') {
                    amountInKg = amount * 1000
                  } else if (unit === 'kuintal') {
                    amountInKg = amount * 100
                  }
                  
                  return formatCurrency(amountInKg * price)
                })()}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingHarvest ? 'Simpan Perubahan' : 'Tambah Panen'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
