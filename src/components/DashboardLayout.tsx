import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, User, FileText, Video, Newspaper, BookOpen, Mail,
  LogOut, Menu, X, ChevronRight, Palette, Tag, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/painel", icon: Home, label: "Início", end: true },
  { to: "/painel/biografia", icon: User, label: "Biografia" },
  { to: "/painel/categorias", icon: Tag, label: "Categorias" },
  { to: "/painel/propostas", icon: FileText, label: "Propostas" },
  { to: "/painel/videos", icon: Video, label: "Vídeos" },
  { to: "/painel/noticias", icon: Newspaper, label: "Notícias" },
  { to: "/painel/livros", icon: BookOpen, label: "Livros" },
  { to: "/painel/contato", icon: Mail, label: "Contato" },
  { to: "/painel/aparencia", icon: Palette, label: "Aparência" },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-sidebar-foreground truncate">Painel CMS</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {sidebarOpen && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen && (
            <p className="text-xs text-sidebar-muted truncate mb-2">{user?.email}</p>
          )}
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            className="w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <header className="h-16 bg-card border-b flex items-center px-6 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
