import { useState } from 'react'
import { useData } from '@/context/useData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Edit, Trash2, Droplets, Sprout, Bug } from 'lucide-react'

const MAINTENANCE_TYPES = [
  { id: 'watering', name: 'Penyiraman', icon: Droplets, color: 'text-blue-600' },
  { id: 'fertilizing', name: 'Pemupukan', icon: Sprout, color: 'text-green-600' },
  { id: 'pesticide', name: 'Pestisida', icon: Bug, color: 'text-red-600' },
  { id: 'weeding', name: 'Penyiangan', icon: Sprout, color: 'text-yellow-600' },
]

export function Maintenance() {
  const { maintenance, addMaintenance, updateMaintenance, deleteMaintenance, plants } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [formData, setFormData] = useState({
    plantId: '',
    type: '',
    date: new Date().toLocaleDateString('en-CA'),
    description: '',
    quantity: '',
    cost: '',
    notes: '',
  })

  const activePlants = plants.filter(p => p.status === 'active')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const plant = plants.find(p => p.id === parseInt(formData.plantId))
    const maintenanceData = {
      ...formData,
      plantId: parseInt(formData.plantId),
      plantName: plant?.plantName || '',
      cost: parseFloat(formData.cost) || 0,
    }
    
    if (editingMaintenance) {
      updateMaintenance(editingMaintenance.id, maintenanceData)
    } else {
      addMaintenance(maintenanceData)
    }
    
    handleCloseModal()
  }

  const handleEdit = (item) => {
    setEditingMaintenance(item)
    setFormData({
      plantId: item.plantId.toString(),
      type: item.type,
      date: item.date,
      description: item.description,
      quantity: item.quantity,
      cost: item.cost.toString(),
      notes: item.notes,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data perawatan ini?')) {
      deleteMaintenance(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMaintenance(null)
    setFormData({
      plantId: '',
      type: '',
      date: new Date().toLocaleDateString('en-CA'),
      description: '',
      quantity: '',
      cost: '',
      notes: '',
    })
  }

  const getMaintenanceType = (typeId) => {
    return MAINTENANCE_TYPES.find(t => t.id === typeId)
  }

  // Group by plant
  const maintenanceByPlant = maintenance.reduce((acc, item) => {
    if (!item.plantName) return acc
    if (!acc[item.plantName]) {
      acc[item.plantName] = []
    }
    acc[item.plantName].push(item)
    return acc
  }, {})

  const sortedMaintenance = [...maintenance].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA
  })

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight brand-title">Perawatan & Pemeliharaan</h2>
          <p className="text-muted-foreground text-sm md:text-base">Catat aktivitas perawatan tanaman</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={activePlants.length === 0} className="brand-btn text-sm md:text-base">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Tambah Aktivitas</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </div>

      {activePlants.length === 0 && (
        <Card>
          <CardContent className="py-8 md:py-14 text-center">
            <p className="text-muted-foreground text-sm md:text-base">
              Tidak ada tanaman aktif. Tambahkan tanaman terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Maintenance List */}
      {maintenance.length === 0 ? (
        activePlants.length > 0 && (
          <Card>
            <CardContent className="py-8 md:py-14 text-center">
              <p className="text-muted-foreground text-sm md:text-base">
                Belum ada data perawatan. Klik tombol &quot;Tambah Aktivitas&quot; untuk memulai.
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardHeader className="brand-header-gradient">
            <CardTitle className="tracking-tight text-base md:text-lg">Riwayat Perawatan</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 p-3 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {sortedMaintenance.map((item) => {
                const type = getMaintenanceType(item.type)
                const Icon = type?.icon || Droplets
                const iconColor = type?.color || 'text-blue-600'

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 md:gap-4 p-3 md:p-4 bg-muted rounded-lg"
                  >
                    <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="p-1.5 md:p-2 rounded-lg bg-background">
                        <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                        <h4 className="font-medium text-sm md:text-base truncate max-w-[140px] md:max-w-none">
                          {item.plantName || '-'}
                        </h4>
                        {type?.name && (
                          <Badge variant="secondary" className="text-[10px] md:text-xs">
                            {type.name}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px] md:text-xs">
                          {formatDate(item.date)}
                        </Badge>
                      </div>

                      <p className="text-xs md:text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                        {item.quantity && (
                          <span className="text-muted-foreground">
                            Jumlah: <strong>{item.quantity}</strong>
                          </span>
                        )}
                        {item.cost > 0 && (
                          <span className="text-muted-foreground">
                            Biaya: <strong>{formatCurrency(item.cost)}</strong>
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-2 italic">
                          Catatan: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-1.5 md:gap-2 flex-shrink-0 self-stretch sm:self-start">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 md:h-9 md:w-9"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 md:h-9 md:w-9"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
        title={editingMaintenance ? 'Edit Aktivitas Perawatan' : 'Tambah Aktivitas Perawatan'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantId" className="text-sm">Tanaman *</Label>
            <Select
              id="plantId"
              value={formData.plantId}
              onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
              required
              className="text-sm"
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
            <Label htmlFor="type" className="text-sm">Jenis Aktivitas *</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="text-sm"
            >
              <option value="">Pilih Jenis Aktivitas</option>
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm">Tanggal *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Deskripsi *</Label>
            <Input
              id="description"
              placeholder="Contoh: Penyiraman rutin pagi hari"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm">Jumlah</Label>
              <Input
                id="quantity"
                placeholder="Contoh: 10 liter"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-sm">Biaya (Rp)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              placeholder="Catatan opsional..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2 md:pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1 text-sm">
              Batal
            </Button>
            <Button type="submit" className="flex-1 text-sm">
              {editingMaintenance ? 'Simpan Perubahan' : 'Tambah Aktivitas'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
