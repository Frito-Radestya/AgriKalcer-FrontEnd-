import { useState, useEffect } from 'react'

export function BackgroundCarousel({ images, autoSlide = true, slideInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      setIsTransitioning(false)
    }, 50)
  }

  useEffect(() => {
    if (!autoSlide) return

    const interval = setInterval(() => {
      nextSlide()
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, isTransitioning])

  return (
    <div className="absolute inset-0">
      <div 
        className="relative w-full h-full"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full">
              <img 
                src={image} 
                alt={`Background ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#08130d] via-[#0b130f]/85 to-[#1c2f22]/80" />
    </div>
  )
}
