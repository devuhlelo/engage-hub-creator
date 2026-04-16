import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getPublicBiografia } from "@/lib/api";
import { User, Loader2 } from "lucide-react";

const SiteBiografia: React.FC = () => {
  const { theme, siteId } = useOutletContext<any>();
  const [bio, setBio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicBiografia(siteId).then(setBio).catch(() => {}).finally(() => setLoading(false));
  }, [siteId]);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        {bio?.imagem && <><img src={bio.imagem} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0" style={{ background: theme.secondaryColor, opacity: 0.7 }} /></>}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Biografia</h1>
          <p className="text-lg mt-4 opacity-80">Conheça nossa história e trajetória</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${theme.primaryColor}15` }}>
              <User className="h-6 w-6" style={{ color: theme.primaryColor }} />
            </div>
            <h2 className="text-3xl font-bold mb-6">{bio?.titulo || "Minha História"}</h2>
            <div className="prose max-w-none opacity-80 leading-relaxed" dangerouslySetInnerHTML={{ __html: bio?.texto_biografia || "<p>Configure a biografia no painel CMS.</p>" }} />
          </div>
          {bio?.imagem && (
            <div><img src={bio.imagem} alt="" className="rounded-2xl shadow-xl w-full" /></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteBiografia;