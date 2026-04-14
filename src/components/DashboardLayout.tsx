import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, LayoutDashboard, FileText, Settings, Users, 
  Video, BookOpen, MessageSquare, Menu, X
} from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 const navItems = [
    { path: '/painel', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/painel/noticias', icon: <FileText size={20} />, label: 'Notícias' },
    { path: '/painel/propostas', icon: <MessageSquare size={20} />, label: 'Propostas' },
    { path: '/painel/videos', icon: <Video size={20} />, label: 'Vídeos' },
    { path: '/painel/livros', icon: <BookOpen size={20} />, label: 'Livros' },
    { path: '/painel/categorias', icon: <Users size={20} />, label: 'Categorias' },
    { path: '/painel/aparencia', icon: <Settings size={20} />, label: 'Aparência / Home' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Painel CMS</h2>
          <button className="lg:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:bg-red-50 w-full px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair do Painel</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b p-4 flex justify-between items-center lg:hidden">
          <h2 className="text-lg font-bold text-gray-800">Sisgen</h2>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 hover:text-gray-900 p-1">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}