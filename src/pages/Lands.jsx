import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Plus, Edit, Trash2, Navigation } from 'lucide-react'

export function Lands() {
  const { lands, addLand, updateLand, deleteLand, plants } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLand, setEditingLand] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    location: '',
    latitude: '',
    longitude: '',
    soilType: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const landData = {
      ...formData,
      area: parseFloat(formData.area),
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    }
    
    if (editingLand) {
      updateLand(editingLand.id, landData)
    } else {
      addLand(landData)
    }
    
    handleCloseModal()
  }

  const handleEdit = (land) => {
    setEditingLand(land)
    setFormData({
      name: land.name,
      area: land.area.toString(),
      location: land.location,
      latitude: land.latitude?.toString() || '',
      longitude: land.longitude?.toString() || '',
      soilType: land.soilType,
      notes: land.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data lahan ini?')) {
      deleteLand(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingLand(null)
    setFormData({
      name: '',
      area: '',
      location: '',
      latitude: '',
      longitude: '',
      soilType: '',
      notes: '',
    })
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          })
        },
        (error) => {
          alert('Tidak dapat mengakses lokasi: ' + error.message)
        }
      )
    } else {
      alert('Browser tidak mendukung geolocation')
    }
  }

  const openInMaps = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
    }
  }

  // Get plant count per land
  const getPlantCount = (landName) => {
    return plants.filter(p => p.landName === landName && p.status === 'active').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lahan & Lokasi</h2>
          <p className="text-muted-foreground">Kelola data lahan pertanian</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Lahan
        </Button>
      </div>

      {/* Lands Grid */}
      {lands.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Belum ada data lahan. Klik tombol "Tambah Lahan" untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lands.map((land) => {
            const activePlants = getPlantCount(land.name)
            
            return (
              <Card key={land.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{land.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {land.area} m²
                        </p>
                      </div>
                    </div>
                    {activePlants > 0 && (
                      <Badge variant="success">{activePlants} tanaman</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                    <p className="font-medium">{land.location}</p>
                  </div>

                  {land.soilType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Jenis Tanah</p>
                      <p className="font-medium">{land.soilType}</p>
                    </div>
                  )}

                  {land.latitude && land.longitude && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Koordinat GPS</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {land.latitude}, {land.longitude}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openInMaps(land.latitude, land.longitude)}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {land.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Catatan</p>
                      <p className="text-sm">{land.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(land)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(land.id)}
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
        title={editingLand ? 'Edit Data Lahan' : 'Tambah Data Lahan'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lahan *</Label>
            <Input
              id="name"
              placeholder="Contoh: Sawah A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Luas Lahan (m²) *</Label>
            <Input
              id="area"
              type="number"
              placeholder="1000"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi/Alamat *</Label>
            <Input
              id="location"
              placeholder="Contoh: Desa Sukamaju, Kec. Cianjur"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soilType">Jenis Tanah</Label>
            <Input
              id="soilType"
              placeholder="Contoh: Tanah Liat, Tanah Humus"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Koordinat GPS (Opsional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Gunakan Lokasi Saat Ini
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
              <Input
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Catatan tambahan tentang lahan..."
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
              {editingLand ? 'Simpan Perubahan' : 'Tambah Lahan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
