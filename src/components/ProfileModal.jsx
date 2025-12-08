import { useState } from 'react'
import { useAuth } from '@/context/useAuth'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Input, Label } from './ui/Input'
import { User, Mail, Calendar, X, Key, AlertCircle } from 'lucide-react'

export function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  if (!isOpen) return null

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password minimal 8 karakter')
      return
    }
    
    setIsChangingPassword(true)
    
    try {
      const API = 'https://agrikalcer-backend-production.up.railway.app'
      const response = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password')
      }
      
      setPasswordSuccess('Password berhasil diubah! Email konfirmasi telah dikirim.')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess('')
      }, 3000)
      
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

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
        <Card className="bg[#0f1913] border border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#ffe457]">
                {showPasswordForm ? 'Ubah Password' : 'Profil Pengguna'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (showPasswordForm) {
                    setShowPasswordForm(false)
                  } else {
                    onClose()
                  }
                }}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-400">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-green-400" />
                    <p className="text-sm text-green-400">{passwordSuccess}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Masukkan password saat ini"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Masukkan password baru (minimal 8 karakter)"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password baru"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder-white/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    disabled={isChangingPassword}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#ffe457] hover:bg-[#ffd12f] text-[#1b2c1f]"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Mengubah...' : 'Ubah Password'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
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

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Ubah Password
                  </Button>

                  <Button
                    className="flex-1 bg-[#ffe457] hover:bg-[#ffd12f] text-[#1b2c1f]"
                    onClick={onClose}
                  >
                    Tutup
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
