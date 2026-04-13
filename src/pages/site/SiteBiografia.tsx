import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getData, onDataChange } from "@/lib/storage";
import { User, Target, BookOpen, Briefcase, Award, CheckCircle2 } from "lucide-react";

const SiteBiografia: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const [bio, setBio] = useState<any>(getData("biografia", {}));

  useEffect(() => {
    return onDataChange(() => setBio(getData("biografia", {})));
  }, []);

  const Section = ({ title, content, image, reverse, icon: Icon }: any) => (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className={reverse ? "md:order-2" : ""}>
        {Icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${theme.primaryColor}15` }}>
            <Icon className="h-6 w-6" style={{ color: theme.primaryColor }} />
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="prose max-w-none opacity-80 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {image && (
        <div className={reverse ? "md:order-1" : ""}>
          <img src={image} alt="" className="rounded-2xl shadow-xl w-full" />
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Banner */}
      <section
        className="relative py-20 px-6 text-center text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}
      >
        {bio?.banner && (
          <>
            <img src={bio.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: theme.secondaryColor, opacity: 0.7 }} />
          </>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Biografia</h1>
          <p className="text-lg mt-4 opacity-80">Conheça nossa história e trajetória</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {/* Quem eu sou */}
        <Section
          title={bio?.quemSouTitle || "Quem eu sou?"}
          content={bio?.quemSouContent || "<p>Configure esta seção no painel CMS.</p>"}
          image={bio?.quemSouImage}
          icon={User}
        />

        {/* Objetivo */}
        {bio?.objetivoCampanha && (
          <Section
            title="Objetivo de Campanha"
            content={bio.objetivoCampanha}
            icon={Target}
            reverse
          />
        )}

        {/* Biografia Completa */}
        {bio?.biografiaCompleta && (
          <Section
            title="Biografia Completa"
            content={bio.biografiaCompleta}
            icon={BookOpen}
          />
        )}

        {/* Áreas de Atuação */}
        {bio?.areasAtuacao?.length > 0 && bio.areasAtuacao.some((a: any) => a.title) && (
          <div>
            <div className="text-center mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.primaryColor}15` }}>
                <Briefcase className="h-6 w-6" style={{ color: theme.primaryColor }} />
              </div>
              <h2 className="text-3xl font-bold">Áreas de Atuação</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bio.areasAtuacao.filter((a: any) => a.title).map((a: any, i: number) => (
                <div key={a.id || i} className="p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all" style={{ borderRadius: theme.borderRadius }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-sm" style={{ background: theme.primaryColor }}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                  {a.description && <div className="text-sm opacity-70 leading-relaxed" dangerouslySetInnerHTML={{ __html: a.description }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compromissos */}
        {bio?.compromissos?.length > 0 && bio.compromissos.some((c: any) => c.title) && (
          <div>
            <div className="text-center mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.primaryColor}15` }}>
                <CheckCircle2 className="h-6 w-6" style={{ color: theme.primaryColor }} />
              </div>
              <h2 className="text-3xl font-bold">Compromissos Principais</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {bio.compromissos.filter((c: any) => c.title).map((c: any, i: number) => (
                <div key={c.id || i} className="flex items-center gap-4 p-5 border hover:shadow-md transition-shadow" style={{ borderRadius: theme.borderRadius }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: theme.primaryColor }} />
                  <span className="font-medium">{c.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reconhecimentos */}
        {bio?.reconhecimentos?.length > 0 && bio.reconhecimentos.some((r: any) => r.title) && (
          <div>
            <div className="text-center mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.accentColor}20` }}>
                <Award className="h-6 w-6" style={{ color: theme.accentColor }} />
              </div>
              <h2 className="text-3xl font-bold">Reconhecimentos</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bio.reconhecimentos.filter((r: any) => r.title).map((r: any, i: number) => (
                <div key={r.id || i} className="text-center p-8 border hover:shadow-lg transition-shadow" style={{ borderRadius: theme.borderRadius }}>
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${theme.accentColor}20` }}>
                    <Award className="h-8 w-8" style={{ color: theme.accentColor }} />
                  </div>
                  <h3 className="font-bold text-lg">{r.title}</h3>
                  {r.year && <p className="text-sm opacity-50 mt-1">{r.year}</p>}
                  {r.description && <div className="text-sm opacity-70 mt-2" dangerouslySetInnerHTML={{ __html: r.description }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteBiografia;
