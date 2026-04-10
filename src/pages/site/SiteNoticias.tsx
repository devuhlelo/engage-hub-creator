import React from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";
import { Newspaper, Calendar } from "lucide-react";

const SiteNoticias: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const noticias = getData<any[]>("noticias", []);

  return (
    <div>
      <section
        className="relative py-20 px-6 text-center text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}
      >
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Notícias</h1>
          <p className="text-lg mt-4 opacity-80">Fique por dentro das últimas novidades</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((n) => (
            <div
              key={n.id}
              className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ borderRadius: theme.borderRadius }}
            >
              {n.image ? (
                <div className="overflow-hidden">
                  <img src={n.image} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center" style={{ background: `${theme.primaryColor}08` }}>
                  <Newspaper className="h-12 w-12 opacity-15" />
                </div>
              )}
              <div className="p-6">
                {n.categoria && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: theme.primaryColor }}>
                    {n.categoria}
                  </span>
                )}
                <h3 className="font-bold text-lg mt-3 mb-2">{n.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed mb-3">{n.resumo}</p>
                {n.data && (
                  <div className="flex items-center gap-1.5 text-xs opacity-40">
                    <Calendar className="h-3.5 w-3.5" /> {n.data}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {noticias.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="h-16 w-16 mx-auto opacity-15 mb-4" />
            <p className="text-lg opacity-50">Nenhuma notícia disponível.</p>
            <p className="text-sm opacity-30 mt-1">Cadastre notícias no painel CMS.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteNoticias;
