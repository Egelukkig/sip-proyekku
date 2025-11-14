import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, UserPlus, ClipboardCheck, Edit, Trash2, CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Worker {
  id: string;
  name: string;
  position: string;
  phone: string;
  joinDate: Date;
  status: "active" | "inactive";
}

interface Attendance {
  id: string;
  workerId: string;
  date: Date;
  status: "hadir" | "izin" | "sakit" | "alpha";
  notes?: string;
}

export default function Pekerja() {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "1",
      name: "Ahmad Supardi",
      position: "Kepala Tukang",
      phone: "081234567890",
      joinDate: new Date(2024, 0, 15),
      status: "active"
    },
    {
      id: "2",
      name: "Budi Santoso",
      position: "Tukang Bangunan",
      phone: "081234567891",
      joinDate: new Date(2024, 1, 1),
      status: "active"
    }
  ]);

  const [attendances, setAttendances] = useState<Attendance[]>([
    {
      id: "1",
      workerId: "1",
      date: new Date(),
      status: "hadir",
      notes: ""
    },
    {
      id: "2",
      workerId: "2",
      date: new Date(),
      status: "hadir",
      notes: ""
    }
  ]);

  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [workerForm, setWorkerForm] = useState({
    name: "",
    position: "",
    phone: "",
    status: "active" as "active" | "inactive"
  });

  const handleAddWorker = () => {
    if (!workerForm.name || !workerForm.position) {
      toast.error("Nama dan posisi harus diisi");
      return;
    }

    const newWorker: Worker = {
      id: Date.now().toString(),
      ...workerForm,
      joinDate: new Date()
    };

    setWorkers([...workers, newWorker]);
    setWorkerForm({ name: "", position: "", phone: "", status: "active" });
    setIsAddWorkerOpen(false);
    toast.success("Pekerja berhasil ditambahkan");
  };

  const handleEditWorker = () => {
    if (!editingWorker || !workerForm.name || !workerForm.position) {
      toast.error("Nama dan posisi harus diisi");
      return;
    }

    setWorkers(workers.map(w => 
      w.id === editingWorker.id 
        ? { ...w, ...workerForm }
        : w
    ));
    setEditingWorker(null);
    setWorkerForm({ name: "", position: "", phone: "", status: "active" });
    toast.success("Data pekerja berhasil diperbarui");
  };

  const handleDeleteWorker = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
    setAttendances(attendances.filter(a => a.workerId !== id));
    toast.success("Pekerja berhasil dihapus");
  };

  const openEditDialog = (worker: Worker) => {
    setEditingWorker(worker);
    setWorkerForm({
      name: worker.name,
      position: worker.position,
      phone: worker.phone,
      status: worker.status
    });
  };

  const handleAttendance = (workerId: string, status: "hadir" | "izin" | "sakit" | "alpha") => {
    const existingAttendance = attendances.find(
      a => a.workerId === workerId && 
      format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    if (existingAttendance) {
      setAttendances(attendances.map(a =>
        a.id === existingAttendance.id
          ? { ...a, status }
          : a
      ));
    } else {
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        workerId,
        date: selectedDate,
        status,
        notes: ""
      };
      setAttendances([...attendances, newAttendance]);
    }
    toast.success("Absensi berhasil dicatat");
  };

  const getAttendanceStatus = (workerId: string) => {
    return attendances.find(
      a => a.workerId === workerId && 
      format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
  };

  const getAttendanceStats = () => {
    const todayAttendances = attendances.filter(
      a => format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
    
    return {
      hadir: todayAttendances.filter(a => a.status === "hadir").length,
      izin: todayAttendances.filter(a => a.status === "izin").length,
      sakit: todayAttendances.filter(a => a.status === "sakit").length,
      alpha: todayAttendances.filter(a => a.status === "alpha").length,
      total: workers.filter(w => w.status === "active").length
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pekerja</h2>
        <p className="text-muted-foreground">
          Kelola data pekerja dan absensi harian
        </p>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Data Pekerja
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Absensi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Daftar Pekerja
                  </CardTitle>
                  <CardDescription>
                    Total {workers.length} pekerja ({workers.filter(w => w.status === "active").length} aktif)
                  </CardDescription>
                </div>
                <Dialog open={isAddWorkerOpen} onOpenChange={setIsAddWorkerOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Tambah Pekerja
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Pekerja Baru</DialogTitle>
                      <DialogDescription>
                        Masukkan data pekerja baru
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={workerForm.name}
                          onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Posisi/Jabatan *</Label>
                        <Input
                          id="position"
                          value={workerForm.position}
                          onChange={(e) => setWorkerForm({ ...workerForm, position: e.target.value })}
                          placeholder="Contoh: Tukang Bangunan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input
                          id="phone"
                          value={workerForm.phone}
                          onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                          placeholder="081234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={workerForm.status}
                          onValueChange={(value: "active" | "inactive") => 
                            setWorkerForm({ ...workerForm, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddWorkerOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddWorker}>Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Tanggal Bergabung</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.map((worker) => (
                      <TableRow key={worker.id} className="hover-scale">
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.position}</TableCell>
                        <TableCell>{worker.phone}</TableCell>
                        <TableCell>{format(worker.joinDate, "dd MMM yyyy", { locale: localeId })}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            worker.status === "active" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          )}>
                            {worker.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(worker)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Pekerja</DialogTitle>
                                  <DialogDescription>
                                    Perbarui data pekerja
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nama Lengkap *</Label>
                                    <Input
                                      id="edit-name"
                                      value={workerForm.name}
                                      onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-position">Posisi/Jabatan *</Label>
                                    <Input
                                      id="edit-position"
                                      value={workerForm.position}
                                      onChange={(e) => setWorkerForm({ ...workerForm, position: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phone">No. Telepon</Label>
                                    <Input
                                      id="edit-phone"
                                      value={workerForm.phone}
                                      onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      value={workerForm.status}
                                      onValueChange={(value: "active" | "inactive") => 
                                        setWorkerForm({ ...workerForm, status: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingWorker(null)}>
                                    Batal
                                  </Button>
                                  <Button onClick={handleEditWorker}>Simpan Perubahan</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteWorker(worker.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Pekerja</CardDescription>
                <CardTitle className="text-2xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Hadir
                </CardDescription>
                <CardTitle className="text-2xl text-green-600">{stats.hadir}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Izin
                </CardDescription>
                <CardTitle className="text-2xl text-blue-600">{stats.izin}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-yellow-600" />
                  Sakit
                </CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{stats.sakit}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Alpha
                </CardDescription>
                <CardTitle className="text-2xl text-red-600">{stats.alpha}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Absensi Harian
                  </CardTitle>
                  <CardDescription>
                    Catat kehadiran pekerja setiap hari
                  </CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(selectedDate, "dd MMMM yyyy", { locale: localeId })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={localeId}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Pekerja</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead>Status Kehadiran</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.filter(w => w.status === "active").map((worker) => {
                      const attendance = getAttendanceStatus(worker.id);
                      return (
                        <TableRow key={worker.id} className="hover-scale">
                          <TableCell className="font-medium">{worker.name}</TableCell>
                          <TableCell>{worker.position}</TableCell>
                          <TableCell>
                            {attendance ? (
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                attendance.status === "hadir" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                attendance.status === "izin" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                attendance.status === "sakit" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                attendance.status === "alpha" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              )}>
                                {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">Belum diabsen</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 hover:bg-green-100 dark:hover:bg-green-900/30"
                                onClick={() => handleAttendance(worker.id, "hadir")}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Hadir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                onClick={() => handleAttendance(worker.id, "izin")}
                              >
                                Izin
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                                onClick={() => handleAttendance(worker.id, "sakit")}
                              >
                                Sakit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 hover:bg-red-100 dark:hover:bg-red-900/30"
                                onClick={() => handleAttendance(worker.id, "alpha")}
                              >
                                Alpha
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
