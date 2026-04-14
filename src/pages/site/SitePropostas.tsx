import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getPosts, getCategories } from "@/lib/api";
import { FileText, Loader2 } from "lucide-react";

const SitePropostas: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const [propostas, setPropostas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selected, setSelected] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPosts("proposta"), getCategories()])
      .then(([p, c]) => { setPropostas(p); setCategorias(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allEixos = [...new Set([...categorias.map((c) => c.name), ...propostas.map((p) => p.eixo)])].filter(Boolean);
  const filtered = selected === "todos" ? propostas : propostas.filter((p) => p.eixo === selected);
  const getEixoColor = (eixo: string) => categorias.find((c) => c.name === eixo)?.color || theme.primaryColor;

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Propostas</h1>
          <p className="text-lg mt-4 opacity-80">Conheça nossas propostas organizadas por eixo temático</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {allEixos.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10 justify-center">
            <button onClick={() => setSelected("todos")} className="px-5 py-2.5 text-sm font-medium transition-all border-2 shadow-sm" style={{ background: selected === "todos" ? theme.primaryColor : "transparent", color: selected === "todos" ? "#fff" : theme.bodyText, borderColor: selected === "todos" ? theme.primaryColor : "#e5e7eb", borderRadius: btnRadius }}>Todos ({propostas.length})</button>
            {allEixos.map((e) => (
              <button key={e} onClick={() => setSelected(e)} className="px-5 py-2.5 text-sm font-medium transition-all border-2 shadow-sm" style={{ background: selected === e ? getEixoColor(e) : "transparent", color: selected === e ? "#fff" : theme.bodyText, borderColor: selected === e ? getEixoColor(e) : "#e5e7eb", borderRadius: btnRadius }}>
                {e} ({propostas.filter((p) => p.eixo === e).length})
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p.id} className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ borderRadius: theme.borderRadius }}>
              {p.image ? (
                <div className="overflow-hidden"><img src={p.image} alt="" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              ) : (
                <div className="w-full h-32 flex items-center justify-center" style={{ background: `${getEixoColor(p.eixo)}10` }}>
                  <FileText className="h-12 w-12 opacity-20" style={{ color: getEixoColor(p.eixo) }} />
                </div>
              )}
              <div className="p-6">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: getEixoColor(p.eixo) }}>{p.eixo}</span>
                <h3 className="font-bold text-lg mt-4 mb-2">{p.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{p.resumo}</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20"><FileText className="h-16 w-16 mx-auto opacity-15 mb-4" /><p className="text-lg opacity-50">Nenhuma proposta encontrada.</p></div>
        )}
      </div>
    </div>
  );
};

export default SitePropostas;
