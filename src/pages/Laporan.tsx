import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Download, Calendar, Calculator, TrendingUp, AlertTriangle, Filter, FileSpreadsheet, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface LaporanRAB {
  kode_kegiatan: string;
  nama_kegiatan: string;
  total_rab: number;
  total_dipesan: number;
  sisa_anggaran: number;
  persentase_realisasi: number;
  status: string;
}

interface LaporanRealisasi {
  supplier: string;
  kegiatan: string;
  total_pesanan: number;
  jumlah_pesanan: number;
  status_terakhir: string;
  tanggal_terakhir: string;
}

interface SisaKebutuhan {
  kode_kegiatan: string;
  nama_kegiatan: string;
  nama_item: string;
  jumlah_rab: number;
  jumlah_dipesan: number;
  sisa_kebutuhan: number;
  persentase_sisa: number;
  urgency: 'low' | 'medium' | 'high';
}

const mockLaporanRAB: LaporanRAB[] = [
  {
    kode_kegiatan: "KEG001",
    nama_kegiatan: "Pembangunan Jalan Desa",
    total_rab: 500000000,
    total_dipesan: 130000000,
    sisa_anggaran: 370000000,
    persentase_realisasi: 26,
    status: "active"
  },
  {
    kode_kegiatan: "KEG002", 
    nama_kegiatan: "Renovasi Balai Desa",
    total_rab: 200000000,
    total_dipesan: 45000000,
    sisa_anggaran: 155000000,
    persentase_realisasi: 22.5,
    status: "draft"
  }
];

const mockLaporanRealisasi: LaporanRealisasi[] = [
  {
    supplier: "PT Maju Konstruksi",
    kegiatan: "Pembangunan Jalan Desa",
    total_pesanan: 130000000,
    jumlah_pesanan: 2,
    status_terakhir: "approved",
    tanggal_terakhir: "2024-01-20"
  },
  {
    supplier: "CV Sumber Material",
    kegiatan: "Renovasi Balai Desa",
    total_pesanan: 45000000,
    jumlah_pesanan: 1,
    status_terakhir: "draft",
    tanggal_terakhir: "2024-02-01"
  }
];

const mockSisaKebutuhan: SisaKebutuhan[] = [
  {
    kode_kegiatan: "KEG001",
    nama_kegiatan: "Pembangunan Jalan Desa",
    nama_item: "Semen Portland 50kg",
    jumlah_rab: 1000,
    jumlah_dipesan: 500,
    sisa_kebutuhan: 500,
    persentase_sisa: 50,
    urgency: "high"
  },
  {
    kode_kegiatan: "KEG001",
    nama_kegiatan: "Pembangunan Jalan Desa", 
    nama_item: "Pasir Beton",
    jumlah_rab: 500,
    jumlah_dipesan: 200,
    sisa_kebutuhan: 300,
    persentase_sisa: 60,
    urgency: "medium"
  }
];

const urgencyColors = {
  low: "bg-success/20 text-success-foreground",
  medium: "bg-warning/20 text-warning-foreground",
  high: "bg-destructive/20 text-destructive-foreground"
};

const statusColors = {
  draft: "bg-warning/20 text-warning-foreground",
  active: "bg-success/20 text-success-foreground",
  approved: "bg-primary/20 text-primary-foreground"
};

// Additional data for enhanced reporting
const monthlyTrendData = [
  { month: 'Jan', totalRAB: 450000000, realisasi: 120000000, efficiency: 27 },
  { month: 'Feb', totalRAB: 650000000, realisasi: 180000000, efficiency: 28 },
  { month: 'Mar', totalRAB: 500000000, realisasi: 200000000, efficiency: 40 },
  { month: 'Apr', totalRAB: 750000000, realisasi: 250000000, efficiency: 33 },
  { month: 'Mei', totalRAB: 600000000, realisasi: 180000000, efficiency: 30 },
  { month: 'Jun', totalRAB: 800000000, realisasi: 320000000, efficiency: 40 },
];

const supplierPerformance = [
  { supplier: 'PT Maju Konstruksi', orders: 15, totalValue: 450000000, onTime: 87, rating: 4.5 },
  { supplier: 'CV Sumber Material', orders: 12, totalValue: 320000000, onTime: 92, rating: 4.7 },
  { supplier: 'UD Berkah Jaya', orders: 8, totalValue: 180000000, onTime: 75, rating: 4.2 },
];

export default function Laporan() {
  const [filterPeriode, setFilterPeriode] = useState("semua");
  const [filterKegiatan, setFilterKegiatan] = useState("semua");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateReport = (jenis: string) => {
    toast({
      title: "Menggenerate Laporan",
      description: `Sedang memproses laporan ${jenis}...`,
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Laporan Berhasil Digenerate",
        description: `Laporan ${jenis} siap didownload`,
      });
    }, 2000);
  };

  const handleExportData = (format: 'csv' | 'excel') => {
    toast({
      title: "Mengeksport Data",
      description: `Sedang memproses export ${format.toUpperCase()}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Berhasil",
        description: `Data berhasil diexport ke format ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const totalRAB = mockLaporanRAB.reduce((sum, item) => sum + item.total_rab, 0);
  const totalRealisasi = mockLaporanRAB.reduce((sum, item) => sum + item.total_dipesan, 0);
  const totalSisaAnggaran = mockLaporanRAB.reduce((sum, item) => sum + item.sisa_anggaran, 0);
  const avgRealisasi = mockLaporanRAB.reduce((sum, item) => sum + item.persentase_realisasi, 0) / mockLaporanRAB.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold tracking-tight">Laporan & Cetak</h2>
        <p className="text-muted-foreground">
          Generate laporan dan analisis data sistem
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 hover-scale">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalRAB)}</p>
                <p className="text-sm font-medium">Total RAB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-success/10 hover-scale">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalRealisasi)}</p>
                <p className="text-sm font-medium">Total Realisasi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-warning/10 hover-scale">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalSisaAnggaran)}</p>
                <p className="text-sm font-medium">Sisa Anggaran</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div>
              <p className="text-2xl font-bold">{avgRealisasi.toFixed(1)}%</p>
              <p className="text-sm font-medium">Rata-rata Realisasi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card className="animate-slide-in-right hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Trend Bulanan
            </CardTitle>
            <CardDescription>
              Analisis trend RAB dan realisasi bulanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Bulan ${label}`}
                />
                <Bar dataKey="totalRAB" fill="hsl(var(--chart-1))" name="Total RAB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realisasi" fill="hsl(var(--chart-2))" name="Realisasi" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Trend */}
        <Card className="animate-slide-in-right hover-lift" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Analisis Efisiensi
            </CardTitle>
            <CardDescription>
              Trend efisiensi penggunaan anggaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
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

      {/* Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Report Generator */}
        <Card className="animate-slide-up hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Laporan Bulanan
            </CardTitle>
            <CardDescription>
              Generate laporan periode bulanan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pilih Bulan</Label>
              <Select defaultValue="juni-2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="januari-2024">Januari 2024</SelectItem>
                  <SelectItem value="februari-2024">Februari 2024</SelectItem>
                  <SelectItem value="maret-2024">Maret 2024</SelectItem>
                  <SelectItem value="april-2024">April 2024</SelectItem>
                  <SelectItem value="mei-2024">Mei 2024</SelectItem>
                  <SelectItem value="juni-2024">Juni 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => handleGenerateReport("Bulanan")} 
              className="w-full hover-scale"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Laporan
            </Button>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-success" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export data ke berbagai format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => handleExportData('csv')}
                className="w-full hover-scale"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportData('excel')}
                className="w-full hover-scale"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="animate-slide-up hover-lift" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              Analisis Trend
            </CardTitle>
            <CardDescription>
              Insight dan prediksi trend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Trend Positif</span>
                <Badge className="bg-success/20 text-success-foreground">+12%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Efisiensi Q2</span>
                <Badge className="bg-primary/20 text-primary-foreground">Baik</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Prediksi Q3</span>
                <Badge className="bg-warning/20 text-warning-foreground">Stabil</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full hover-scale">
              <BarChart3 className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="animate-slide-up hover-lift" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
          <CardDescription>
            Pilih periode dan kegiatan untuk laporan yang lebih spesifik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Periode</Label>
              <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                <SelectTrigger className="hover-scale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Periode</SelectItem>
                  <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                  <SelectItem value="3_bulan">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kegiatan</Label>
              <Select value={filterKegiatan} onValueChange={setFilterKegiatan}>
                <SelectTrigger className="hover-scale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Kegiatan</SelectItem>
                  <SelectItem value="KEG001">KEG001 - Pembangunan Jalan Desa</SelectItem>
                  <SelectItem value="KEG002">KEG002 - Renovasi Balai Desa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterPeriode === "custom" && (
              <>
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="hover-scale"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Selesai</Label>
                  <Input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="hover-scale"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Reports */}
      <Tabs defaultValue="rab" className="space-y-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <TabsList className="hover-scale">
          <TabsTrigger value="rab" className="transition-smooth">Laporan RAB</TabsTrigger>
          <TabsTrigger value="realisasi" className="transition-smooth">Realisasi Pesanan</TabsTrigger>
          <TabsTrigger value="sisa" className="transition-smooth">Sisa Kebutuhan</TabsTrigger>
          <TabsTrigger value="supplier" className="transition-smooth">Performa Supplier</TabsTrigger>
        </TabsList>

        {/* RAB Report Tab */}
        <TabsContent value="rab" className="space-y-4">
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Laporan RAB Per Kegiatan
                  </CardTitle>
                  <CardDescription>
                    Ringkasan anggaran dan realisasi per kegiatan
                  </CardDescription>
                </div>
                <Button onClick={() => handleGenerateReport("RAB")} className="hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Kegiatan</TableHead>
                    <TableHead>Nama Kegiatan</TableHead>
                    <TableHead>Total RAB</TableHead>
                    <TableHead>Sudah Dipesan</TableHead>
                    <TableHead>Sisa Anggaran</TableHead>
                    <TableHead>Realisasi (%)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLaporanRAB.map((item, index) => (
                    <TableRow key={item.kode_kegiatan} className="hover-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <TableCell className="font-mono">{item.kode_kegiatan}</TableCell>
                      <TableCell className="font-medium">{item.nama_kegiatan}</TableCell>
                      <TableCell>{formatCurrency(item.total_rab)}</TableCell>
                      <TableCell>{formatCurrency(item.total_dipesan)}</TableCell>
                      <TableCell>{formatCurrency(item.sisa_anggaran)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-1000"
                              style={{ width: `${item.persentase_realisasi}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.persentase_realisasi}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Realisasi Report Tab */}
        <TabsContent value="realisasi" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Laporan Realisasi Pesanan
                  </CardTitle>
                  <CardDescription>
                    Realisasi pesanan per supplier dan kegiatan
                  </CardDescription>
                </div>
                <Button onClick={() => handleGenerateReport("Realisasi")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Total Pesanan</TableHead>
                    <TableHead>Jumlah Pesanan</TableHead>
                    <TableHead>Status Terakhir</TableHead>
                    <TableHead>Tanggal Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLaporanRealisasi.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.supplier}</TableCell>
                      <TableCell>{item.kegiatan}</TableCell>
                      <TableCell>{formatCurrency(item.total_pesanan)}</TableCell>
                      <TableCell>{item.jumlah_pesanan} pesanan</TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status_terakhir as keyof typeof statusColors]}>
                          {item.status_terakhir.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(item.tanggal_terakhir).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sisa Kebutuhan Tab */}
        <TabsContent value="sisa" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Rekap Sisa Kebutuhan
                  </CardTitle>
                  <CardDescription>
                    Monitoring item yang belum dipesan dan tingkat urgensi
                  </CardDescription>
                </div>
                <Button onClick={() => handleGenerateReport("Sisa Kebutuhan")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Jumlah RAB</TableHead>
                    <TableHead>Sudah Dipesan</TableHead>
                    <TableHead>Sisa Kebutuhan</TableHead>
                    <TableHead>Persentase Sisa</TableHead>
                    <TableHead>Tingkat Urgensi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSisaKebutuhan.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.nama_kegiatan}</p>
                          <p className="text-sm text-muted-foreground">{item.kode_kegiatan}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.nama_item}</TableCell>
                      <TableCell>{item.jumlah_rab}</TableCell>
                      <TableCell>{item.jumlah_dipesan}</TableCell>
                      <TableCell className="font-medium text-warning">{item.sisa_kebutuhan}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-warning rounded-full h-2"
                              style={{ width: `${item.persentase_sisa}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.persentase_sisa}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={urgencyColors[item.urgency]}>
                          {item.urgency.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Laporan Bulanan
            </CardTitle>
            <CardDescription>
              Generate laporan komprehensif bulanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleGenerateReport("Bulanan")}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Laporan
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Eksport Data
            </CardTitle>
            <CardDescription>
              Eksport semua data ke Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleGenerateReport("Excel Export")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analisis Trend
            </CardTitle>
            <CardDescription>
              Analisis trend penggunaan anggaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleGenerateReport("Analisis Trend")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Lihat Analisis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}