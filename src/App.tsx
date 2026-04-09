import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/painel" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/painel" element={<ProtectedRoute><DashboardLayout><CmsHome /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/biografia" element={<ProtectedRoute><DashboardLayout><CmsBiografia /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/propostas" element={<ProtectedRoute><DashboardLayout><CmsPropostas /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/videos" element={<ProtectedRoute><DashboardLayout><CmsVideos /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/noticias" element={<ProtectedRoute><DashboardLayout><CmsNoticias /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/livros" element={<ProtectedRoute><DashboardLayout><CmsLivros /></DashboardLayout></ProtectedRoute>} />
    <Route path="/painel/contato" element={<ProtectedRoute><DashboardLayout><CmsContato /></DashboardLayout></ProtectedRoute>} />
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
