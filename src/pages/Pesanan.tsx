import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2, ShoppingCart, FileText, Download, Eye, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PesananItem {
  id: number;
  nama_item: string;
  jumlah_rab: number;
  jumlah_dipesan: number;
  sisa_kebutuhan: number;
  harga_satuan: number;
  total: number;
  satuan: string;
}

interface RABItem {
  id: number;
  nama_item: string;
  jumlah: number;
  satuan: string;
  harga_satuan: number;
  total: number;
  sisa_kebutuhan: number;
}

interface SuratPesanan {
  id: number;
  nomor_surat: string;
  tanggal_surat: string;
  kode_kegiatan: string;
  nama_kegiatan: string;
  supplier_id: string;
  nama_supplier: string;
  status: 'draft' | 'sent' | 'approved' | 'delivered';
  total_pesanan: number;
  items: PesananItem[];
  keterangan: string;
}

const mockRABData: { [key: string]: RABItem[] } = {
  'KEG001': [
    {
      id: 1,
      nama_item: "Semen Portland 50kg",
      jumlah: 1000,
      satuan: "sak",
      harga_satuan: 65000,
      total: 65000000,
      sisa_kebutuhan: 500
    },
    {
      id: 2,
      nama_item: "Pasir Beton",
      jumlah: 500,
      satuan: "m3",
      harga_satuan: 150000,
      total: 75000000,
      sisa_kebutuhan: 300
    },
    {
      id: 3,
      nama_item: "Kerikil",
      jumlah: 300,
      satuan: "m3",
      harga_satuan: 180000,
      total: 54000000,
      sisa_kebutuhan: 300
    },
    {
      id: 4,
      nama_item: "Besi Beton 12mm",
      jumlah: 200,
      satuan: "batang",
      harga_satuan: 85000,
      total: 17000000,
      sisa_kebutuhan: 200
    }
  ],
  'KEG002': [
    {
      id: 5,
      nama_item: "Cat Tembok",
      jumlah: 100,
      satuan: "kaleng",
      harga_satuan: 75000,
      total: 7500000,
      sisa_kebutuhan: 100
    },
    {
      id: 6,
      nama_item: "Genteng Keramik",
      jumlah: 500,
      satuan: "buah",
      harga_satuan: 15000,
      total: 7500000,
      sisa_kebutuhan: 500
    }
  ]
};

const mockPesanan: SuratPesanan[] = [
  {
    id: 1,
    nomor_surat: "SP/001/2024",
    tanggal_surat: "2024-01-20",
    kode_kegiatan: "KEG001",
    nama_kegiatan: "Pembangunan Jalan Desa",
    supplier_id: "SUP001",
    nama_supplier: "PT Maju Konstruksi",
    status: "approved",
    total_pesanan: 130000000,
    keterangan: "Surat pesanan material untuk fase 1",
    items: [
      {
        id: 1,
        nama_item: "Semen Portland 50kg",
        jumlah_rab: 1000,
        jumlah_dipesan: 500,
        sisa_kebutuhan: 500,
        harga_satuan: 65000,
        total: 32500000,
        satuan: "sak"
      },
      {
        id: 2,
        nama_item: "Pasir Beton",
        jumlah_rab: 500,
        jumlah_dipesan: 200,
        sisa_kebutuhan: 300,
        harga_satuan: 150000,
        total: 30000000,
        satuan: "m3"
      }
    ]
  },
  {
    id: 2,
    nomor_surat: "SP/002/2024",
    tanggal_surat: "2024-02-01",
    kode_kegiatan: "KEG002",
    nama_kegiatan: "Renovasi Balai Desa",
    supplier_id: "SUP002",
    nama_supplier: "CV Sumber Material",
    status: "draft",
    total_pesanan: 45000000,
    keterangan: "Surat pesanan material renovasi",
    items: []
  }
];

const mockRABOptions = [
  { kode: "KEG001", nama: "Pembangunan Jalan Desa" },
  { kode: "KEG002", nama: "Renovasi Balai Desa" }
];

const mockSupplierOptions = [
  { id: "SUP001", nama: "PT Maju Konstruksi" },
  { id: "SUP002", nama: "CV Sumber Material" }
];

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  delivered: "bg-purple-100 text-purple-800"
};

export default function Pesanan() {
  const [pesanan, setPesanan] = useState<SuratPesanan[]>(mockPesanan);
  const [selectedPesanan, setSelectedPesanan] = useState<SuratPesanan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPesananDialogOpen, setIsPesananDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingPesanan, setEditingPesanan] = useState<SuratPesanan | null>(null);
  const [isItemSelectionOpen, setIsItemSelectionOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: { selected: boolean; jumlah: number; harga: number } }>({});
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [previewPesanan, setPreviewPesanan] = useState<SuratPesanan | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [pesananForm, setPesananForm] = useState({
    nomor_surat: "",
    kode_kegiatan: "",
    nama_kegiatan: "",
    supplier_id: "",
    nama_supplier: "",
    keterangan: "",
    status: "draft" as 'draft' | 'sent' | 'approved' | 'delivered'
  });

  const filteredPesanan = pesanan.filter(item =>
    item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama_supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePesananSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPesanan) {
      setPesanan(prev => prev.map(item => 
        item.id === editingPesanan.id 
          ? { 
              ...item, 
              ...pesananForm,
              total_pesanan: item.items.reduce((sum, pesananItem) => sum + pesananItem.total, 0)
            }
          : item
      ));
      toast({
        title: "Surat Pesanan Diperbarui",
        description: "Data surat pesanan berhasil diperbarui",
      });
    } else {
      const newPesanan: SuratPesanan = {
        ...pesananForm,
        id: Math.max(...pesanan.map(p => p.id)) + 1,
        tanggal_surat: new Date().toISOString().split('T')[0],
        total_pesanan: 0,
        items: []
      };
      setPesanan(prev => [...prev, newPesanan]);
      toast({
        title: "Surat Pesanan Dibuat",
        description: "Surat pesanan baru berhasil dibuat",
      });
    }
    
    resetPesananForm();
  };

  const handleViewPesanan = (pesananData: SuratPesanan) => {
    setSelectedPesanan(pesananData);
    setIsViewDialogOpen(true);
  };

  const handleEditPesanan = (pesananData: SuratPesanan) => {
    setEditingPesanan(pesananData);
    setPesananForm({
      nomor_surat: pesananData.nomor_surat,
      kode_kegiatan: pesananData.kode_kegiatan,
      nama_kegiatan: pesananData.nama_kegiatan,
      supplier_id: pesananData.supplier_id,
      nama_supplier: pesananData.nama_supplier,
      keterangan: pesananData.keterangan,
      status: pesananData.status
    });
    setIsPesananDialogOpen(true);
  };

  const handleDeletePesanan = (id: number) => {
    setPesanan(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Surat Pesanan Dihapus",
      description: "Data surat pesanan berhasil dihapus",
    });
  };

  const handleCetakPesanan = (pesananData: SuratPesanan) => {
    toast({
      title: "Mencetak Surat Pesanan",
      description: `Mencetak surat pesanan ${pesananData.nomor_surat}`,
    });
    // Here you would implement PDF generation logic
  };

  const handleKegiatanChange = (kodeKegiatan: string) => {
    const kegiatan = mockRABOptions.find(rab => rab.kode === kodeKegiatan);
    setPesananForm(prev => ({
      ...prev,
      kode_kegiatan: kodeKegiatan,
      nama_kegiatan: kegiatan?.nama || ""
    }));
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSupplierOptions.find(sup => sup.id === supplierId);
    setPesananForm(prev => ({
      ...prev,
      supplier_id: supplierId,
      nama_supplier: supplier?.nama || ""
    }));
  };

  const resetPesananForm = () => {
    setPesananForm({
      nomor_surat: "",
      kode_kegiatan: "",
      nama_kegiatan: "",
      supplier_id: "",
      nama_supplier: "",
      keterangan: "",
      status: "draft"
    });
    setEditingPesanan(null);
    setIsPesananDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleOpenItemSelection = () => {
    if (!pesananForm.kode_kegiatan) {
      toast({
        title: "Pilih Kegiatan",
        description: "Silakan pilih kegiatan terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    setSelectedItems({});
    setIsItemSelectionOpen(true);
  };

  const handleItemSelection = (item: RABItem, selected: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.id]: {
        selected,
        jumlah: selected ? 1 : 0,
        harga: item.harga_satuan
      }
    }));
  };

  const handleItemQuantityChange = (itemId: number, jumlah: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        jumlah
      }
    }));
  };

  const handleItemPriceChange = (itemId: number, harga: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        harga
      }
    }));
  };

  const handleConfirmItemSelection = () => {
    const rabItems = mockRABData[pesananForm.kode_kegiatan] || [];
    const pesananItems: PesananItem[] = rabItems
      .filter(item => selectedItems[item.id]?.selected)
      .map(item => ({
        id: item.id,
        nama_item: item.nama_item,
        jumlah_rab: item.jumlah,
        jumlah_dipesan: selectedItems[item.id].jumlah,
        sisa_kebutuhan: item.sisa_kebutuhan - selectedItems[item.id].jumlah,
        harga_satuan: selectedItems[item.id].harga,
        total: selectedItems[item.id].jumlah * selectedItems[item.id].harga,
        satuan: item.satuan
      }));

    const totalPesanan = pesananItems.reduce((sum, item) => sum + item.total, 0);

    if (editingPesanan) {
      setPesanan(prev => prev.map(p => 
        p.id === editingPesanan.id 
          ? { ...p, items: pesananItems, total_pesanan: totalPesanan }
          : p
      ));
    } else {
      const newPesanan: SuratPesanan = {
        ...pesananForm,
        id: Math.max(...pesanan.map(p => p.id)) + 1,
        tanggal_surat: new Date().toISOString().split('T')[0],
        total_pesanan: totalPesanan,
        items: pesananItems
      };
      setPesanan(prev => [...prev, newPesanan]);
    }

    setIsItemSelectionOpen(false);
    setIsPesananDialogOpen(false);
    resetPesananForm();
    
    toast({
      title: editingPesanan ? "Pesanan Diperbarui" : "Pesanan Dibuat",
      description: `Pesanan dengan ${pesananItems.length} item berhasil ${editingPesanan ? 'diperbarui' : 'dibuat'}`,
    });
  };

  const handlePrintPreview = (pesananData: SuratPesanan) => {
    setPreviewPesanan(pesananData);
    setIsPrintPreviewOpen(true);
  };

  const handlePrintToPDF = async () => {
    if (!printRef.current || !previewPesanan) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Surat_Pesanan_${previewPesanan.nomor_surat.replace(/\//g, '_')}.pdf`);
      
      toast({
        title: "PDF Berhasil Dibuat",
        description: "Surat pesanan telah disimpan dalam format PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat PDF",
        variant: "destructive"
      });
    }
  };

  const totalPesananActual = pesanan.reduce((sum, item) => sum + item.total_pesanan, 0);
  const pesananStats = {
    total: pesanan.length,
    draft: pesanan.filter(p => p.status === 'draft').length,
    sent: pesanan.filter(p => p.status === 'sent').length,
    approved: pesanan.filter(p => p.status === 'approved').length,
    delivered: pesanan.filter(p => p.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surat Pesanan</h2>
          <p className="text-muted-foreground">
            Kelola surat pesanan berdasarkan RAB kegiatan
          </p>
        </div>
        <Dialog open={isPesananDialogOpen} onOpenChange={setIsPesananDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" onClick={() => resetPesananForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Surat Pesanan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPesanan ? "Edit Surat Pesanan" : "Buat Surat Pesanan Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi informasi surat pesanan
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePesananSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomor_surat">Nomor Surat</Label>
                  <Input
                    id="nomor_surat"
                    value={pesananForm.nomor_surat}
                    onChange={(e) => setPesananForm(prev => ({ ...prev, nomor_surat: e.target.value }))}
                    placeholder="SP/001/2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={pesananForm.status} onValueChange={(value: any) => setPesananForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Terkirim</SelectItem>
                      <SelectItem value="approved">Disetujui</SelectItem>
                      <SelectItem value="delivered">Diterima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kode_kegiatan">Kegiatan</Label>
                <Select value={pesananForm.kode_kegiatan} onValueChange={handleKegiatanChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kegiatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRABOptions.map((rab) => (
                      <SelectItem key={rab.kode} value={rab.kode}>
                        {rab.kode} - {rab.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_id">Supplier</Label>
                <Select value={pesananForm.supplier_id} onValueChange={handleSupplierChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSupplierOptions.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={pesananForm.keterangan}
                  onChange={(e) => setPesananForm(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Catatan tambahan untuk surat pesanan"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetPesananForm}>
                  Batal
                </Button>
                <Button type="button" variant="outline" onClick={handleOpenItemSelection}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Pilih Item
                </Button>
                <Button type="submit" className="gradient-primary">
                  {editingPesanan ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pesananStats.total}</p>
                <p className="text-sm font-medium">Total Pesanan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-2xl font-bold">{pesananStats.draft}</p>
              <p className="text-sm font-medium">Draft</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-2xl font-bold">{pesananStats.approved}</p>
              <p className="text-sm font-medium">Disetujui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-2xl font-bold">{pesananStats.delivered}</p>
              <p className="text-sm font-medium">Selesai</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-lg font-bold">{formatCurrency(totalPesananActual)}</p>
              <p className="text-sm font-medium">Total Nilai</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian Surat Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari berdasarkan nomor surat, kegiatan, atau supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Pesanan Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Surat Pesanan</CardTitle>
          <CardDescription>
            Total: {filteredPesanan.length} surat pesanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kegiatan</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Nilai</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPesanan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.nomor_surat}</TableCell>
                  <TableCell>{new Date(item.tanggal_surat).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.nama_kegiatan}</p>
                      <p className="text-sm text-muted-foreground">{item.kode_kegiatan}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.nama_supplier}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.total_pesanan)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPesanan(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPesanan(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintPreview(item)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePesanan(item.id)}
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

      {/* View Pesanan Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detail Surat Pesanan: {selectedPesanan?.nomor_surat}</DialogTitle>
            <DialogDescription>
              Kegiatan: {selectedPesanan?.nama_kegiatan} | Supplier: {selectedPesanan?.nama_supplier}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPesanan && (
            <div className="space-y-6">
              {/* Pesanan Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Total Nilai Pesanan</Label>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedPesanan.total_pesanan)}</p>
                </div>
                <div>
                  <Label>Jumlah Item</Label>
                  <p className="text-2xl font-bold">{selectedPesanan.items.length}</p>
                </div>
                <div>
                  <Label>Status</Label>
                      <Badge className={statusColors[selectedPesanan.status]}>
                        {selectedPesanan.status.toUpperCase()}
                      </Badge>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Item Pesanan</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Item</TableHead>
                      <TableHead>Jumlah RAB</TableHead>
                      <TableHead>Jumlah Dipesan</TableHead>
                      <TableHead>Sisa Kebutuhan</TableHead>
                      <TableHead>Harga Satuan</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPesanan.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.nama_item}
                          <div className="text-sm text-muted-foreground">({item.satuan})</div>
                        </TableCell>
                        <TableCell>{item.jumlah_rab}</TableCell>
                        <TableCell className="font-medium text-primary">{item.jumlah_dipesan}</TableCell>
                        <TableCell>{item.sisa_kebutuhan}</TableCell>
                        <TableCell>{formatCurrency(item.harga_satuan)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    {selectedPesanan.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Belum ada item pesanan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button className="gradient-primary" onClick={() => handleCetakPesanan(selectedPesanan)}>
                  <Download className="h-4 w-4 mr-2" />
                  Cetak PDF
                </Button>
                <Button variant="outline" onClick={() => handleEditPesanan(selectedPesanan)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pesanan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Item Selection Dialog */}
      <Dialog open={isItemSelectionOpen} onOpenChange={setIsItemSelectionOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Pilih Item dari RAB</DialogTitle>
            <DialogDescription>
              Pilih item yang akan dipesan untuk kegiatan: {pesananForm.nama_kegiatan}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pilih</TableHead>
                  <TableHead>Nama Item</TableHead>
                  <TableHead>Jumlah RAB</TableHead>
                  <TableHead>Sisa Kebutuhan</TableHead>
                  <TableHead>Harga Satuan</TableHead>
                  <TableHead>Jumlah Pesan</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(mockRABData[pesananForm.kode_kegiatan] || []).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems[item.id]?.selected || false}
                        onCheckedChange={(checked) => handleItemSelection(item, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.nama_item}
                      <div className="text-sm text-muted-foreground">({item.satuan})</div>
                    </TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{item.sisa_kebutuhan}</TableCell>
                    <TableCell>{formatCurrency(item.harga_satuan)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        max={item.sisa_kebutuhan}
                        value={selectedItems[item.id]?.jumlah || 1}
                        onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        disabled={!selectedItems[item.id]?.selected}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={selectedItems[item.id]?.harga || item.harga_satuan}
                        onChange={(e) => handleItemPriceChange(item.id, parseInt(e.target.value) || item.harga_satuan)}
                        disabled={!selectedItems[item.id]?.selected}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {selectedItems[item.id]?.selected ? 
                        formatCurrency((selectedItems[item.id]?.jumlah || 1) * (selectedItems[item.id]?.harga || item.harga_satuan))
                        : formatCurrency(0)
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Item Dipilih: {Object.values(selectedItems).filter(item => item.selected).length}
                </p>
                <p className="text-lg font-bold">
                  Total Nilai: {formatCurrency(
                    Object.entries(selectedItems)
                      .filter(([_, item]) => item.selected)
                      .reduce((sum, [_, item]) => sum + (item.jumlah * item.harga), 0)
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsItemSelectionOpen(false)}>
                  Batal
                </Button>
                <Button 
                  className="gradient-primary" 
                  onClick={handleConfirmItemSelection}
                  disabled={Object.values(selectedItems).filter(item => item.selected).length === 0}
                >
                  Konfirmasi Pilihan
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview Surat Pesanan</DialogTitle>
            <DialogDescription>
              Preview dokumen yang akan dicetak
            </DialogDescription>
          </DialogHeader>
          
          <div ref={printRef} className="bg-white p-8 text-black">
            {previewPesanan && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold">SURAT PESANAN</h1>
                  <p className="text-lg">{previewPesanan.nomor_surat}</p>
                </div>

                {/* Info Pesanan */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informasi Kegiatan:</h3>
                    <p><strong>Kode:</strong> {previewPesanan.kode_kegiatan}</p>
                    <p><strong>Nama:</strong> {previewPesanan.nama_kegiatan}</p>
                    <p><strong>Tanggal:</strong> {new Date(previewPesanan.tanggal_surat).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Informasi Supplier:</h3>
                    <p><strong>Nama:</strong> {previewPesanan.nama_supplier}</p>
                    <p><strong>Status:</strong> {previewPesanan.status.toUpperCase()}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="font-semibold mb-2">Detail Item Pesanan:</h3>
                  <table className="w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-left">No</th>
                        <th className="border border-black p-2 text-left">Nama Item</th>
                        <th className="border border-black p-2 text-center">Jumlah</th>
                        <th className="border border-black p-2 text-center">Satuan</th>
                        <th className="border border-black p-2 text-right">Harga Satuan</th>
                        <th className="border border-black p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewPesanan.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-black p-2">{index + 1}</td>
                          <td className="border border-black p-2">{item.nama_item}</td>
                          <td className="border border-black p-2 text-center">{item.jumlah_dipesan}</td>
                          <td className="border border-black p-2 text-center">{item.satuan}</td>
                          <td className="border border-black p-2 text-right">{formatCurrency(item.harga_satuan)}</td>
                          <td className="border border-black p-2 text-right">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={5} className="border border-black p-2 text-right">TOTAL:</td>
                        <td className="border border-black p-2 text-right">{formatCurrency(previewPesanan.total_pesanan)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Keterangan */}
                {previewPesanan.keterangan && (
                  <div>
                    <h3 className="font-semibold mb-2">Keterangan:</h3>
                    <p>{previewPesanan.keterangan}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <p>Pemesan,</p>
                    <div className="mt-16">
                      <p className="border-t border-black inline-block px-8">Kepala Desa</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p>Supplier,</p>
                    <div className="mt-16">
                      <p className="border-t border-black inline-block px-8">{previewPesanan.nama_supplier}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>
              Tutup
            </Button>
            <Button className="gradient-primary" onClick={handlePrintToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}