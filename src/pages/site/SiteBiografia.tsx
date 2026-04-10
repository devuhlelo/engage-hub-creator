import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SiteBiografia: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const bio = useMemo(() => getData<any>("biografia", {}), []);

  const Section = ({ title, content, image, reverse }: { title: string; content: string; image?: string; reverse?: boolean }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? "direction-rtl" : ""}`}>
      <div className={reverse ? "md:order-2" : ""}>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div className="prose max-w-none opacity-80" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {image && (
        <div className={reverse ? "md:order-1" : ""}>
          <img src={image} alt="" className="rounded-2xl shadow-lg w-full" />
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Banner */}
      {bio?.banner?.image && (
        <section className="relative h-[40vh] flex items-center justify-center text-white">
          <img src={bio.banner.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: theme.secondaryColor, opacity: 0.6 }} />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">{bio.banner.title || "Biografia"}</h1>
            {bio.banner.subtitle && <p className="text-lg mt-2 opacity-90">{bio.banner.subtitle}</p>}
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {bio?.quemSou?.content && <Section title={bio.quemSou.title || "Quem eu sou?"} content={bio.quemSou.content} image={bio.quemSou.image} />}
        {bio?.objetivo?.content && <Section title={bio.objetivo.title || "Objetivo de Campanha"} content={bio.objetivo.content} image={bio.objetivo.image} reverse />}
        {bio?.biografiaCompleta?.content && <Section title={bio.biografiaCompleta.title || "Biografia Completa"} content={bio.biografiaCompleta.content} image={bio.biografiaCompleta.image} />}

        {bio?.areasAtuacao?.items?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">{bio.areasAtuacao.title || "Áreas de Atuação"}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bio.areasAtuacao.items.map((a: any, i: number) => (
                <div key={i} className="border rounded-xl p-6 shadow-sm" style={{ borderRadius: theme.borderRadius }}>
                  <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                  <p className="text-sm opacity-70">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {bio?.compromissos?.items?.length > 0 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">{bio.compromissos.title || "Compromissos Principais"}</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {bio.compromissos.items.map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg border text-left" style={{ borderRadius: theme.borderRadius }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: theme.primaryColor }}>
                    {i + 1}
                  </div>
                  <span className="font-medium">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bio?.reconhecimentos?.items?.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">{bio.reconhecimentos.title || "Reconhecimentos"}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bio.reconhecimentos.items.map((r: any, i: number) => (
                <div key={i} className="text-center p-6 border rounded-xl" style={{ borderRadius: theme.borderRadius }}>
                  {r.image && <img src={r.image} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />}
                  <h3 className="font-bold">{r.title}</h3>
                  <p className="text-sm opacity-70 mt-1">{r.description}</p>
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
