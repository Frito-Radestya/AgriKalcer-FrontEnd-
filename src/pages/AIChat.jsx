import { useState, useRef, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Halo! Saya asisten AI pertanian Anda. Saya bisa membantu Anda dengan:',
      subContent: [
        '📚 Informasi pertanian (jenis padi, hama, penyakit)',
        '🔍 Deteksi penyakit tanaman dari gambar',
        '💬 Pertanyaan umum (politik, sains, dll)',
        '🌱 Konsultasi cara menanam & perawatan'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Pastikan stream kamera terhubung ke elemen video ketika modal kamera tampil
  useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
    }
  }, [isCameraOpen, cameraStream])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      image: imagePreview
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      let response
      
      if (selectedImage) {
        // Upload image untuk disease detection
        const formData = new FormData()
        formData.append('image', selectedImage)

        const uploadResponse = await fetch('http://localhost:4001/api/ai/detect-disease', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const data = await uploadResponse.json()
          response = data.analysis
        } else {
          response = 'Maaf, gagal menganalisis gambar. Silakan coba lagi.'
        }
      } else {
        // Chat biasa
        const chatResponse = await fetch('http://localhost:4001/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: inputMessage })
        })

        if (chatResponse.ok) {
          const data = await chatResponse.json()
          response = data.response
        } else {
          response = 'Maaf, terjadi kesalahan. Silakan coba lagi.'
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Maaf, terjadi kesalahan koneksi. Silakan periksa internet Anda dan coba lagi.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraStream(stream)
      setIsCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera diizinkan.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
        setSelectedImage(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
        stopCamera()
      }, 'image/jpeg')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '👋 Halo! Saya asisten AI pertanian Anda. Saya bisa membantu Anda dengan:',
        subContent: [
          '📚 Informasi pertanian (jenis padi, hama, penyakit)',
          '🔍 Deteksi penyakit tanaman dari gambar',
          '💬 Pertanyaan umum (politik, sains, dll)',
          '🌱 Konsultasi cara menanam & perawatan'
        ]
      }
    ])
  }

  const formatMessage = (text) => {
    if (!text) return ''
    // Hapus penanda bold Markdown **teks** agar tampilan lebih bersih
    return text.replace(/\*\*(.*?)\*\*/g, '$1')
  }

  return (
    <div className="min-h-screen text-[#f7f3eb] p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ffe457]/20 to-[#ffd12f]/20 p-3 md:p-6 text-white rounded-t-2xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-[#ffe457]/20 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-[#ffe457]">AI Assistant Pertanian</h1>
                <p className="text-[#c4bbab] text-xs md:text-sm">Konsultasi 24/7 untuk kebutuhan pertanian Anda</p>
              </div>
            </div>
            <Button 
              onClick={clearChat}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              <span className="hidden md:inline">🔄 Reset Chat</span>
              <span className="md:hidden">🔄</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-80 md:h-96 overflow-y-auto p-3 md:p-6 border-l border-r border-white/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 md:mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] md:max-w-[65%] px-2.5 py-1.5 md:px-3 md:py-2.5 rounded-2xl text-xs md:text-sm ${
                    message.type === 'user'
                      ? 'bg-[#ffe457] text-[#1b2c1f]'
                      : 'bg-white/10 border border-white/20 text-white backdrop-blur'
                  }`}
                >
                  {message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image}
                        alt="Uploaded plant"
                        className="rounded-lg max-w-full h-32 md:h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-xs md:text-sm">{formatMessage(message.content)}</div>
                  {message.subContent && (
                    <div className="mt-2 space-y-1">
                      {message.subContent.map((item, index) => (
                        <div key={index} className="text-sm opacity-80">
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-2 md:mb-4">
                <div className="bg-white/10 border border-white/20 px-3 py-2 md:px-4 md:py-3 rounded-2xl backdrop-blur">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ffe457] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ffe457] rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ffe457] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
        {imagePreview && (
          <div className="px-3 md:px-6 py-2 md:py-3 border-l border-r border-white/10">
            <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-[#c4bbab] truncate">📸 Gambar akan dianalisis untuk deteksi penyakit tanaman</p>
                  <p className="text-xs text-[#b8af9f] truncate">{selectedImage?.name}</p>
                  <p className="text-xs text-[#ffe457] hidden sm:block">💡 Pastikan gambar jelas dan minimal ukuran 50x50 pixel</p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs md:text-sm px-2 py-1"
                >
                  ❌
                </Button>
              </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 md:p-6 border-l border-r border-b border-white/10 rounded-b-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <div className="flex gap-2">
                {/* Upload dari galeri */}
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 flex-shrink-0"
                >
                  <span className="text-base md:text-lg">📁</span>
                </label>

                {/* Buka kamera */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 flex-shrink-0"
                >
                  <span className="text-base md:text-lg">📷</span>
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedImage
                      ? "Tambahkan deskripsi gambar (opsional)..."
                      : "Tanya apa saja tentang pertanian atau topik lainnya..."
                  }
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-[#ffe457] focus:border-white/30 text-xs md:text-sm h-9 md:h-10 px-2 md:px-3"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                className="bg-[#ffe457] hover:bg-[#ffd12f] text-[#1b2c1f] px-3 md:px-4 h-9 md:h-10 text-sm flex-shrink-0"
              >
                <span className="hidden md:inline">{isLoading ? '⏳ Kirim' : '📤 Kirim'}</span>
                <span className="md:hidden">{isLoading ? '⏳' : '📤'}</span>
              </Button>
            </div>
            
            <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
              <Badge className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] md:text-xs px-2 py-1" onClick={() => setInputMessage('Apa saja jenis padi yang ada di Indonesia?')}>
                🌾 Jenis Padi
              </Badge>
              <Badge className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] md:text-xs px-2 py-1" onClick={() => setInputMessage('Bagaimana cara mengatasi hama ulat pada tanaman?')}>
                🐛 Hama Tanaman
              </Badge>
              <Badge className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] md:text-xs px-2 py-1" onClick={() => setInputMessage('Bagaimana cara menanam tomat dengan baik?')}>
                🍅 Menanam Tomat
              </Badge>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="p-3 md:p-4 bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all cursor-pointer rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🌱</span>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">Info Pertanian</h3>
                <p className="text-xs md:text-sm text-[#c4bbab]">Jenis tanaman & cara menanam</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4 bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all cursor-pointer rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🔬</span>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">Deteksi Penyakit</h3>
                <p className="text-xs md:text-sm text-[#c4bbab]">Upload foto tanaman</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4 bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all cursor-pointer rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">Tanya Umum</h3>
                <p className="text-xs md:text-sm text-[#c4bbab]">Politik, sains, dll</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Kamera */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 max-w-md w-full border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Ambil Foto</h3>
                <button 
                  onClick={stopCamera}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 md:h-80 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center border-4 border-white/30"
                >
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
