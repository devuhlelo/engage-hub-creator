import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getVideos } from "@/lib/api";
import { ExternalLink, Video, Loader2 } from "lucide-react";

const getEmbedUrl = (url: string): string => {
  const match = url?.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

const SiteVideos: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos().then(setVideos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Vídeos</h1>
          <p className="text-lg mt-4 opacity-80">Acompanhe nossos vídeos nas redes sociais</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v) => {
            const embedUrl = getEmbedUrl(v.url_video);
            return (
              <div key={v.id} className="group border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ borderRadius: theme.borderRadius }}>
                {embedUrl ? (
                  <iframe src={embedUrl} className="w-full aspect-video" allowFullScreen />
                ) : (
                  <a href={v.url_video} target="_blank" rel="noopener" className="w-full aspect-video flex flex-col items-center justify-center gap-3 hover:opacity-80 transition-opacity" style={{ background: `${theme.primaryColor}08` }}>
                    <span className="text-4xl">🎬</span>
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.primaryColor }}><ExternalLink className="h-4 w-4" /> Abrir vídeo</span>
                  </a>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg">{v.titulo}</h3>
                  {v.descricao && <p className="text-sm opacity-70 mt-2 leading-relaxed">{v.descricao}</p>}
                </div>
              </div>
            );
          })}
        </div>
        {videos.length === 0 && (
          <div className="text-center py-20"><Video className="h-16 w-16 mx-auto opacity-15 mb-4" /><p className="text-lg opacity-50">Nenhum vídeo disponível.</p></div>
        )}
      </div>
    </div>
  );
};

export default SiteVideos;
