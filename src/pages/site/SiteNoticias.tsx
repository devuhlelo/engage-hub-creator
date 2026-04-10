import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SiteNoticias: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const noticias = useMemo(() => getData<any[]>("noticias", []), []);

  return (
    <div>
      <section className="py-16 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Notícias</h1>
          <p className="opacity-75">Fique por dentro das últimas novidades</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n) => (
            <div key={n.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: theme.borderRadius }}>
              {n.image && <img src={n.image} alt="" className="w-full h-48 object-cover" />}
              <div className="p-5">
                {n.categoria && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: theme.primaryColor }}>
                    {n.categoria}
                  </span>
                )}
                <h3 className="font-bold text-lg mt-2 mb-2">{n.title}</h3>
                <p className="text-sm opacity-70 mb-2">{n.resumo}</p>
                {n.data && <p className="text-xs opacity-50">{n.data}</p>}
              </div>
            </div>
          ))}
        </div>
        {noticias.length === 0 && <p className="text-center opacity-50 py-12">Nenhuma notícia disponível.</p>}
      </div>
    </div>
  );
};

export default SiteNoticias;
