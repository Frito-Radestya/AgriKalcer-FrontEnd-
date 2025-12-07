import { useEffect, useRef, useState } from 'react'

export function MapDisplay({ lands, height = '400px', onLandSelect = null }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  const [computedHeight, setComputedHeight] = useState(height)

  useEffect(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024
    if (w < 640) {
      setComputedHeight('260px')
    } else if (w < 1024) {
      setComputedHeight(height || '360px')
    } else {
      setComputedHeight(height || '420px')
    }
  }, [height])
  const markers = useRef([])

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
          setError('Leaflet tidak dapat dimuat. Menggunakan daftar...')
          setUseFallback(true)
          setMapLoaded(true)
          return
        }
      }

      if (!mapContainer.current || map.current) return

      try {
        // Initialize Leaflet map
        map.current = window.L.map(mapContainer.current).setView([-6.2088, 106.8456], 10) // Jakarta

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.current)

        setMapLoaded(true)
        setError(null)
        addMarkers()

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
    if (mapLoaded && lands && !useFallback) {
      addMarkers()
    }
  }, [lands, mapLoaded, useFallback])

  const addMarkers = () => {
    if (!map.current) return
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add markers for lands with coordinates
    lands.forEach(land => {
      if (land.latitude && land.longitude) {
        try {
          const marker = window.L.marker([land.latitude, land.longitude])
            .addTo(map.current)
            .bindPopup(`
              <div style="padding: 8px; min-width: 150px;">
                <h4 style="margin: 0 0 8px 0; font-weight: bold;">${land.name}</h4>
                <p style="margin: 0 0 4px 0; font-size: 12px;">Luas: ${land.area} m²</p>
                <p style="margin: 0 0 4px 0; font-size: 12px;">Lokasi: ${land.location || '-'}</p>
                ${land.soilType ? `<p style="margin: 0; font-size: 12px;">Tanah: ${land.soilType}</p>` : ''}
              </div>
            `)

          // Add click event if onLandSelect is provided
          if (onLandSelect) {
            marker.on('click', () => {
              onLandSelect(land)
            })
          }

          markers.current.push(marker)
        } catch (err) {
          console.error('Error adding marker:', err)
        }
      }
    })

    // Fit map to show all markers
    if (markers.current.length > 0) {
      try {
        const group = new window.L.featureGroup(markers.current)
        map.current.fitBounds(group.getBounds().pad(0.1))
      } catch (err) {
        console.error('Error fitting bounds:', err)
      }
    }
  }

  // Fallback UI when Leaflet fails
  if (useFallback) {
    return (
      <div className="relative">
        <div 
          style={{ 
            width: '100%', 
            height: computedHeight,
            borderRadius: '12px',
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
            <p className="text-sm text-gray-600 mb-3">Peta tidak tersedia</p>
            <div className="text-left max-w-md">
              <p className="text-xs text-gray-500 mb-2">Daftar lahan dengan koordinat:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {lands.filter(land => land.latitude && land.longitude).map(land => (
                  <div key={land.id} className="text-xs bg-white p-2 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong>{land.name}</strong> - {land.area} m²<br/>
                        <span className="text-gray-500">
                          {land.latitude.toFixed(6)}, {land.longitude.toFixed(6)}
                        </span>
                      </div>
                      {land.location && (
                        <span className="text-xs text-gray-600 ml-2">
                          {land.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {lands.filter(land => land.latitude && land.longitude).length === 0 && (
                  <p className="text-xs text-gray-400">Tidak ada lahan dengan koordinat</p>
                )}
              </div>
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
    )
  }

  if (error) {
    return (
      <div className="relative">
        <div 
          style={{ 
            width: '100%', 
            height: computedHeight,
            borderRadius: '12px',
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
                Lihat Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal map view
  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: computedHeight,
          borderRadius: '12px',
          overflow: 'hidden'
        }} 
      />
      {!mapLoaded && !error && !useFallback && (
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
  )
}
