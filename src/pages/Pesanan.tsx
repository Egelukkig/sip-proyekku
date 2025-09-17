import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pesanan() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surat Pesanan</h2>
          <p className="text-muted-foreground">
            Kelola surat pesanan berdasarkan RAB kegiatan
          </p>
        </div>
        <Button className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Buat Surat Pesanan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Surat pesanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Pesanan baru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Menunggu approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
            <p className="text-sm text-muted-foreground">Pesanan complete</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Daftar Surat Pesanan
          </CardTitle>
          <CardDescription>
            Implementasi lengkap surat pesanan akan tersedia setelah integrasi backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Purchase Order System</h3>
            <p className="text-muted-foreground">
              Sistem lengkap untuk membuat surat pesanan dari RAB, tracking status, dan generate PDF.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}