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
  AlertCircle,
  Calendar,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

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

// Chart Data
const monthlyData = [
  { month: 'Jan', rab: 450000000, realisasi: 120000000 },
  { month: 'Feb', rab: 650000000, realisasi: 180000000 },
  { month: 'Mar', rab: 500000000, realisasi: 200000000 },
  { month: 'Apr', rab: 750000000, realisasi: 250000000 },
  { month: 'Mei', rab: 600000000, realisasi: 180000000 },
  { month: 'Jun', rab: 800000000, realisasi: 320000000 },
];

const trendData = [
  { month: 'Jan', efficiency: 27 },
  { month: 'Feb', efficiency: 28 },
  { month: 'Mar', efficiency: 40 },
  { month: 'Apr', efficiency: 33 },
  { month: 'Mei', efficiency: 30 },
  { month: 'Jun', efficiency: 40 },
];

const budgetDistribution = [
  { name: 'Infrastruktur', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Operasional', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Pembangunan', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Lainnya', value: 10, color: 'hsl(var(--chart-4))' },
];

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Manajemen RAB Desa
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} hover-scale`}>
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

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RAB vs Realisasi Chart */}
        <Card className="animate-slide-in-right hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              RAB vs Realisasi Bulanan
            </CardTitle>
            <CardDescription>
              Perbandingan anggaran dan realisasi 6 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Bulan ${label}`}
                />
                <Bar dataKey="rab" fill="hsl(var(--chart-1))" name="RAB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realisasi" fill="hsl(var(--chart-2))" name="Realisasi" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Efisiensi */}
        <Card className="animate-slide-in-right hover-lift" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Trend Efisiensi Anggaran
            </CardTitle>
            <CardDescription>
              Persentase efisiensi penggunaan anggaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 50]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Efisiensi']} />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--chart-2))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Distribution & Monthly Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Distribution Pie Chart */}
        <Card className="animate-slide-up hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              Distribusi Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {budgetDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Report Quick Access */}
        <Card className="animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Laporan Bulanan
            </CardTitle>
            <CardDescription>
              Akses cepat laporan periode berjalan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Juni 2024</p>
                  <p className="text-xs text-muted-foreground">Laporan terbaru</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Mei 2024</p>
                  <p className="text-xs text-muted-foreground">Laporan sebelumnya</p>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/laporan">
                Lihat Semua Laporan
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="animate-slide-up hover-lift" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Metrik Performa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tingkat Penyelesaian</span>
                <span className="text-sm font-bold text-success">87%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Efisiensi Anggaran</span>
                <span className="text-sm font-bold text-primary">92%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Kepuasan Supplier</span>
                <span className="text-sm font-bold text-warning">95%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full transition-all duration-1000" style={{ width: '95%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-xl font-semibold mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={action.title} className="hover-lift cursor-pointer group animate-scale-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <Link to={action.href}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-spring`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-soft" />
                <div className="flex-1">
                  <p className="text-sm font-medium">RAB Pembangunan Jalan dibuat</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '1.0s' }}>
                <div className="w-2 h-2 rounded-full bg-success mt-2 animate-pulse-soft" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Surat Pesanan Material diterbitkan</p>
                  <p className="text-xs text-muted-foreground">5 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '1.1s' }}>
                <div className="w-2 h-2 rounded-full bg-warning mt-2 animate-pulse-soft" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Supplier baru "CV Maju Bersama" ditambahkan</p>
                  <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Perhatian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 animate-fade-in hover-glow" style={{ animationDelay: '1.2s' }}>
                <p className="text-sm font-medium text-warning-foreground">
                  3 RAB kegiatan mendekati batas waktu pelaksanaan
                </p>
                <Button variant="link" className="p-0 h-auto text-warning hover-scale" asChild>
                  <Link to="/rab">Lihat detail</Link>
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in hover-glow" style={{ animationDelay: '1.3s' }}>
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