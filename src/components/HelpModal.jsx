import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { HelpCircle, Mail, Phone, MessageCircle, X, Book, Users, Headphones } from 'lucide-react'

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md mx-4">
        <Card className="bg-[#0f1913] border border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#ffe457]">Pusat Bantuan</CardTitle>
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
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#ffe457]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="h-8 w-8 text-[#ffe457]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Butuh Bantuan?</h3>
                <p className="text-sm text-[#c4bbab]">Kami siap membantu Anda 24/7</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffe457]/20 rounded-lg flex items-center justify-center">
                      <Book className="h-5 w-5 text-[#ffe457]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Panduan Penggunaan</h4>
                      <p className="text-xs text-[#b8af9f]">Pelajari cara menggunakan aplikasi</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffe457]/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-[#ffe457]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">FAQ</h4>
                      <p className="text-xs text-[#b8af9f]">Pertanyaan yang sering diajukan</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffe457]/20 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#ffe457]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Komunitas</h4>
                      <p className="text-xs text-[#b8af9f]">Bergabung dengan petani lain</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffe457]/20 rounded-lg flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-[#ffe457]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Support Langsung</h4>
                      <p className="text-xs text-[#b8af9f]">Chat dengan tim support kami</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-6">
                <h4 className="font-medium text-white mb-3">Hubungi Kami</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#c4bbab]">
                    <Mail className="h-4 w-4 text-[#ffe457]" />
                    <span>support@agrikalc.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#c4bbab]">
                    <Phone className="h-4 w-4 text-[#ffe457]" />
                    <span>+62 800-1234-5678</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full bg-[#ffe457] hover:bg-[#ffd12f] text-[#1b2c1f]"
                  onClick={onClose}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
