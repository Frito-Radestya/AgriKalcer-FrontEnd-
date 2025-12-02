import { useState, useEffect } from 'react'
import { useData } from '@/context/useData'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { MapDisplay } from '@/components/MapDisplay'
import { MapPicker } from '@/components/MapPicker'
import { MapPin, Plus, Edit, Trash2, Map, Navigation } from 'lucide-react'

export function Lands() {
  const { lands, addLand, updateLand, deleteLand, plants } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLand, setEditingLand] = useState(null)
  const [showMapView, setShowMapView] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    soilType: '',
    latitude: '',
    longitude: '',
    notes: '',
  })

  // Fungsi untuk geocoding alamat ke koordinat
  const geocodeAddress = async (address) => {
    if (!address || address.trim() === '') return

    try {
      // Menggunakan Nominatim (OpenStreetMap Geocoding) - gratis
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        
        // Update form data dengan koordinat baru
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }))
        
        console.log(`Geocoding berhasil: ${address} -> ${lat}, ${lng}`)
        return { lat, lng }
      } else {
        console.log('Alamat tidak ditemukan')
        return null
      }
    } catch (error) {
      console.error('Error geocoding:', error)
      return null
    }
  }

  // Handle perubahan alamat dengan auto-geocoding
  useEffect(() => {
    if (!formData.location || formData.location.trim() === '') return

    // Debounce geocoding (tunggu user selesai mengetik)
    const timeoutId = setTimeout(() => {
      geocodeAddress(formData.location)
    }, 1500)
    
    return () => clearTimeout(timeoutId)
  }, [formData.location])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const landData = {
      name: formData.name,
      area_size: parseFloat(formData.area) || 0,
      location: formData.location,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      soilType: formData.soilType,
      notes: formData.notes,
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
      name: land.name || land.landName || '',
      area: land.area_size || land.landArea || '',
      location: land.location || '',
      latitude: land.latitude ? String(land.latitude) : '',
      longitude: land.longitude ? String(land.longitude) : '',
      soilType: land.soilType || '',
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
      location: '',
      area: '',
      soilType: '',
      latitude: '',
      longitude: '',
      notes: '',
    })
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

  // Update all lands with null area_size
  const updateAllLandsArea = async () => {
    const landsToUpdate = lands.filter(land => !land.landArea || land.landArea === '')
    
    if (landsToUpdate.length === 0) {
      alert('Semua lahan sudah memiliki data luas!')
      return
    }
    
    if (confirm(`Ada ${landsToUpdate.length} lahan yang belum memiliki luas. Apakah Anda ingin mengupdate semua dengan luas default 1000 m²?`)) {
      for (const land of landsToUpdate) {
        const landData = {
          name: land.landName,
          area_size: 1000, // Default value
          location: land.location,
          latitude: land.latitude,
          longitude: land.longitude,
          soilType: land.soilType,
          notes: land.notes,
        }
        await updateLand(land.id, landData)
      }
      alert('Berhasil mengupdate semua lahan!')
    }
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight brand-title">Lahan & Lokasi</h2>
          <p className="text-muted-foreground">Kelola data lahan pertanian</p>
        </div>
        <div className="flex gap-2">
          {lands.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowMapView(!showMapView)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                {showMapView ? 'Tampil Grid' : 'Tampil Peta'}
              </Button>
              <Button 
                variant="outline" 
                onClick={updateAllLandsArea}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Update Luas Lahan
              </Button>
            </>
          )}
          <Button onClick={() => setIsModalOpen(true)} className="brand-btn">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Lahan
          </Button>
        </div>
      </div>

      {/* Lands Display */}
      {lands.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-muted-foreground">
              Belum ada data lahan. Klik tombol &quot;Tambah Lahan&quot; untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {showMapView ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Peta Lokasi Lahan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapDisplay 
                  lands={lands.filter(land => land.latitude && land.longitude)} 
                  height="500px"
                />
                {lands.filter(land => land.latitude && land.longitude).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Belum ada lahan dengan koordinat GPS. Tambahkan koordinat pada data lahan untuk melihat lokasi di peta.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map((land) => {
                const activePlants = getPlantCount(land.landName)
                
                return (
                  <Card key={land.id}>
                    <CardHeader className="brand-header-gradient">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{land.landName}{land.landArea ? ` (${land.landArea} m²)` : ''}</CardTitle>
                          </div>
                        </div>
                        {activePlants > 0 && (
                          <Badge variant="success">{activePlants} tanaman</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Lokasi</p>
                        <p className="font-medium">{land.location || '-'}</p>
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
        </>
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
              placeholder="Masukkan nama lahan"
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
              placeholder="Masukkan luas lahan dalam m²"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi/Alamat *</Label>
            <Input
              id="location"
              placeholder="Contoh: Jl. Sudirman No. 123, Jakarta atau Desa Sukamaju, Kec. Cianjur"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">
              Masukkan alamat lengkap. Koordinat akan dicari otomatis.
            </p>
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
            <Label>Lokasi di Peta</Label>
            <p className="text-xs text-gray-500">
              Koordinat otomatis dari alamat. Seret marker untuk menyesuaikan lokasi jika perlu.
            </p>
            <MapPicker
              value={{ lat: parseFloat(formData.latitude) || -7.7956, lng: parseFloat(formData.longitude) || 110.3695 }}
              onChange={(pos) => setFormData({ ...formData, latitude: pos.lat, longitude: pos.lng })}
              height="250px"
              address={formData.location}
            />
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
