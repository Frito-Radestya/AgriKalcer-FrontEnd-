import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react'
import { storage } from '@/lib/storage'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'BRAGKGfbJes7LOKFg7ajAUyDDz284fXv'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001'

export function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Dapatkan lokasi user otomatis
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            fetchWeatherByCoords(latitude, longitude)
          },
          (error) => {
            console.log('Geolocation denied, using default city')
            // Fallback ke kota default
            useDummyData()
          }
        )
      } else {
        console.log('Geolocation not supported, using default city')
        useDummyData()
      }
    }

    // Jalankan pertama kali
    getLocation()
    
    // Refresh setiap 5 menit untuk update lokasi dan cuaca
    const interval = setInterval(getLocation, 300000)
    
    return () => clearInterval(interval)
  }, [])

  // Coba dapatkan nama lokasi manusiawi dari API cuaca atau layanan reverse geocoding
  const getLocationName = async (lat, lon, apiLocationName) => {
    // 1) Prioritas: nama lokasi dari Tomorrow.io kalau tersedia
    if (apiLocationName && typeof apiLocationName === 'string') {
      return apiLocationName
    }

    // 2) Fallback: reverse geocoding ke Nominatim (OpenStreetMap)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`
      const res = await fetch(url, {
        headers: {
          // Nominatim menyarankan menyertakan User-Agent yang jelas, tapi browser biasanya akan menambahkan sendiri.
        },
      })
      if (!res.ok) throw new Error('Nominatim error')

      const data = await res.json()
      const address = data.address || {}

      // Pilih field yang paling mendekati kota/kabupaten
      return (
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state ||
        'Lokasi Anda'
      )
    } catch (e) {
      console.warn('Reverse geocoding gagal, pakai label default.', e)
      return 'Lokasi Anda'
    }
  }

  const useDummyData = () => {
    // Generate data dummy yang konsisten berdasarkan waktu dan lokasi
    const generateConsistentWeather = (lat = 0, lon = 0) => {
      // Gunakan timestamp saat ini untuk konsistensi
      const now = new Date()
      const hour = now.getHours()
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
      
      // Generate suhu berdasarkan latitude, jam, dan hari (konsisten)
      const baseTemp = 25
      const tempVariation = Math.abs(lat) * 0.5
      const timeVariation = Math.sin((hour - 12) * Math.PI / 12) * 3 // Panas siang, dingin malam
      const dayVariation = Math.sin(dayOfYear * Math.PI / 182) * 2 // Musiman
      const temp = Math.round(baseTemp + tempVariation + timeVariation + dayVariation)
      
      // Generate humidity berdasarkan suhu (konsisten)
      const humidity = Math.round(80 - (temp - 20) * 1.5 + (lat * 2))
      
      // Generate weather berdasarkan suhu, jam, dan lokasi (dengan randomness konsisten)
      const baseSeed = (temp + hour + dayOfYear + Math.floor(lat) + Math.floor(lon)) % 100
      // Gunakan timestamp per menit untuk konsistensi antar device
      const minuteSeed = Math.floor(Date.now() / 60000) % 5 // 0-4, berubah per menit
      const weatherSeed = (baseSeed + minuteSeed) % 100
      let weather, description
      
      if (weatherSeed < 25) {
        weather = 'Rain'
        description = 'hujan ringan'
      } else if (weatherSeed < 40) {
        weather = 'Clouds'
        description = 'berawan'
      } else if (weatherSeed < 60) {
        weather = 'Clouds'
        description = 'sebagian berawan'
      } else {
        weather = 'Clear'
        description = 'cerah'
      }
      
      return {
        name: 'Lokasi Anda',
        main: {
          temp: Math.max(18, Math.min(35, temp)), // Batasi suhu 18-35°C
          humidity: Math.max(40, Math.min(95, humidity)) // Batasi humidity 40-95%
        },
        weather: [{
          main: weather,
          description: description
        }]
      }
    }
    
    const dummyData = generateConsistentWeather()
    setWeather(dummyData)
    setLoading(false)
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${API_KEY}`
      )
      if (!response.ok) {
        throw new Error(`Tomorrow.io error: ${response.status}`)
      }
      const data = await response.json()

      // Mapping Tomorrow.io response ke format widget
      const values = data?.data?.values || {}
      const temp = values.temperature || values.temperatureApparent || 25
      const humidity = values.humidity || 70
      const weatherCode = values.weatherCode || 0
      const precipProb = values.precipitationProbability || 0

      // Coba ambil nama lokasi dari response Tomorrow.io (kalau ada)
      const apiLocationName = data?.location?.name

      // Tentukan hujan vs tidak berdasarkan probabilitas hujan
      let description = 'cerah'
      let main = 'Clear'
      if (precipProb >= 60) {
        description = 'hujan'
        main = 'Rain'
      } else if (precipProb >= 30) {
        description = 'hujan ringan'
        main = 'Rain'
      } else if (weatherCode >= 4000 && weatherCode < 5000) {
        description = 'berawan'
        main = 'Clouds'
      } else if (weatherCode >= 5000 && weatherCode < 6000) {
        description = 'sebagian berawan'
        main = 'Clouds'
      }

      // Dapatkan nama lokasi manusiawi (kombinasi Tomorrow.io + reverse geocoding)
      const locationName = await getLocationName(lat, lon, apiLocationName)

      setWeather({
        name: locationName,
        main: {
          temp: Math.round(temp),
          humidity: Math.round(humidity),
        },
        weather: [
          {
            main,
            description,
          },
        ],
      })
      setError(null)
    } catch (err) {
      console.error('Tomorrow.io fetch error:', err)
      // Fallback ke dummy
      useDummyData()
    } finally {
      setLoading(false)
    }
  }

  // Kirim kondisi cuaca ke backend untuk membuat notifikasi AI berbasis cuaca
  useEffect(() => {
    const sendWeatherNotification = async () => {
      if (!weather) return

      try {
        const token = storage.get('TOKEN')
        if (!token) return

        const main = weather.weather?.[0]?.main || ''
        const description = weather.weather?.[0]?.description || ''
        const temp = weather.main?.temp

        await fetch(`${API_BASE}/api/notifications/weather-suggestion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ main, description, temp }),
        })
      } catch (err) {
        console.error('Error sending weather notification:', err)
      }
    }

    sendWeatherNotification()
  }, [weather])

  
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <Sun className="h-5 w-5 text-yellow-400" />
      case 'Clouds':
        return <Cloud className="h-5 w-5 text-gray-400" />
      case 'Rain':
        return <CloudRain className="h-5 w-5 text-blue-400" />
      case 'Drizzle':
        return <CloudRain className="h-5 w-5 text-blue-300" />
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2 gap-2 sm:gap-3">
        <div className="animate-pulse">
          <div className="h-4 w-4 sm:h-5 sm:w-5 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <div className="h-2.5 w-10 sm:w-16 bg-white/20 rounded animate-pulse"></div>
          <div className="hidden md:block h-2 w-12 bg-white/10 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2 gap-2 sm:gap-3">
        <Cloud className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs text-white/60">Cuaca Error</span>
          <span className="hidden md:block text-xs text-red-400">Coba lagi nanti</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2 gap-2 sm:gap-3">
      {getWeatherIcon(weather.weather[0].main)}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile: hanya suhu, Desktop: suhu + detail */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-white/80">
          <Thermometer className="h-3 w-3" />
          <span>{Math.round(weather.main.temp)}°C</span>
        </div>

        <div className="hidden md:flex flex-col ml-1">
          <span className="text-xs font-medium text-white capitalize">
            {weather.weather[0].description}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Droplets className="h-3 w-3" />
            <span>{weather.main.humidity}%</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block text-xs text-white/50 ml-1">
        {weather.name}
      </div>
    </div>
  )
}
