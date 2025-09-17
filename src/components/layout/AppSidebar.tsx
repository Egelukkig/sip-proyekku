import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Database,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  Building2,
  Calculator,
  LogOut
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

const masterDataItems = [
  {
    title: "Kegiatan",
    url: "/master/kegiatan",
    icon: FileText,
  },
  {
    title: "Supplier",
    url: "/master/supplier",
    icon: Building2,
  },
  {
    title: "User & Role",
    url: "/master/users",
    icon: Users,
  },
];

const operationalItems = [
  {
    title: "RAB Kegiatan",
    url: "/rab",
    icon: Calculator,
  },
  {
    title: "Surat Pesanan",
    url: "/pesanan",
    icon: ShoppingCart,
  },
  {
    title: "Laporan & Cetak",
    url: "/laporan",
    icon: BarChart3,
  },
];

const settingsItems = [
  {
    title: "Pengaturan",
    url: "/pengaturan",
    icon: Settings,
  },
];

interface AppSidebarProps {
  onLogout: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium border-r-2 border-sidebar-primary"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarContent className="bg-sidebar">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Master Data */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Master Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Operational */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Operasional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} className="text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}