import { useEffect, useRef, useState } from 'react'

export function MapPicker({ value = { lat: -7.7956, lng: 110.3695 }, onChange, height = '300px', address = '' }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const initializeMap = () => {
      // Check if Leaflet is available
      if (!window.L) {
        if (retryCount < 10) {
          // Retry after 500ms
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 500)
          return
        } else {
          setError('Leaflet tidak dapat dimuat. Menggunakan input manual...')
          setUseFallback(true)
          setMapLoaded(true)
          return
        }
      }

      if (!mapContainer.current || map.current) return

      try {
        // Initialize Leaflet map
        map.current = window.L.map(mapContainer.current).setView([value.lat, value.lng], 13)

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.current)

        // Add marker
        marker.current = window.L.marker([value.lat, value.lng], {
          draggable: true
        }).addTo(map.current)

        // Handle marker drag
        marker.current.on('dragend', (e) => {
          const position = e.target.getLatLng()
          onChange({ lat: position.lat, lng: position.lng })
        })

        // Handle map click
        map.current.on('click', (e) => {
          const position = e.latlng
          marker.current.setLatLng([position.lat, position.lng])
          onChange({ lat: position.lat, lng: position.lng })
        })

        setMapLoaded(true)
        setError(null)

      } catch (err) {
        console.error('Map initialization error:', err)
        setError('Gagal menginisialisasi peta. Menggunakan fallback...')
        setUseFallback(true)
        setMapLoaded(true)
      }

      return () => {
        if (map.current) {
          map.current.remove()
          map.current = null
        }
      }
    }

    initializeMap()
  }, [retryCount])

  useEffect(() => {
    if (mapLoaded && marker.current && map.current && !useFallback) {
      const currentPosition = marker.current.getLatLng()
      if (currentPosition.lat !== value.lat || currentPosition.lng !== value.lng) {
        marker.current.setLatLng([value.lat, value.lng])
        map.current.setView([value.lat, value.lng])
      }
    }
  }, [value, mapLoaded, useFallback])

  // Fallback UI when Leaflet fails
  if (useFallback) {
    return (
      <div>
        <div className="relative">
          <div 
            style={{ 
              width: '100%', 
              height: height,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          >
            <div className="text-center p-4">
              <div className="text-yellow-500 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-3">Peta tidak tersedia, gunakan input manual koordinat</p>
              {address && (
                <p className="text-xs text-gray-500 mb-2">
                  Alamat: {address}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <label className="text-xs text-gray-500">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={value.lat}
                    onChange={(e) => onChange({ ...value, lat: parseFloat(e.target.value) || -7.7956 })}
                    className="w-full px-2 py-1 text-sm border rounded"
                    placeholder="-7.7956"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={value.lng}
                    onChange={(e) => onChange({ ...value, lng: parseFloat(e.target.value) || 110.3695 })}
                    className="w-full px-2 py-1 text-sm border rounded"
                    placeholder="110.3695"
                  />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>Atau gunakan lokasi default:</p>
                <button 
                  onClick={() => onChange({ lat: -7.7956, lng: 110.3695 })}
                  className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                  Yogyakarta
                </button>
                <button 
                  onClick={() => onChange({ lat: -6.2088, lng: 106.8456 })}
                  className="mt-1 ml-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                  Jakarta
                </button>
                <button 
                  onClick={() => onChange({ lat: -7.2575, lng: 112.7521 })}
                  className="mt-1 ml-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                  Surabaya
                </button>
              </div>
              <button 
                onClick={() => {
                  setUseFallback(false)
                  setRetryCount(0)
                }} 
                className="mt-3 text-xs text-blue-500 hover:text-blue-700"
              >
                Coba peta lagi
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Koordinat: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          {address && ` | Alamat: ${address}`}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="relative">
          <div 
            style={{ 
              width: '100%', 
              height: height,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          >
            <div className="text-center p-4">
              <div className="text-red-500 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">{error}</p>
              <div className="mt-3 space-x-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Refresh Halaman
                </button>
                <button 
                  onClick={() => {
                    setError(null)
                    setRetryCount(0)
                  }} 
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Coba Lagi
                </button>
                <button 
                  onClick={() => setUseFallback(true)} 
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Input Manual
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Koordinat: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          {address && ` | Alamat: ${address}`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative">
        <div 
          ref={mapContainer} 
          style={{ 
            width: '100%', 
            height: height,
            borderRadius: '8px',
            overflow: 'hidden'
          }} 
        />
        {!mapLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">
                {retryCount > 0 ? `Memuat peta... (${retryCount}/10)` : 'Memuat peta...'}
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {address ? `Lokasi dari: ${address} | ` : ''}
        Klik peta atau seret marker untuk menyesuaikan lokasi. Koordinat: {typeof value.lat === 'number' ? value.lat.toFixed(6) : '0.000000'}, {typeof value.lng === 'number' ? value.lng.toFixed(6) : '0.000000'}
      </p>
    </div>
  )
}
