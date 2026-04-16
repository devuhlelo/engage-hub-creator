import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getPublicPropostas, getPublicCategories } from "@/lib/api";
import { FileText, Loader2 } from "lucide-react";

const SitePropostas: React.FC = () => {
  const { theme, btnRadius, siteId } = useOutletContext<any>();
  const [propostas, setPropostas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selected, setSelected] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPublicPropostas(siteId), getPublicCategories(siteId)])
      .then(([p, c]) => { setPropostas(p); setCategorias(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteId]);

  const filtered = selected === "todos" ? propostas : propostas.filter((p) => String(p.categoria_id) === selected);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Propostas</h1>
          <p className="text-lg mt-4 opacity-80">Conheça nossas propostas organizadas por categoria</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {categorias.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10 justify-center">
            <button onClick={() => setSelected("todos")} className="px-5 py-2.5 text-sm font-medium transition-all border-2 shadow-sm" style={{ background: selected === "todos" ? theme.primaryColor : "transparent", color: selected === "todos" ? "#fff" : theme.bodyText, borderColor: selected === "todos" ? theme.primaryColor : "#e5e7eb", borderRadius: btnRadius }}>
              Todos ({propostas.length})
            </button>
            {categorias.map((c) => (
              <button key={c.id} onClick={() => setSelected(String(c.id))} className="px-5 py-2.5 text-sm font-medium transition-all border-2 shadow-sm" style={{ background: selected === String(c.id) ? theme.primaryColor : "transparent", color: selected === String(c.id) ? "#fff" : theme.bodyText, borderColor: selected === String(c.id) ? theme.primaryColor : "#e5e7eb", borderRadius: btnRadius }}>
                {c.nome}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => {
            const cat = categorias.find((c) => c.id === p.categoria_id);
            return (
              <div key={p.id} className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ borderRadius: theme.borderRadius }}>
                <div className="w-full h-32 flex items-center justify-center" style={{ background: `${theme.primaryColor}10` }}>
                  <FileText className="h-12 w-12 opacity-20" style={{ color: theme.primaryColor }} />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: theme.primaryColor }}>{cat?.nome || "Geral"}</span>
                  <h3 className="font-bold text-lg mt-4 mb-2">{p.titulo}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20"><FileText className="h-16 w-16 mx-auto opacity-15 mb-4" /><p className="text-lg opacity-50">Nenhuma proposta encontrada.</p></div>
        )}
      </div>
    </div>
  );
};

export default SitePropostas;