import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getData, onDataChange } from "@/lib/storage";
import { ArrowRight, Users, Heart } from "lucide-react";

const SiteHome: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const [home, setHome] = useState<any>(getData("home", {}));
  const [propostas, setPropostas] = useState<any[]>(getData("propostas", []));
  const [categorias, setCategorias] = useState<any[]>(getData("categorias", []));

  useEffect(() => {
    const reload = () => {
      setHome(getData("home", {}));
      setPropostas(getData("propostas", []));
      setCategorias(getData("categorias", []));
    };
    return onDataChange(reload);
  }, []);

  const hasHeroImage = !!home?.heroBanner;

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
        style={{ background: hasHeroImage ? undefined : `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}
      >
        {hasHeroImage && (
          <img src={home.heroBanner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: hasHeroImage ? theme.secondaryColor : "transparent",
            opacity: hasHeroImage ? theme.heroOverlayOpacity : 0,
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: theme.accentColor }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: "#fff" }} />
        </div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white/15 backdrop-blur-sm border border-white/20">
            ✨ Bem-vindo ao nosso site
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            {home?.heroTitle || "Construindo um Futuro Melhor"}
          </h1>
          <p className="text-lg md:text-xl opacity-85 mb-10 max-w-2xl mx-auto leading-relaxed">
            {home?.heroSubtitle || "Conheça nossas propostas, trajetória e como podemos transformar juntos a nossa realidade."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/site/propostas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ background: theme.accentColor, borderRadius: btnRadius }}
            >
              {home?.heroButtonText || "Ver Propostas"} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/site/biografia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold border-2 border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm"
              style={{ borderRadius: btnRadius }}
            >
              Conheça a História
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 36C840 48 960 64 1080 64C1200 64 1320 48 1380 40L1440 32V80H0Z" fill={theme.bodyBg} />
          </svg>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {home?.sobreImage ? (
            <div className="relative">
              <img src={home.sobreImage} alt="" className="rounded-2xl shadow-2xl w-full" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl opacity-20" style={{ background: theme.primaryColor }} />
            </div>
          ) : (
            <div className="relative">
              <div className="w-full aspect-square rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}15, ${theme.accentColor}15)` }}>
                <Users className="h-24 w-24 opacity-20" style={{ color: theme.primaryColor }} />
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.primaryColor }}>Sobre nós</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 leading-tight">
              {home?.sobreTitle || "Quem Somos"}
            </h2>
            <div
              className="prose max-w-none opacity-75 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: home?.sobreContent || "<p>Configure esta seção no painel CMS.</p>",
              }}
            />
            <Link
              to="/site/biografia"
              className="inline-flex items-center gap-2 mt-6 font-semibold text-sm hover:gap-3 transition-all"
              style={{ color: theme.primaryColor }}
            >
              Saiba mais <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bandeiras */}
      {home?.bandeiras?.length > 0 && home.bandeiras.some((b: any) => b.title) && (
        <section className="py-24 px-6" style={{ background: `${theme.primaryColor}06` }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.primaryColor }}>Nossas Bandeiras</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Pilares que nos guiam</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {home.bandeiras.filter((b: any) => b.title).map((b: any, i: number) => (
                <div
                  key={b.id || i}
                  className="group p-8 bg-white shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  <span className="text-4xl mb-4 block">{b.icon || "📌"}</span>
                  <h3 className="font-bold text-xl mb-3">{b.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Diferenciais */}
      {home?.diferenciais?.length > 0 && home.diferenciais.some((d: any) => d.title) && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.primaryColor }}>Diferenciais</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Por que somos diferentes</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {home.diferenciais.filter((d: any) => d.title).map((d: any, i: number) => (
                <div key={d.id || i} className="text-center group">
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}cc)` }}
                  >
                    <span className="filter brightness-0 invert">💡</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{d.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Propostas */}
      {propostas.length > 0 && (
        <section className="py-24 px-6 relative overflow-hidden" style={{ background: theme.secondaryColor, color: "#fff" }}>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                {home?.propostasTitle || "Propostas"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                {home?.propostasSubtitle || "Conheça nossas principais propostas"}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propostas.slice(0, 6).map((p: any) => {
                const cat = categorias.find((c: any) => c.nome === p.eixo);
                return (
                  <div
                    key={p.id}
                    className="bg-white/10 backdrop-blur-sm p-6 hover:bg-white/15 transition-all group border border-white/5"
                    style={{ borderRadius: theme.borderRadius }}
                  >
                    <span className="text-xs font-semibold px-3 py-1 rounded-full inline-block" style={{ background: cat?.cor || theme.accentColor, color: "#fff" }}>
                      {p.eixo || p.categoria || "Geral"}
                    </span>
                    <h3 className="font-bold text-lg mt-4 mb-2">{p.title}</h3>
                    <p className="text-sm opacity-70 leading-relaxed">{p.resumo}</p>
                  </div>
                );
              })}
            </div>
            {propostas.length > 6 && (
              <div className="text-center mt-12">
                <Link
                  to="/site/propostas"
                  className="inline-flex items-center gap-2 px-8 py-4 font-semibold border-2 border-white/30 hover:bg-white/10 transition-all"
                  style={{ borderRadius: btnRadius }}
                >
                  Ver Todas as Propostas <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6">
        <div
          className="max-w-4xl mx-auto text-center p-12 md:p-16 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}dd)`,
            borderRadius: theme.borderRadius === "0px" ? "0" : "24px",
            color: "#fff",
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5" />
          </div>
          <div className="relative z-10">
            <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {home?.junteSeTitle || "Junte-se a Nós"}
            </h2>
            <div
              className="opacity-80 mb-8 max-w-xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: home?.junteSeContent || "<p>Faça parte dessa transformação. Entre em contato e saiba como participar.</p>",
              }}
            />
            <Link
              to="/site/contato"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold bg-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ color: theme.primaryColor, borderRadius: btnRadius }}
            >
              {home?.junteSeButtonText || "Entre em Contato"} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SiteHome;
