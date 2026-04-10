import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SiteLivros: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const livros = useMemo(() => getData<any[]>("livros", []), []);

  return (
    <div>
      <section className="py-16 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Livros</h1>
          <p className="opacity-75">Publicações e recomendações de leitura</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {livros.map((l) => (
            <div key={l.id} className="border rounded-xl overflow-hidden shadow-sm text-center" style={{ borderRadius: theme.borderRadius }}>
              {l.cover && <img src={l.cover} alt="" className="w-full h-64 object-cover" />}
              <div className="p-4">
                <span className="text-xs font-semibold opacity-50">{l.tipo === "escrito" ? "Escrito" : "Recomendação"}</span>
                <h3 className="font-bold mt-1">{l.title}</h3>
                {l.autor && <p className="text-sm opacity-70">{l.autor}</p>}
                {l.link && (
                  <a
                    href={l.link}
                    target="_blank"
                    rel="noopener"
                    className="inline-block mt-3 text-sm font-medium"
                    style={{ color: theme.primaryColor }}
                  >
                    Ver mais →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {livros.length === 0 && <p className="text-center opacity-50 py-12">Nenhum livro disponível.</p>}
      </div>
    </div>
  );
};

export default SiteLivros;
