import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2 } from "lucide-react";
import logoSisgen from "@/assets/logo-sisgen.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/painel");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, senha);
      if (data.user.role === 'superadmin' || (data.siteId && data.siteId !== null)) {
        navigate("/painel");
      } else {
        setError("Acesso negado: Seu usuário não possui nenhum site vinculado.");
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="cms-card">
          <div className="text-center mb-8">
            <img src={logoSisgen} alt="SISGEN" className="h-32 mx-auto mb-4 object-contain" />
            <p className="text-muted-foreground mt-1">Acesse o painel de gerenciamento</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="cms-label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required disabled={loading} />
              </div>
            </div>
            <div>
              <label className="cms-label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} className="pl-10" required disabled={loading} />
              </div>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Entrando...</> : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
