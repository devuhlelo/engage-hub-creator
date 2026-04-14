import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import CmsHome from "./pages/cms/CmsHome";
import CmsBiografia from "./pages/cms/CmsBiografia";
import CmsPropostas from "./pages/cms/CmsPropostas";
import CmsVideos from "./pages/cms/CmsVideos";
import CmsNoticias from "./pages/cms/CmsNoticias";
import CmsLivros from "./pages/cms/CmsLivros";
import CmsContato from "./pages/cms/CmsContato";
import CmsAparencia from "./pages/cms/CmsAparencia";
import CmsCategorias from "./pages/cms/CmsCategorias";

import SiteLayout from "./pages/site/SiteLayout";
import SiteHome from "./pages/site/SiteHome";
import SiteBiografia from "./pages/site/SiteBiografia";
import SitePropostas from "./pages/site/SitePropostas";
import SiteVideos from "./pages/site/SiteVideos";
import SiteNoticias from "./pages/site/SiteNoticias";
import SiteLivros from "./pages/site/SiteLivros";
import SiteContato from "./pages/site/SiteContato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protege as rotas, mas agora usa <Outlet /> para renderizar as rotas aninhadas (Painel e Layout)
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />; 
};

// Se já estiver logado, joga para o painel
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/painel" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Rota de Login */}
    <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />

    {/* Grupo de Rotas do Painel Administrativo (Protegidas) */}
    <Route element={<ProtectedRoute />}>
      <Route path="/painel" element={<DashboardLayout />}>
        <Route index element={<CmsHome />} />
        <Route path="biografia" element={<CmsBiografia />} />
        <Route path="propostas" element={<CmsPropostas />} />
        <Route path="videos" element={<CmsVideos />} />
        <Route path="noticias" element={<CmsNoticias />} />
        <Route path="livros" element={<CmsLivros />} />
        <Route path="contato" element={<CmsContato />} />
        <Route path="aparencia" element={<CmsAparencia />} />
        <Route path="categorias" element={<CmsCategorias />} />
      </Route>
    </Route>

    {/* Grupo de Rotas do Site Público */}
    <Route path="/site" element={<SiteLayout />}>
      <Route index element={<SiteHome />} />
      <Route path="biografia" element={<SiteBiografia />} />
      <Route path="propostas" element={<SitePropostas />} />
      <Route path="videos" element={<SiteVideos />} />
      <Route path="noticias" element={<SiteNoticias />} />
      <Route path="livros" element={<SiteLivros />} />
      <Route path="contato" element={<SiteContato />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;