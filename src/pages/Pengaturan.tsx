import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Building2, Database } from "lucide-react";

export default function Pengaturan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Konfigurasi sistem dan data master
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Data Desa
            </CardTitle>
            <CardDescription>
              Informasi desa, alamat, dan kepala desa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Desa</label>
                <p className="text-muted-foreground">Desa Maju Sejahtera</p>
              </div>
              <div>
                <label className="text-sm font-medium">Alamat</label>
                <p className="text-muted-foreground">Jl. Raya Desa No. 1, Kec. Maju, Kab. Sejahtera</p>
              </div>
              <div>
                <label className="text-sm font-medium">Kepala Desa</label>
                <p className="text-muted-foreground">H. Ahmad Maulana, S.E.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Restore
            </CardTitle>
            <CardDescription>
              Backup otomatis dan restore data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Terakhir Backup</label>
                <p className="text-muted-foreground">Hari ini, 03:00 WIB</p>
              </div>
              <div>
                <label className="text-sm font-medium">Frekuensi</label>
                <p className="text-muted-foreground">Harian (otomatis)</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-success">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Konfigurasi Lanjutan
          </CardTitle>
          <CardDescription>
            Pengaturan sistem memerlukan integrasi backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
            <p className="text-muted-foreground">
              Fitur pengaturan lengkap termasuk user management, permissions, dan system preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}