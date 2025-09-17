import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Laporan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laporan & Cetak</h2>
        <p className="text-muted-foreground">
          Generate laporan dan analisis data sistem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Laporan RAB
            </CardTitle>
            <CardDescription>
              Laporan per kegiatan atau periode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Realisasi Pesanan
            </CardTitle>
            <CardDescription>
              Per kegiatan atau supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rekap Sisa Kebutuhan
            </CardTitle>
            <CardDescription>
              Monitoring sisa anggaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analisis Data</CardTitle>
          <CardDescription>
            Dashboard analisis memerlukan integrasi backend untuk data real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Business Intelligence</h3>
            <p className="text-muted-foreground">
              Fitur analisis mendalam dengan chart, grafik, dan export ke berbagai format.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}