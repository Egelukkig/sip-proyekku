import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Kegiatan from "./pages/master/Kegiatan";
import Supplier from "./pages/master/Supplier";
import Users from "./pages/master/Users";
import RAB from "./pages/RAB";
import Pesanan from "./pages/Pesanan";
import Pekerja from "./pages/Pekerja";
import Laporan from "./pages/Laporan";
import Pengaturan from "./pages/Pengaturan";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Simple demo authentication
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/master/kegiatan" element={<Kegiatan />} />
              <Route path="/master/supplier" element={<Supplier />} />
              <Route path="/master/users" element={<Users />} />
              <Route path="/rab" element={<RAB />} />
              <Route path="/pesanan" element={<Pesanan />} />
              <Route path="/pekerja" element={<Pekerja />} />
              <Route path="/laporan" element={<Laporan />} />
              <Route path="/pengaturan" element={<Pengaturan />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;