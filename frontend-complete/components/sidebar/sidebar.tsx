"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  ShieldAlert, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "transactions", label: "Transações", icon: CreditCard, href: "/transactions" },
  { id: "fraud", label: "Detecção de Fraude", icon: ShieldAlert, href: "/fraud" },
  { id: "accounts", label: "Contas", icon: Users, href: "/accounts" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "reports", label: "Relatórios", icon: FileText, href: "/reports" },
  { id: "alerts", label: "Alertas", icon: Bell, href: "/alerts" },
  { id: "settings", label: "Configurações", icon: Settings, href: "/settings" },
  { id: "help", label: "Ajuda", icon: HelpCircle, href: "/help" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    // Aqui você adicionaria a lógica real de logout
  };

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-gray-900 text-white transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">FinTrack</span>
            </div>
          )}
          {collapsed && <ShieldAlert className="h-8 w-8 text-blue-400 mx-auto" />}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || activeItem === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div className="mb-4">
            <p className="font-semibold">Admin Usuário</p>
            <p className="text-sm text-gray-400">admin@fintrack.com</p>
            <p className="text-xs text-gray-500 mt-1">Último login: Hoje 10:30</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
