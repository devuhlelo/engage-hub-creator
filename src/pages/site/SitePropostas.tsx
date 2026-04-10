import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SitePropostas: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const propostas = useMemo(() => getData<any[]>("propostas", []), []);
  const categorias = useMemo(() => getData<any[]>("categorias", []), []);
  const eixos = useMemo(() => getData<string[]>("eixos", []), []);

  const allEixos = [...new Set([...eixos, ...categorias.map((c) => c.nome)])];
  const [selected, setSelected] = useState("todos");

  const filtered = selected === "todos" ? propostas : propostas.filter((p) => p.eixo === selected);

  const getEixoColor = (eixo: string) => {
    const cat = categorias.find((c) => c.nome === eixo);
    return cat?.cor || theme.primaryColor;
  };

  return (
    <div>
      <section className="py-16 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Propostas</h1>
          <p className="opacity-75">Conheça nossas propostas organizadas por eixo temático</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8 justify-center">
          <button
            onClick={() => setSelected("todos")}
            className="px-4 py-2 text-sm font-medium transition-colors border"
            style={{
              background: selected === "todos" ? theme.primaryColor : "transparent",
              color: selected === "todos" ? "#fff" : theme.bodyText,
              borderColor: selected === "todos" ? theme.primaryColor : "#e5e7eb",
              borderRadius: btnRadius,
            }}
          >
            Todos ({propostas.length})
          </button>
          {allEixos.map((e) => (
            <button
              key={e}
              onClick={() => setSelected(e)}
              className="px-4 py-2 text-sm font-medium transition-colors border"
              style={{
                background: selected === e ? getEixoColor(e) : "transparent",
                color: selected === e ? "#fff" : theme.bodyText,
                borderColor: selected === e ? getEixoColor(e) : "#e5e7eb",
                borderRadius: btnRadius,
              }}
            >
              {e} ({propostas.filter((p) => p.eixo === e).length})
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: theme.borderRadius }}>
              {p.image && <img src={p.image} alt="" className="w-full h-48 object-cover" />}
              <div className="p-5">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: getEixoColor(p.eixo) }}
                >
                  {p.eixo}
                </span>
                <h3 className="font-bold text-lg mt-3 mb-2">{p.title}</h3>
                <p className="text-sm opacity-70 mb-3">{p.resumo}</p>
                {p.content && (
                  <div className="text-sm opacity-60 line-clamp-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: p.content }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center opacity-50 py-12">Nenhuma proposta encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default SitePropostas;
