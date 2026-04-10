import React from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";
import { User, Target, BookOpen, Briefcase, Award, CheckCircle2 } from "lucide-react";

const SiteBiografia: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const bio = getData<any>("biografia", {});

  const PageBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <section
      className="relative py-20 px-6 text-center text-white overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}
    >
      {bio?.banner?.image && (
        <>
          <img src={bio.banner.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: theme.secondaryColor, opacity: 0.7 }} />
        </>
      )}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-lg mt-4 opacity-80">{subtitle}</p>}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg>
      </div>
    </section>
  );

  const Section = ({ title, content, image, reverse, icon: Icon }: { title: string; content: string; image?: string; reverse?: boolean; icon?: any }) => (
    <div className={`grid md:grid-cols-2 gap-16 items-center ${reverse ? "" : ""}`}>
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
      <PageBanner
        title={bio?.banner?.title || "Biografia"}
        subtitle={bio?.banner?.subtitle || "Conheça nossa história e trajetória"}
      />

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        <Section
          title={bio?.quemSou?.title || "Quem eu sou?"}
          content={bio?.quemSou?.content || "<p>Configure esta seção no painel CMS para apresentar quem você é, sua história e motivações.</p>"}
          image={bio?.quemSou?.image}
          icon={User}
        />

        <Section
          title={bio?.objetivo?.title || "Objetivo de Campanha"}
          content={bio?.objetivo?.content || "<p>Descreva seus objetivos de campanha no painel CMS.</p>"}
          image={bio?.objetivo?.image}
          icon={Target}
          reverse
        />

        <Section
          title={bio?.biografiaCompleta?.title || "Biografia Completa"}
          content={bio?.biografiaCompleta?.content || "<p>Insira a biografia completa no painel CMS para que os visitantes conheçam toda sua trajetória.</p>"}
          image={bio?.biografiaCompleta?.image}
          icon={BookOpen}
        />

        {/* Áreas de Atuação */}
        <div>
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.primaryColor}15` }}>
              <Briefcase className="h-6 w-6" style={{ color: theme.primaryColor }} />
            </div>
            <h2 className="text-3xl font-bold">{bio?.areasAtuacao?.title || "Áreas de Atuação"}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(bio?.areasAtuacao?.items?.length > 0 ? bio.areasAtuacao.items : [
              { title: "Saúde Pública", description: "Melhoria do sistema de saúde" },
              { title: "Educação", description: "Investimento em escolas e professores" },
              { title: "Meio Ambiente", description: "Sustentabilidade e preservação" },
            ]).map((a: any, i: number) => (
              <div
                key={i}
                className="p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                style={{ borderRadius: theme.borderRadius }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-sm" style={{ background: theme.primaryColor }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compromissos */}
        <div>
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.primaryColor}15` }}>
              <CheckCircle2 className="h-6 w-6" style={{ color: theme.primaryColor }} />
            </div>
            <h2 className="text-3xl font-bold">{bio?.compromissos?.title || "Compromissos Principais"}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {(bio?.compromissos?.items?.length > 0 ? bio.compromissos.items : [
              "Transparência total na gestão",
              "Diálogo constante com a população",
              "Investimento em saúde e educação",
              "Combate à corrupção",
            ]).map((c: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 border hover:shadow-md transition-shadow"
                style={{ borderRadius: theme.borderRadius }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: theme.primaryColor }} />
                <span className="font-medium">{typeof c === "string" ? c : c.title || c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reconhecimentos */}
        {bio?.reconhecimentos?.items?.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.accentColor}20` }}>
                <Award className="h-6 w-6" style={{ color: theme.accentColor }} />
              </div>
              <h2 className="text-3xl font-bold">{bio.reconhecimentos.title || "Reconhecimentos"}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bio.reconhecimentos.items.map((r: any, i: number) => (
                <div
                  key={i}
                  className="text-center p-8 border hover:shadow-lg transition-shadow"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  {r.image ? (
                    <img src={r.image} alt="" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${theme.accentColor}20` }}>
                      <Award className="h-8 w-8" style={{ color: theme.accentColor }} />
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{r.title}</h3>
                  <p className="text-sm opacity-70 mt-2">{r.description}</p>
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
