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
import { Plus, Search, Edit, Trash2, Calculator, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RABItem {
  id: number;
  nama_item: string;
  jumlah: number;
  satuan: string;
  harga_satuan: number;
  total: number;
}

interface RAB {
  id: number;
  kode_kegiatan: string;
  nama_kegiatan: string;
  tanggal_buat: string;
  status: 'draft' | 'approved' | 'active';
  total_anggaran: number;
  items: RABItem[];
  keterangan: string;
}

const mockRAB: RAB[] = [
  {
    id: 1,
    kode_kegiatan: "KEG001",
    nama_kegiatan: "Pembangunan Jalan Desa",
    tanggal_buat: "2024-01-15",
    status: "active",
    total_anggaran: 500000000,
    keterangan: "RAB untuk pembangunan jalan utama desa sepanjang 2 km",
    items: [
      {
        id: 1,
        nama_item: "Semen Portland 50kg",
        jumlah: 1000,
        satuan: "sak",
        harga_satuan: 65000,
        total: 65000000
      },
      {
        id: 2,
        nama_item: "Pasir Beton",
        jumlah: 500,
        satuan: "m3",
        harga_satuan: 150000,
        total: 75000000
      }
    ]
  },
  {
    id: 2,
    kode_kegiatan: "KEG002",
    nama_kegiatan: "Renovasi Balai Desa",
    tanggal_buat: "2024-02-01",
    status: "draft",
    total_anggaran: 200000000,
    keterangan: "RAB untuk renovasi balai desa",
    items: []
  }
];

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800"
};

export default function RAB() {
  const [rab, setRab] = useState<RAB[]>(mockRAB);
  const [selectedRAB, setSelectedRAB] = useState<RAB | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRABDialogOpen, setIsRABDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingRAB, setEditingRAB] = useState<RAB | null>(null);
  const [editingItem, setEditingItem] = useState<RABItem | null>(null);
  const { toast } = useToast();

  const [rabForm, setRabForm] = useState({
    kode_kegiatan: "",
    nama_kegiatan: "",
    keterangan: "",
    status: "draft" as 'draft' | 'approved' | 'active'
  });

  const [itemForm, setItemForm] = useState({
    nama_item: "",
    jumlah: 0,
    satuan: "",
    harga_satuan: 0
  });

  const filteredRAB = rab.filter(item =>
    item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode_kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRABSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRAB) {
      setRab(prev => prev.map(item => 
        item.id === editingRAB.id 
          ? { 
              ...item, 
              ...rabForm,
              total_anggaran: item.items.reduce((sum, rabItem) => sum + rabItem.total, 0)
            }
          : item
      ));
      toast({
        title: "RAB Diperbarui",
        description: "Data RAB berhasil diperbarui",
      });
    } else {
      const newRAB: RAB = {
        ...rabForm,
        id: Math.max(...rab.map(r => r.id)) + 1,
        tanggal_buat: new Date().toISOString().split('T')[0],
        total_anggaran: 0,
        items: []
      };
      setRab(prev => [...prev, newRAB]);
      toast({
        title: "RAB Dibuat",
        description: "RAB baru berhasil dibuat",
      });
    }
    
    resetRABForm();
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRAB) return;
    
    const total = itemForm.jumlah * itemForm.harga_satuan;
    
    if (editingItem) {
      setRab(prev => prev.map(rabItem => 
        rabItem.id === selectedRAB.id 
          ? {
              ...rabItem,
              items: rabItem.items.map(item => 
                item.id === editingItem.id 
                  ? { ...itemForm, id: editingItem.id, total }
                  : item
              ),
              total_anggaran: rabItem.items.reduce((sum, item) => 
                item.id === editingItem.id ? sum + total : sum + item.total, 0
              )
            }
          : rabItem
      ));
      toast({
        title: "Item RAB Diperbarui",
        description: "Item RAB berhasil diperbarui",
      });
    } else {
      const newItem: RABItem = {
        ...itemForm,
        id: Math.max(0, ...selectedRAB.items.map(item => item.id)) + 1,
        total
      };
      
      setRab(prev => prev.map(rabItem => 
        rabItem.id === selectedRAB.id 
          ? {
              ...rabItem,
              items: [...rabItem.items, newItem],
              total_anggaran: rabItem.total_anggaran + total
            }
          : rabItem
      ));
      
      toast({
        title: "Item RAB Ditambahkan",
        description: "Item baru berhasil ditambahkan ke RAB",
      });
    }
    
    resetItemForm();
  };

  const handleViewRAB = (rabData: RAB) => {
    setSelectedRAB(rabData);
    setIsViewDialogOpen(true);
  };

  const handleEditRAB = (rabData: RAB) => {
    setEditingRAB(rabData);
    setRabForm({
      kode_kegiatan: rabData.kode_kegiatan,
      nama_kegiatan: rabData.nama_kegiatan,
      keterangan: rabData.keterangan,
      status: rabData.status
    });
    setIsRABDialogOpen(true);
  };

  const handleDeleteRAB = (id: number) => {
    setRab(prev => prev.filter(item => item.id !== id));
    toast({
      title: "RAB Dihapus",
      description: "Data RAB berhasil dihapus",
    });
  };

  const handleEditItem = (item: RABItem) => {
    setEditingItem(item);
    setItemForm({
      nama_item: item.nama_item,
      jumlah: item.jumlah,
      satuan: item.satuan,
      harga_satuan: item.harga_satuan
    });
    setIsItemDialogOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    if (!selectedRAB) return;
    
    const itemToDelete = selectedRAB.items.find(item => item.id === itemId);
    if (!itemToDelete) return;
    
    setRab(prev => prev.map(rabItem => 
      rabItem.id === selectedRAB.id 
        ? {
            ...rabItem,
            items: rabItem.items.filter(item => item.id !== itemId),
            total_anggaran: rabItem.total_anggaran - itemToDelete.total
          }
        : rabItem
    ));
    
    // Update selected RAB for the view
    setSelectedRAB(prev => prev ? {
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      total_anggaran: prev.total_anggaran - itemToDelete.total
    } : null);
    
    toast({
      title: "Item Dihapus",
      description: "Item RAB berhasil dihapus",
    });
  };

  const resetRABForm = () => {
    setRabForm({
      kode_kegiatan: "",
      nama_kegiatan: "",
      keterangan: "",
      status: "draft"
    });
    setEditingRAB(null);
    setIsRABDialogOpen(false);
  };

  const resetItemForm = () => {
    setItemForm({
      nama_item: "",
      jumlah: 0,
      satuan: "",
      harga_satuan: 0
    });
    setEditingItem(null);
    setIsItemDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalRABActual = rab.reduce((sum, item) => sum + item.total_anggaran, 0);
  const rabStats = {
    total: rab.length,
    draft: rab.filter(r => r.status === 'draft').length,
    approved: rab.filter(r => r.status === 'approved').length,
    active: rab.filter(r => r.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">RAB Kegiatan</h2>
          <p className="text-muted-foreground">
            Kelola Rencana Anggaran Biaya untuk setiap kegiatan
          </p>
        </div>
        <Dialog open={isRABDialogOpen} onOpenChange={setIsRABDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => resetRABForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Buat RAB Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRAB ? "Edit RAB" : "Buat RAB Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi informasi dasar RAB kegiatan
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRABSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kode_kegiatan">Kode Kegiatan</Label>
                  <Input
                    id="kode_kegiatan"
                    value={rabForm.kode_kegiatan}
                    onChange={(e) => setRabForm(prev => ({ ...prev, kode_kegiatan: e.target.value }))}
                    placeholder="KEG001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={rabForm.status} onValueChange={(value: any) => setRabForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama_kegiatan">Nama Kegiatan</Label>
                <Input
                  id="nama_kegiatan"
                  value={rabForm.nama_kegiatan}
                  onChange={(e) => setRabForm(prev => ({ ...prev, nama_kegiatan: e.target.value }))}
                  placeholder="Nama kegiatan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={rabForm.keterangan}
                  onChange={(e) => setRabForm(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Deskripsi RAB"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetRABForm}>
                  Batal
                </Button>
                <Button type="submit" className="gradient-primary">
                  {editingRAB ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rabStats.total}</p>
                <p className="text-sm font-medium">Total RAB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-yellow-100">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rabStats.draft}</p>
                <p className="text-sm font-medium">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-green-100">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rabStats.active}</p>
                <p className="text-sm font-medium">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-lg font-bold">{formatCurrency(totalRABActual)}</p>
              <p className="text-sm font-medium">Total Anggaran</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian RAB
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari RAB berdasarkan nama kegiatan atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* RAB Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar RAB Kegiatan</CardTitle>
          <CardDescription>
            Total: {filteredRAB.length} RAB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Anggaran</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRAB.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.kode_kegiatan}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.nama_kegiatan}</p>
                      <p className="text-sm text-muted-foreground">{item.keterangan}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(item.tanggal_buat).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.total_anggaran)}
                  </TableCell>
                  <TableCell>{item.items.length} item(s)</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRAB(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRAB(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRAB(item.id)}
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

      {/* View RAB Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detail RAB: {selectedRAB?.nama_kegiatan}</DialogTitle>
            <DialogDescription>
              Kode: {selectedRAB?.kode_kegiatan} | Status: {selectedRAB?.status}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRAB && (
            <div className="space-y-6">
              {/* RAB Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Anggaran</Label>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedRAB.total_anggaran)}</p>
                </div>
                <div>
                  <Label>Jumlah Item</Label>
                  <p className="text-2xl font-bold">{selectedRAB.items.length}</p>
                </div>
              </div>

              {/* Add Item Button */}
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Item RAB</h4>
                <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetItemForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Item RAB" : "Tambah Item RAB"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleItemSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_item">Nama Item</Label>
                        <Input
                          id="nama_item"
                          value={itemForm.nama_item}
                          onChange={(e) => setItemForm(prev => ({ ...prev, nama_item: e.target.value }))}
                          placeholder="Nama material/item"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jumlah">Jumlah</Label>
                          <Input
                            id="jumlah"
                            type="number"
                            value={itemForm.jumlah}
                            onChange={(e) => setItemForm(prev => ({ ...prev, jumlah: Number(e.target.value) }))}
                            placeholder="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="satuan">Satuan</Label>
                          <Input
                            id="satuan"
                            value={itemForm.satuan}
                            onChange={(e) => setItemForm(prev => ({ ...prev, satuan: e.target.value }))}
                            placeholder="kg, m3, unit, dll"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="harga_satuan">Harga Satuan (Rp)</Label>
                        <Input
                          id="harga_satuan"
                          type="number"
                          value={itemForm.harga_satuan}
                          onChange={(e) => setItemForm(prev => ({ ...prev, harga_satuan: Number(e.target.value) }))}
                          placeholder="0"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <p className="text-lg font-semibold text-primary">
                          {formatCurrency(itemForm.jumlah * itemForm.harga_satuan)}
                        </p>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={resetItemForm}>
                          Batal
                        </Button>
                        <Button type="submit" className="gradient-primary">
                          {editingItem ? "Perbarui" : "Tambah"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRAB.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama_item}</TableCell>
                      <TableCell>{item.jumlah}</TableCell>
                      <TableCell>{item.satuan}</TableCell>
                      <TableCell>{formatCurrency(item.harga_satuan)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedRAB.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Belum ada item RAB. Klik "Tambah Item" untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}