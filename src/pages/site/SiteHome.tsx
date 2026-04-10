import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SiteHome: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const home = useMemo(() => getData<any>("home", {}), []);
  const propostas = useMemo(() => getData<any[]>("propostas", []), []);
  const categorias = useMemo(() => getData<any[]>("categorias", []), []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-center text-white">
        {home?.hero?.image && (
          <img src={home.hero.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: theme.secondaryColor, opacity: theme.heroOverlayOpacity }} />
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{home?.hero?.title || "Bem-vindo"}</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">{home?.hero?.subtitle || ""}</p>
          <Link
            to="/site/propostas"
            className="inline-block px-8 py-3 font-semibold text-white"
            style={{ background: theme.primaryColor, borderRadius: btnRadius }}
          >
            Ver Propostas
          </Link>
        </div>
      </section>

      {/* Sobre */}
      {home?.sobre && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {home.sobre.image && (
              <img src={home.sobre.image} alt="" className="rounded-2xl shadow-lg w-full" />
            )}
            <div>
              <h2 className="text-3xl font-bold mb-4">{home.sobre.title || "Sobre"}</h2>
              {home.sobre.subtitle && <p className="text-lg opacity-60 mb-4">{home.sobre.subtitle}</p>}
              <div className="prose max-w-none opacity-80" dangerouslySetInnerHTML={{ __html: home.sobre.content || "" }} />
            </div>
          </div>
        </section>
      )}

      {/* Bandeiras */}
      {home?.bandeiras?.items?.length > 0 && (
        <section className="py-20 px-6" style={{ background: `${theme.primaryColor}08` }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">{home.bandeiras.title || "Nossas Bandeiras"}</h2>
            <p className="opacity-60 mb-12">{home.bandeiras.subtitle || ""}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {home.bandeiras.items.map((b: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border text-left" style={{ borderRadius: theme.borderRadius }}>
                  {b.icon && <span className="text-3xl mb-3 block">{b.icon}</span>}
                  <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-sm opacity-70">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Diferenciais */}
      {home?.diferenciais?.items?.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">{home.diferenciais.title || "Diferenciais"}</h2>
            <p className="opacity-60 mb-12">{home.diferenciais.subtitle || ""}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {home.diferenciais.items.map((d: any, i: number) => (
                <div key={i} className="text-center p-6">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ background: theme.primaryColor }}
                  >
                    {d.icon || (i + 1)}
                  </div>
                  <h3 className="font-bold mb-1">{d.title}</h3>
                  <p className="text-sm opacity-70">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Propostas destaque */}
      {propostas.length > 0 && (
        <section className="py-20 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">Propostas</h2>
            <p className="opacity-60 mb-12">Conheça nossas principais propostas</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propostas.slice(0, 6).map((p: any) => (
                <div key={p.id} className="bg-white/10 backdrop-blur rounded-xl p-6 text-left" style={{ borderRadius: theme.borderRadius }}>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: theme.accentColor, color: "#fff" }}>
                    {p.eixo || p.categoria}
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-2">{p.title}</h3>
                  <p className="text-sm opacity-75">{p.resumo}</p>
                </div>
              ))}
            </div>
            <Link
              to="/site/propostas"
              className="inline-block mt-8 px-8 py-3 font-semibold border border-white/30 hover:bg-white/10 transition-colors"
              style={{ borderRadius: btnRadius }}
            >
              Ver Todas
            </Link>
          </div>
        </section>
      )}

      {/* Junte-se */}
      {home?.juntese && (
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{home.juntese.title || "Junte-se a Nós"}</h2>
            <div className="opacity-70 mb-8" dangerouslySetInnerHTML={{ __html: home.juntese.content || "" }} />
            <Link
              to="/site/contato"
              className="inline-block px-8 py-3 font-semibold text-white"
              style={{ background: theme.primaryColor, borderRadius: btnRadius }}
            >
              Entre em Contato
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default SiteHome;
