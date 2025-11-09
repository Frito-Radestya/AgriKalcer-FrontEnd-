import { useState } from 'react'
import { useData } from '@/context/DataContext'
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
    date: new Date().toISOString().split('T')[0],
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
      date: new Date().toISOString().split('T')[0],
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
    if (!acc[item.plantName]) {
      acc[item.plantName] = []
    }
    acc[item.plantName].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Perawatan & Pemeliharaan</h2>
          <p className="text-muted-foreground">Catat aktivitas perawatan tanaman</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={activePlants.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Aktivitas
        </Button>
      </div>

      {activePlants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Tidak ada tanaman aktif. Tambahkan tanaman terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Maintenance List */}
      {maintenance.length === 0 ? (
        activePlants.length > 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Belum ada data perawatan. Klik tombol "Tambah Aktivitas" untuk memulai.
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="space-y-6">
          {Object.entries(maintenanceByPlant).map(([plantName, items]) => (
            <Card key={plantName}>
              <CardHeader>
                <CardTitle>{plantName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => {
                    const type = getMaintenanceType(item.type)
                    const Icon = type?.icon || Droplets

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                      >
                        <div className={`p-2 rounded-lg bg-background`}>
                          <Icon className={`h-5 w-5 ${type?.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{type?.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {formatDate(item.date)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
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
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Catatan: {item.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMaintenance ? 'Edit Aktivitas Perawatan' : 'Tambah Aktivitas Perawatan'}
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
            <Label htmlFor="type">Jenis Aktivitas *</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
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
            <Label htmlFor="description">Deskripsi *</Label>
            <Input
              id="description"
              placeholder="Contoh: Penyiraman rutin pagi hari"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah</Label>
              <Input
                id="quantity"
                placeholder="Contoh: 10 liter"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Biaya (Rp)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              placeholder="Catatan opsional..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingMaintenance ? 'Simpan Perubahan' : 'Tambah Aktivitas'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
