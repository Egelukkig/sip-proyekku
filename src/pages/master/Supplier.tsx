import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: number;
  kode: string;
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  kontak_person: string;
  status: 'aktif' | 'nonaktif';
  kategori: string;
}

const mockSupplier: Supplier[] = [
  {
    id: 1,
    kode: "SUP001",
    nama: "PT Maju Konstruksi",
    alamat: "Jl. Pembangunan No. 45, Jakarta Selatan",
    telepon: "021-7654321",
    email: "info@majukonstruksi.co.id",
    kontak_person: "Budi Santoso",
    status: "aktif",
    kategori: "Konstruksi"
  },
  {
    id: 2,
    kode: "SUP002",
    nama: "CV Sumber Material",
    alamat: "Jl. Industri No. 12, Bekasi",
    telepon: "021-8765432",
    email: "sales@sumbermaterial.com",
    kontak_person: "Siti Nurhaliza",
    status: "aktif",
    kategori: "Material"
  }
];

export default function Supplier() {
  const [supplier, setSupplier] = useState<Supplier[]>(mockSupplier);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    kode: string;
    nama: string;
    alamat: string;
    telepon: string;
    email: string;
    kontak_person: string;
    status: 'aktif' | 'nonaktif';
    kategori: string;
  }>({
    kode: "",
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
    kontak_person: "",
    status: "aktif",
    kategori: ""
  });

  const filteredSupplier = supplier.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      setSupplier(prev => prev.map(item => 
        item.id === editingSupplier.id 
          ? { ...formData, id: editingSupplier.id }
          : item
      ));
      toast({
        title: "Supplier Diperbarui",
        description: "Data supplier berhasil diperbarui",
      });
    } else {
      const newSupplier = {
        ...formData,
        id: Math.max(...supplier.map(s => s.id)) + 1
      };
      setSupplier(prev => [...prev, newSupplier]);
      toast({
        title: "Supplier Ditambahkan",
        description: "Supplier baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: Supplier) => {
    setEditingSupplier(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      alamat: item.alamat,
      telepon: item.telepon,
      email: item.email,
      kontak_person: item.kontak_person,
      status: item.status,
      kategori: item.kategori
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSupplier(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Supplier Dihapus",
      description: "Data supplier berhasil dihapus",
    });
  };

  const resetForm = () => {
    setFormData({
      kode: "",
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      kontak_person: "",
      status: "aktif",
      kategori: ""
    });
    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Master Data Supplier</h2>
          <p className="text-muted-foreground">
            Kelola data supplier dan vendor
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Edit Supplier" : "Tambah Supplier Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi form untuk {editingSupplier ? "memperbarui" : "menambahkan"} data supplier
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kode">Kode Supplier</Label>
                  <Input
                    id="kode"
                    value={formData.kode}
                    onChange={(e) => setFormData(prev => ({ ...prev, kode: e.target.value }))}
                    placeholder="SUP001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'aktif' | 'nonaktif' }))}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Supplier</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="PT/CV Nama Supplier"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input
                  id="kategori"
                  value={formData.kategori}
                  onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
                  placeholder="Konstruksi, Material, Jasa, dll"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                  placeholder="Alamat lengkap supplier"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telepon">Telepon</Label>
                  <Input
                    id="telepon"
                    value={formData.telepon}
                    onChange={(e) => setFormData(prev => ({ ...prev, telepon: e.target.value }))}
                    placeholder="021-1234567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@supplier.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kontak_person">Kontak Person</Label>
                <Input
                  id="kontak_person"
                  value={formData.kontak_person}
                  onChange={(e) => setFormData(prev => ({ ...prev, kontak_person: e.target.value }))}
                  placeholder="Nama kontak person"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit" className="gradient-primary">
                  {editingSupplier ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari supplier, kode, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Daftar Supplier
          </CardTitle>
          <CardDescription>
            Total: {filteredSupplier.length} supplier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Supplier</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupplier.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.kode}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.nama}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-xs">{item.alamat}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.kategori}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {item.telepon}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {item.email}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.kontak_person}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {item.status.toUpperCase()}
                    </Badge>
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