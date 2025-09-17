import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Kegiatan {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string;
  pelaksana: string;
  status: 'draft' | 'aktif' | 'selesai';
  tanggal_mulai: string;
  tanggal_selesai: string;
  anggaran: number;
}

const mockKegiatan: Kegiatan[] = [
  {
    id: 1,
    kode: "KEG001",
    nama: "Pembangunan Jalan Desa",
    deskripsi: "Pembangunan jalan utama desa sepanjang 2 km",
    pelaksana: "Tim Infrastruktur",
    status: "aktif",
    tanggal_mulai: "2024-01-15",
    tanggal_selesai: "2024-06-30",
    anggaran: 500000000
  },
  {
    id: 2,
    kode: "KEG002", 
    nama: "Renovasi Balai Desa",
    deskripsi: "Perbaikan dan renovasi balai desa untuk pelayanan masyarakat",
    pelaksana: "Tim Pembangunan",
    status: "draft",
    tanggal_mulai: "2024-03-01",
    tanggal_selesai: "2024-08-30",
    anggaran: 200000000
  }
];

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800",
  aktif: "bg-green-100 text-green-800", 
  selesai: "bg-blue-100 text-blue-800"
};

export default function Kegiatan() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>(mockKegiatan);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    kode: string;
    nama: string;
    deskripsi: string;
    pelaksana: string;
    status: 'draft' | 'aktif' | 'selesai';
    tanggal_mulai: string;
    tanggal_selesai: string;
    anggaran: number;
  }>({
    kode: "",
    nama: "",
    deskripsi: "",
    pelaksana: "",
    status: "draft",
    tanggal_mulai: "",
    tanggal_selesai: "",
    anggaran: 0
  });

  const filteredKegiatan = kegiatan.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pelaksana.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingKegiatan) {
      setKegiatan(prev => prev.map(item => 
        item.id === editingKegiatan.id 
          ? { ...formData, id: editingKegiatan.id }
          : item
      ));
      toast({
        title: "Kegiatan Diperbarui",
        description: "Data kegiatan berhasil diperbarui",
      });
    } else {
      const newKegiatan = {
        ...formData,
        id: Math.max(...kegiatan.map(k => k.id)) + 1
      };
      setKegiatan(prev => [...prev, newKegiatan]);
      toast({
        title: "Kegiatan Ditambahkan",
        description: "Kegiatan baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: Kegiatan) => {
    setEditingKegiatan(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      deskripsi: item.deskripsi,
      pelaksana: item.pelaksana,
      status: item.status,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai,
      anggaran: item.anggaran
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setKegiatan(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Kegiatan Dihapus",
      description: "Data kegiatan berhasil dihapus",
    });
  };

  const resetForm = () => {
    setFormData({
      kode: "",
      nama: "",
      deskripsi: "",
      pelaksana: "",
      status: "draft",
      tanggal_mulai: "",
      tanggal_selesai: "",
      anggaran: 0
    });
    setEditingKegiatan(null);
    setIsDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Master Data Kegiatan</h2>
          <p className="text-muted-foreground">
            Kelola data kegiatan dan assign pelaksana
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingKegiatan ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi form untuk {editingKegiatan ? "memperbarui" : "menambahkan"} data kegiatan
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kode">Kode Kegiatan</Label>
                  <Input
                    id="kode"
                    value={formData.kode}
                    onChange={(e) => setFormData(prev => ({ ...prev, kode: e.target.value }))}
                    placeholder="KEG001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Kegiatan</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Masukkan nama kegiatan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                  placeholder="Deskripsi detail kegiatan"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pelaksana">Pelaksana</Label>
                <Input
                  id="pelaksana"
                  value={formData.pelaksana}
                  onChange={(e) => setFormData(prev => ({ ...prev, pelaksana: e.target.value }))}
                  placeholder="Tim atau nama pelaksana"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                  <Input
                    id="tanggal_mulai"
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggal_mulai: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                  <Input
                    id="tanggal_selesai"
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggal_selesai: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anggaran">Anggaran (Rp)</Label>
                <Input
                  id="anggaran"
                  type="number"
                  value={formData.anggaran}
                  onChange={(e) => setFormData(prev => ({ ...prev, anggaran: Number(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit" className="gradient-primary">
                  {editingKegiatan ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari kegiatan, kode, atau pelaksana..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daftar Kegiatan
          </CardTitle>
          <CardDescription>
            Total: {filteredKegiatan.length} kegiatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Pelaksana</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Anggaran</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKegiatan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.kode}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.nama}</p>
                      <p className="text-sm text-muted-foreground">{item.deskripsi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {item.pelaksana}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')} - 
                    {new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.anggaran)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}