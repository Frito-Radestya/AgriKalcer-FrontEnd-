import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, CardContent, CardHeader, CardTitle,
  Input,
  Alert,
  Spinner
} from '../../components/ui';
import { useAuth } from '../../context/useAuth';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Mail, Server, Lock, User } from 'lucide-react';

const EmailSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: false,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'Lumbung Tani'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001';

  const fetchEmailSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/email-settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setFormData(prev => ({
            ...prev,
            ...data.data,
            smtp_password: '' // Jangan tampilkan password yang sudah dienkripsi
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Gagal memuat pengaturan email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['smtp_host', 'smtp_port', 'smtp_user', 'from_email'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Field ini wajib diisi';
      }
    });

    if (formData.smtp_port && isNaN(formData.smtp_port)) {
      newErrors.smtp_port = 'Port harus berupa angka';
    }

    if (formData.from_email && !/\S+@\S+\.\S+/.test(formData.from_email)) {
      newErrors.from_email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Hanya kirim password jika diisi (jika tidak diisi, gunakan yang ada di database)
      const dataToSend = { ...formData };
      if (!dataToSend.smtp_password) {
        delete dataToSend.smtp_password;
      }

      const response = await fetch(`${API_BASE}/api/email-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Pengaturan email berhasil disimpan');
        // Kosongkan password setelah disimpan
        setFormData(prev => ({
          ...prev,
          smtp_password: ''
        }));
      } else {
        throw new Error(result.message || 'Gagal menyimpan pengaturan email');
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      
      const response = await fetch(`${API_BASE}/api/email-settings/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Koneksi SMTP berhasil diuji');
      } else {
        throw new Error(result.message || 'Gagal menguji koneksi SMTP');
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      toast.error(error.message || 'Gagal menguji koneksi SMTP');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Mail className="mr-2" /> Pengaturan Email
        </h1>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SMTP Server */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Konfigurasi SMTP Server
                </h2>
                
                <div>
                  <Label htmlFor="smtp_host">SMTP Host *</Label>
                  <Input
                    id="smtp_host"
                    name="smtp_host"
                    value={formData.smtp_host}
                    onChange={handleChange}
                    placeholder="smtp.example.com"
                    disabled={loading}
                    className={errors.smtp_host ? 'border-red-500' : ''}
                  />
                  {errors.smtp_host && (
                    <p className="mt-1 text-sm text-red-600">{errors.smtp_host}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_port">Port *</Label>
                    <Input
                      type="number"
                      id="smtp_port"
                      name="smtp_port"
                      value={formData.smtp_port}
                      onChange={handleChange}
                      placeholder="587"
                      disabled={loading}
                      className={errors.smtp_port ? 'border-red-500' : ''}
                    />
                    {errors.smtp_port && (
                      <p className="mt-1 text-sm text-red-600">{errors.smtp_port}</p>
                    )}
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="smtp_secure"
                        name="smtp_secure"
                        checked={formData.smtp_secure}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label htmlFor="smtp_secure">Gunakan SSL/TLS</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="smtp_user">Username SMTP *</Label>
                  <Input
                    id="smtp_user"
                    name="smtp_user"
                    type="email"
                    value={formData.smtp_user}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    disabled={loading}
                    className={errors.smtp_user ? 'border-red-500' : ''}
                  />
                  {errors.smtp_user && (
                    <p className="mt-1 text-sm text-red-600">{errors.smtp_user}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="smtp_password">Password SMTP</Label>
                  <Input
                    id="smtp_password"
                    name="smtp_password"
                    type="password"
                    value={formData.smtp_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                </div>
              </div>

              {/* Email Sender */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informasi Pengirim
                </h2>

                <div>
                  <Label htmlFor="from_email">Email Pengirim *</Label>
                  <Input
                    id="from_email"
                    name="from_email"
                    type="email"
                    value={formData.from_email}
                    onChange={handleChange}
                    placeholder="noreply@example.com"
                    disabled={loading}
                    className={errors.from_email ? 'border-red-500' : ''}
                  />
                  {errors.from_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.from_email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="from_name">Nama Pengirim</Label>
                  <Input
                    id="from_name"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    placeholder="Nama Aplikasi"
                    disabled={loading}
                  />
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Catatan Penting
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                      <li>Pastikan SMTP server mendukung koneksi yang aman</li>
                      <li>Untuk Gmail, gunakan App Password jika 2FA aktif</li>
                      <li>Periksa folder spam jika email tidak masuk ke inbox</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={loading || testing}
                className="w-full sm:w-auto"
              >
                {testing ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Menguji Koneksi...
                  </>
                ) : (
                  'Test Koneksi'
                )}
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Pengaturan'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EmailSettings;
