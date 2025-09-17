import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Building2,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const quickStats = [
  {
    title: "Total RAB Aktif",
    value: "12",
    description: "Kegiatan dengan RAB",
    icon: Calculator,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Surat Pesanan",
    value: "8",
    description: "Pesanan bulan ini",
    icon: ShoppingCart,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Total Supplier",
    value: "25",
    description: "Supplier terdaftar",
    icon: Building2,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "User Aktif",
    value: "6",
    description: "User dalam sistem",
    icon: Users,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

const quickActions = [
  {
    title: "Buat RAB Baru",
    description: "Tambahkan Rencana Anggaran Biaya untuk kegiatan baru",
    icon: Calculator,
    href: "/rab",
    color: "primary",
  },
  {
    title: "Surat Pesanan",
    description: "Buat surat pesanan dari RAB yang sudah ada",
    icon: ShoppingCart,
    href: "/pesanan",
    color: "success",
  },
  {
    title: "Kelola Master Data",
    description: "Tambah atau edit data kegiatan, supplier, dan user",
    icon: FileText,
    href: "/master/kegiatan",
    color: "warning",
  },
  {
    title: "Lihat Laporan",
    description: "Generate laporan dan analisis data",
    icon: BarChart3,
    href: "/laporan",
    color: "destructive",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Manajemen RAB Desa
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-smooth cursor-pointer group">
              <Link to={action.href}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-${action.color}/10 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                    <action.icon className={`h-6 w-6 text-${action.color}`} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">RAB Pembangunan Jalan dibuat</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Surat Pesanan Material diterbitkan</p>
                  <p className="text-xs text-muted-foreground">5 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Supplier baru "CV Maju Bersama" ditambahkan</p>
                  <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Perhatian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning-foreground">
                  3 RAB kegiatan mendekati batas waktu pelaksanaan
                </p>
                <Button variant="link" className="p-0 h-auto text-warning" asChild>
                  <Link to="/rab">Lihat detail</Link>
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium">
                  Backup data sistem telah berhasil dilakukan
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Terakhir backup: Hari ini, 03:00 WIB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}