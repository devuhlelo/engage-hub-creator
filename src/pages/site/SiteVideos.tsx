import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";
import { ExternalLink } from "lucide-react";

const getEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

const SiteVideos: React.FC = () => {
  const { theme } = useOutletContext<any>();
  const videos = useMemo(() => getData<any[]>("videos", []), []);

  return (
    <div>
      <section className="py-16 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Vídeos</h1>
          <p className="opacity-75">Acompanhe nossos vídeos nas redes sociais</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="border rounded-xl overflow-hidden shadow-sm" style={{ borderRadius: theme.borderRadius }}>
              {v.platform === "youtube" ? (
                <iframe src={getEmbedUrl(v.url)} className="w-full aspect-video" allowFullScreen />
              ) : (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener"
                  className="w-full aspect-video flex items-center justify-center gap-2 text-sm font-medium"
                  style={{ background: `${theme.primaryColor}10`, color: theme.primaryColor }}
                >
                  <ExternalLink className="h-5 w-5" /> Abrir no {v.platform}
                </a>
              )}
              <div className="p-4">
                <h3 className="font-bold">{v.title}</h3>
                {v.description && <p className="text-sm opacity-70 mt-1">{v.description}</p>}
              </div>
            </div>
          ))}
        </div>
        {videos.length === 0 && <p className="text-center opacity-50 py-12">Nenhum vídeo disponível.</p>}
      </div>
    </div>
  );
};

export default SiteVideos;
