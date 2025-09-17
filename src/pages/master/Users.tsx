import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users as UsersIcon, UserPlus, Shield } from "lucide-react";

export default function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Data User & Role</h2>
        <p className="text-muted-foreground">
          Kelola pengguna sistem dan hak akses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Fitur ini memerlukan integrasi backend untuk manajemen user yang aman
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Backend Integration Required</h3>
            <p className="text-muted-foreground mb-4">
              Untuk mengelola user dan role dengan aman, aplikasi memerlukan koneksi ke database dan sistem autentikasi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}