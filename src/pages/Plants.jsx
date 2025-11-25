import { useState } from 'react'
import { useData } from '@/context/useData'
import { PLANT_TYPES } from '@/context/plantTypes'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ExportButtons } from '@/components/ExportButtons'
import { MapPicker } from '@/components/MapPicker'
import { formatDate, calculateDaysDifference } from '@/lib/utils'
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react'

export function Plants() {
  const { plants, addPlant, updatePlant, deletePlant, lands } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState(null)
  const [formData, setFormData] = useState({
    plantType: '',
    plantName: '',
    plantDate: new Date().toLocaleDateString('en-CA'),
    landId: '',
    newLandName: '',
    newLandArea: '',
    newLat: -7.7956,
    newLng: 110.3695,
    seedType: '',
    seedAmount: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingPlant) {
      updatePlant(editingPlant.id, formData)
    } else {
      addPlant(formData)
    }
    
    handleCloseModal()
  }

  const handleEdit = (plant) => {
    setEditingPlant(plant)
    setFormData({
      plantType: plant.plantType,
      plantName: plant.plantName,
      plantDate: plant.plantDate,
      landId: plant.landId || '',
      newLandName: '',
      newLandArea: '',
      newLat: plant.newLat || -7.7956,
      newLng: plant.newLng || 110.3695,
      seedType: plant.seedType,
      seedAmount: plant.seedAmount,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data tanaman ini?')) {
      deletePlant(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPlant(null)
    setFormData({
      plantType: '',
      plantName: '',
      plantDate: new Date().toLocaleDateString('en-CA'),
      landId: '',
      newLandName: '',
      newLandArea: '',
      newLat: -7.7956,
      newLng: 110.3695,
      seedType: '',
      seedAmount: '',
    })
  }

  const getPlantTypeInfo = (typeId) => {
    return PLANT_TYPES.find(p => p.id === typeId)
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight brand-title">Data Tanam</h2>
          <p className="text-muted-foreground">Kelola data penanaman Anda</p>
        </div>
        <div className="flex gap-2">
          <ExportButtons type="plants" data={plants} />
          <Button onClick={() => setIsModalOpen(true)} className="brand-btn">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tanaman
          </Button>
        </div>
      </div>

      {/* Plants Grid */}
      {plants.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-muted-foreground">
              Belum ada data tanaman. Klik tombol &quot;Tambah Tanaman&quot; untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => {
            const plantType = getPlantTypeInfo(plant.plantType)
            const daysUntilHarvest = calculateDaysDifference(
              new Date(),
              new Date(plant.estimatedHarvestDate)
            )
            const daysSincePlanting = calculateDaysDifference(
              new Date(plant.plantDate),
              new Date()
            )

            return (
              <Card key={plant.id}>
                <CardHeader className="brand-header-gradient">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{plantType?.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{plant.plantName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {plantType?.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant={plant.status === 'active' ? 'success' : 'secondary'}>
                      {plant.status === 'active' ? 'Aktif' : 'Panen'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{plant.landName} ({plant.landArea} m²)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Ditanam: {formatDate(plant.plantDate)}</span>
                  </div>

                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hari ke:</span>
                      <span className="font-medium">{daysSincePlanting}</span>
                    </div>
                    {plant.status === 'active' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Panen dalam:</span>
                        <span className="font-medium">
                          {daysUntilHarvest > 0 ? `${daysUntilHarvest} hari` : 'Siap panen'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bibit:</span>
                      <span className="font-medium">{plant.seedAmount || ''} {plant.seedType || ''}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(plant)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(plant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlant ? 'Edit Data Tanaman' : 'Tambah Data Tanaman'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantType">Jenis Tanaman *</Label>
            <Select
              id="plantType"
              value={formData.plantType}
              onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
              required
            >
              <option value="">Pilih Jenis Tanaman</option>
              {PLANT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name} (±{type.harvestDays} hari)
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantName">Nama Tanaman *</Label>
            <Input
              id="plantName"
              placeholder="Contoh: Padi Varietas IR64"
              value={formData.plantName}
              onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantDate">Tanggal Tanam *</Label>
            <Input
              id="plantDate"
              type="date"
              value={formData.plantDate}
              onChange={(e) => setFormData({ ...formData, plantDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landId">Lahan</Label>
              <Select
                id="landId"
                value={formData.landId}
                onChange={(e) => setFormData({ ...formData, landId: e.target.value, newLandName: '', newLandArea: '' })}
              >
                <option value="">Pilih Lahan</option>
                {lands.map((land) => (
                  <option key={land.id} value={land.id}>
                    {land.landName} ({land.landArea} m²)
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Atau Buat Lahan Baru</Label>
              <Input
                placeholder="Nama Lahan"
                value={formData.newLandName}
                onChange={(e) => setFormData({ ...formData, newLandName: e.target.value, landId: '' })}
              />
            </div>
          </div>

          {formData.newLandName && (
            <div className="space-y-2">
              <Label htmlFor="newLandArea">Luas Lahan Baru (m²)</Label>
              <Input
                id="newLandArea"
                type="number"
                placeholder="1000"
                value={formData.newLandArea}
                onChange={(e) => setFormData({ ...formData, newLandArea: e.target.value })}
                required={!!formData.newLandName}
              />
            </div>
          )}

          {formData.newLandName && (
            <div className="space-y-2">
              <Label>Lokasi Lahan (Klik pada peta)</Label>
              <MapPicker
                value={{ lat: formData.newLat, lng: formData.newLng }}
                onChange={(pos) => setFormData({ ...formData, newLat: pos.lat, newLng: pos.lng })}
                height="250px"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seedType">Jenis Bibit *</Label>
              <Input
                id="seedType"
                placeholder="Contoh: Benih Unggul"
                value={formData.seedType}
                onChange={(e) => setFormData({ ...formData, seedType: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seedAmount">Jumlah Benih *</Label>
              <Input
                id="seedAmount"
                placeholder="Contoh: 10 kg"
                value={formData.seedAmount}
                onChange={(e) => setFormData({ ...formData, seedAmount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingPlant ? 'Simpan Perubahan' : 'Tambah Tanaman'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
