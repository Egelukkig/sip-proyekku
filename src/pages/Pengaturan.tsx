import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building2, Database, Shield, Save, RefreshCw, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataDesa {
  nama_desa: string;
  alamat: string;
  kode_pos: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kepala_desa: string;
  nip_kepala_desa: string;
  telepon: string;
  email: string;
}

interface SystemSettings {
  nama_sistem: string;
  versi: string;
  auto_backup: boolean;
  backup_time: string;
  email_notifications: boolean;
  max_file_size: number;
  currency: string;
  date_format: string;
}

export default function Pengaturan() {
  const { toast } = useToast();

  const [dataDesa, setDataDesa] = useState<DataDesa>({
    nama_desa: "Desa Maju Sejahtera",
    alamat: "Jl. Raya Desa No. 1, RT 01/RW 01",
    kode_pos: "16520",
    kecamatan: "Kecamatan Maju",
    kabupaten: "Kabupaten Sejahtera",
    provinsi: "Jawa Barat",
    kepala_desa: "H. Ahmad Maulana, S.E.",
    nip_kepala_desa: "196801011989031002",
    telepon: "021-87654321",
    email: "desasejahtera@gmail.com"
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    nama_sistem: "Sistem Manajemen RAB Desa",
    versi: "1.0.0",
    auto_backup: true,
    backup_time: "03:00",
    email_notifications: true,
    max_file_size: 10,
    currency: "IDR",
    date_format: "DD/MM/YYYY"
  });

  const [backupHistory] = useState([
    {
      id: 1,
      tanggal: "2024-01-17",
      waktu: "03:00",
      ukuran: "2.4 MB",
      status: "Berhasil"
    },
    {
      id: 2,
      tanggal: "2024-01-16",
      waktu: "03:00", 
      ukuran: "2.3 MB",
      status: "Berhasil"
    },
    {
      id: 3,
      tanggal: "2024-01-15",
      waktu: "03:00",
      ukuran: "2.2 MB", 
      status: "Berhasil"
    }
  ]);

  const handleSaveDataDesa = () => {
    toast({
      title: "Data Desa Disimpan",
      description: "Informasi desa berhasil diperbarui",
    });
  };

  const handleSaveSystemSettings = () => {
    toast({
      title: "Pengaturan Sistem Disimpan", 
      description: "Konfigurasi sistem berhasil diperbarui",
    });
  };

  const handleManualBackup = () => {
    toast({
      title: "Backup Dimulai",
      description: "Proses backup manual sedang berjalan...",
    });

    setTimeout(() => {
      toast({
        title: "Backup Berhasil",
        description: "Backup data berhasil dibuat",
      });
    }, 3000);
  };

  const handleRestore = () => {
    toast({
      title: "Restore Data",
      description: "Fitur restore akan segera tersedia",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Mengexport semua data sistem...",
    });

    setTimeout(() => {
      toast({
        title: "Export Berhasil",
        description: "File export berhasil dibuat dan siap didownload",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Konfigurasi sistem dan data master
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="desa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="desa">Data Desa</TabsTrigger>
          <TabsTrigger value="sistem">Pengaturan Sistem</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        {/* Data Desa Tab */}
        <TabsContent value="desa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informasi Desa
              </CardTitle>
              <CardDescription>
                Kelola informasi dasar desa dan kepala desa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_desa">Nama Desa</Label>
                  <Input
                    id="nama_desa"
                    value={dataDesa.nama_desa}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, nama_desa: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kode_pos">Kode Pos</Label>
                  <Input
                    id="kode_pos"
                    value={dataDesa.kode_pos}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, kode_pos: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea
                  id="alamat"
                  value={dataDesa.alamat}
                  onChange={(e) => setDataDesa(prev => ({ ...prev, alamat: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input
                    id="kecamatan"
                    value={dataDesa.kecamatan}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, kecamatan: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kabupaten">Kabupaten</Label>
                  <Input
                    id="kabupaten"
                    value={dataDesa.kabupaten}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, kabupaten: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provinsi">Provinsi</Label>
                  <Input
                    id="provinsi"
                    value={dataDesa.provinsi}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, provinsi: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kepala_desa">Kepala Desa</Label>
                  <Input
                    id="kepala_desa"
                    value={dataDesa.kepala_desa}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, kepala_desa: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip_kepala_desa">NIP Kepala Desa</Label>
                  <Input
                    id="nip_kepala_desa"
                    value={dataDesa.nip_kepala_desa}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, nip_kepala_desa: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telepon">Telepon</Label>
                  <Input
                    id="telepon"
                    value={dataDesa.telepon}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, telepon: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dataDesa.email}
                    onChange={(e) => setDataDesa(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="gradient-primary" onClick={handleSaveDataDesa}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Data Desa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="sistem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Konfigurasi Sistem
              </CardTitle>
              <CardDescription>
                Pengaturan umum aplikasi dan preferensi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_sistem">Nama Sistem</Label>
                  <Input
                    id="nama_sistem"
                    value={systemSettings.nama_sistem}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, nama_sistem: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="versi">Versi</Label>
                  <Input
                    id="versi"
                    value={systemSettings.versi}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, versi: e.target.value }))}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <select
                    id="currency"
                    value={systemSettings.currency}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_format">Format Tanggal</Label>
                  <select
                    id="date_format"
                    value={systemSettings.date_format}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, date_format: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_file_size">Maksimal Ukuran File (MB)</Label>
                <Input
                  id="max_file_size"
                  type="number"
                  value={systemSettings.max_file_size}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, max_file_size: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Backup otomatis setiap hari</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.auto_backup}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, auto_backup: e.target.checked }))}
                    className="rounded"
                  />
                </div>

                {systemSettings.auto_backup && (
                  <div className="space-y-2">
                    <Label htmlFor="backup_time">Waktu Backup</Label>
                    <Input
                      id="backup_time"
                      type="time"
                      value={systemSettings.backup_time}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, backup_time: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground">Kirim notifikasi ke email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.email_notifications}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                    className="rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="gradient-primary" onClick={handleSaveSystemSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Manual
                </CardTitle>
                <CardDescription>
                  Buat backup data secara manual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status Auto Backup</Label>
                  <Badge className="bg-green-100 text-green-800">
                    {systemSettings.auto_backup ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Label>Jadwal Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Setiap hari pada {systemSettings.backup_time} WIB
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={handleManualBackup}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Backup Sekarang
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Semua Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restore Data</CardTitle>
                <CardDescription>
                  Pulihkan data dari file backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restore_file">Pilih File Backup</Label>
                  <Input
                    id="restore_file"
                    type="file"
                    accept=".sql,.zip,.bak"
                  />
                </div>

                <Button variant="outline" className="w-full" onClick={handleRestore}>
                  <Upload className="h-4 w-4 mr-2" />
                  Restore Data
                </Button>

                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Peringatan:</strong> Proses restore akan mengganti semua data yang ada. 
                    Pastikan Anda telah membackup data terbaru.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Backup</CardTitle>
              <CardDescription>
                History backup yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Backup {new Date(backup.tanggal).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {backup.waktu} WIB • Ukuran: {backup.ukuran}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        {backup.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Keamanan Sistem
              </CardTitle>
              <CardDescription>
                Pengaturan keamanan dan akses sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Security Features</h3>
                <p className="text-muted-foreground mb-4">
                  Fitur keamanan lanjutan seperti manajemen user, role-based access, dan audit log 
                  memerlukan integrasi dengan sistem autentikasi backend.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Password Policy</span>
                    <Badge>Coming Soon</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Two-Factor Authentication</span>
                    <Badge>Coming Soon</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>User Session Management</span>
                    <Badge>Coming Soon</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Audit Log</span>
                    <Badge>Coming Soon</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}