import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getLivros } from "@/lib/api";
import { BookOpen, Loader2 } from "lucide-react";

const SiteLivros: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const [livros, setLivros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLivros().then(setLivros).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Livros</h1>
          <p className="text-lg mt-4 opacity-80">Publicações e recomendações de leitura</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {livros.map((l) => (
            <div key={l.id} className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center" style={{ borderRadius: theme.borderRadius }}>
              {l.imagem ? (
                <div className="overflow-hidden"><img src={l.imagem} alt="" className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              ) : (
                <div className="w-full h-56 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.accentColor}15)` }}>
                  <BookOpen className="h-16 w-16 opacity-20" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-lg mt-1">{l.titulo}</h3>
                {l.autor && <p className="text-sm opacity-60 mt-1">{l.autor}</p>}
                {l.resumo && <p className="text-sm opacity-70 mt-2 line-clamp-2">{l.resumo}</p>}
              </div>
            </div>
          ))}
        </div>
        {livros.length === 0 && (
          <div className="text-center py-20"><BookOpen className="h-16 w-16 mx-auto opacity-15 mb-4" /><p className="text-lg opacity-50">Nenhum livro disponível.</p></div>
        )}
      </div>
    </div>
  );
};

export default SiteLivros;
