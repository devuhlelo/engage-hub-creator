import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPublicNoticias } from "@/lib/api";
import { Newspaper, Loader2 } from "lucide-react";

const SiteNoticias: React.FC = () => {
  const { theme, siteId } = useOutletContext<any>();
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicNoticias(siteId).then(setNoticias).catch(() => {}).finally(() => setLoading(false));
  }, [siteId]);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Notícias</h1>
          <p className="text-lg mt-4 opacity-80">Fique por dentro das últimas novidades</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((n) => (
            <div key={n.id} className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ borderRadius: theme.borderRadius }}>
              {n.imagem ? (
                <div className="overflow-hidden"><img src={n.imagem} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center" style={{ background: `${theme.primaryColor}08` }}><Newspaper className="h-12 w-12 opacity-15" /></div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg mt-1 mb-2">{n.titulo}</h3>
                <p className="text-sm opacity-70 leading-relaxed line-clamp-3">{n.conteudo}</p>
              </div>
            </div>
          ))}
        </div>
        {noticias.length === 0 && (
          <div className="text-center py-20"><Newspaper className="h-16 w-16 mx-auto opacity-15 mb-4" /><p className="text-lg opacity-50">Nenhuma notícia disponível.</p></div>
        )}
      </div>
    </div>
  );
};

export default SiteNoticias;