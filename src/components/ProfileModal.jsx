import { useState } from 'react'
import { useAuth } from '@/context/useAuth'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { User, Mail, Calendar, X } from 'lucide-react'

export function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth()
  
  if (!isOpen) return null

  // Format tanggal bergabung
  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak diketahui'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md mx-4">
        <Card className="bg-[#0f1913] border border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#ffe457]">Profil Pengguna</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#ffe457]/20 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-[#ffe457]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {user?.name || 'Pengguna'}
              </h3>
              <p className="text-sm text-[#c4bbab]">
                {user?.role || 'Petani'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <User className="h-5 w-5 text-[#ffe457]" />
                <div>
                  <p className="text-xs text-[#b8af9f]">Nama Lengkap</p>
                  <p className="text-sm text-white">
                    {user?.name || 'Tidak diisi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Mail className="h-5 w-5 text-[#ffe457]" />
                <div>
                  <p className="text-xs text-[#b8af9f]">Email</p>
                  <p className="text-sm text-white">
                    {user?.email || 'Tidak diisi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Calendar className="h-5 w-5 text-[#ffe457]" />
                <div>
                  <p className="text-xs text-[#b8af9f]">Tanggal Bergabung</p>
                  <p className="text-sm text-white">
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button 
                className="flex-1 bg-[#ffe457] hover:bg-[#ffd12f] text-[#1b2c1f]"
                onClick={onClose}
              >
                Tutup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
