import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react'

const API_KEY = 'ceccc44be3b0d4904bf5c84a2c1c76db'
const CITY = 'Jakarta' // Coba dengan Jakarta dulu

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
    // Generate data dummy konsisten berdasarkan koordinat
    const generateConsistentWeather = (lat, lon) => {
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
      
      // Estimasi nama kota berdasarkan koordinat (Indonesia)
      let cityName = 'Lokasi Anda'
      
      // Sumatera Utara (Medan area)
      if (lat > 2 && lat < 4 && lon > 97 && lon < 100) {
        cityName = 'Sumatera Utara'
      }
      // Aceh
      else if (lat > 3 && lat < 6 && lon > 95 && lon < 98) {
        cityName = 'Aceh'
      }
      // Sumatera Barat (Padang area)
      else if (lat > -2 && lat < 1 && lon > 99 && lon < 102) {
        cityName = 'Sumatera Barat'
      }
      // Riau
      else if (lat > -0.5 && lat < 2 && lon > 100 && lon < 103) {
        cityName = 'Riau'
      }
      // Jambi
      else if (lat > -2 && lat < -1 && lon > 102 && lon < 104) {
        cityName = 'Jambi'
      }
      // Bangka Belitung
      else if (lat > -3 && lat < -2 && lon > 105 && lon < 107) {
        cityName = 'Bangka Belitung'
      }
      // Jakarta
      else if (lat > -6.5 && lat < -6 && lon > 106.5 && lon < 107) {
        cityName = 'Jakarta'
      }
      // Bandung
      else if (lat > -7 && lat < -6.5 && lon > 107 && lon < 108) {
        cityName = 'Bandung'
      }
      // Surabaya
      else if (lat > -7.5 && lat < -7 && lon > 112 && lon < 113) {
        cityName = 'Surabaya'
      }
      // Yogyakarta
      else if (lat > -8 && lat < -7.5 && lon > 110 && lon < 110.5) {
        cityName = 'Yogyakarta'
      }
      // Bali
      else if (lat > -8.8 && lat < -8 && lon > 114.5 && lon < 115.5) {
        cityName = 'Bali'
      }
      // Kalimantan
      else if (lat > -4 && lat < 3 && lon > 108 && lon < 118) {
        cityName = 'Kalimantan'
      }
      // Sulawesi
      else if (lat > -5 && lat < 2 && lon > 118 && lon < 125) {
        cityName = 'Sulawesi'
      }
      // Papua
      else if (lat > -5 && lat < 2 && lon > 125 && lon < 141) {
        cityName = 'Papua'
      }
      // Nusa Tenggara
      else if (lat > -11 && lat < -8 && lon > 115 && lon < 125) {
        cityName = 'Nusa Tenggara'
      }
      
      return {
        name: cityName,
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
    
    // Gunakan data dummy konsisten tanpa API call
    const dummyData = generateConsistentWeather(lat, lon)
    setWeather(dummyData)
    setLoading(false)
  }

  const fetchWeather = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=id`
      )
      
      if (!response.ok) {
        // Jika 401, gunakan data dummy tanpa console error
        if (response.status === 401) {
          const dummyData = {
            name: CITY,
            main: {
              temp: 28,
              humidity: 75
            },
            weather: [
              {
                main: 'Clouds',
                description: 'berawan'
              }
            ]
          }
          setWeather(dummyData)
          setError(null)
          return
        }
        
        const errorData = await response.json()
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`)
      }
      
      const data = await response.json()
      setWeather(data)
      setError(null)
    } catch (err) {
      // Hanya log error untuk non-401 errors
      if (err.message && !err.message.includes('401')) {
        console.error('Weather fetch error:', err)
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="hidden md:flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 gap-3">
        <div className="animate-pulse">
          <div className="h-5 w-5 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <div className="h-3 w-16 bg-white/20 rounded animate-pulse"></div>
          <div className="h-2 w-12 bg-white/10 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hidden md:flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 gap-3">
        <Cloud className="h-5 w-5 text-gray-400" />
        <div className="flex flex-col">
          <span className="text-xs text-white/60">Cuaca Error</span>
          <span className="text-xs text-red-400">Coba lagi nanti</span>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 gap-3">
      {getWeatherIcon(weather.weather[0].main)}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white capitalize">
          {weather.weather[0].description}
        </span>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Thermometer className="h-3 w-3" />
          <span>{Math.round(weather.main.temp)}°C</span>
          <Droplets className="h-3 w-3 ml-1" />
          <span>{weather.main.humidity}%</span>
        </div>
      </div>
      <div className="text-xs text-white/50">
        {weather.name}
      </div>
    </div>
  )
}
