import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RAB() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">RAB Kegiatan</h2>
          <p className="text-muted-foreground">
            Kelola Rencana Anggaran Biaya untuk setiap kegiatan
          </p>
        </div>
        <Button className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Buat RAB Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Total RAB Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Kegiatan dengan RAB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp 2.5M</div>
            <p className="text-sm text-muted-foreground">Dari semua RAB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status RAB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Draft</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aktif</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Selesai</span>
                <span className="text-sm font-medium">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daftar RAB Kegiatan
          </CardTitle>
          <CardDescription>
            Implementasi lengkap RAB akan tersedia setelah integrasi backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">RAB Management System</h3>
            <p className="text-muted-foreground">
              Fitur lengkap untuk mengelola item RAB, kalkulasi anggaran, dan tracking realisasi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}