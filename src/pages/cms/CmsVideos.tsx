import React, { useState, useEffect } from "react";
import { getData, setData, generateId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Edit, Video, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoItem {
  id: string;
  title: string;
  url: string;
  platform: "youtube" | "tiktok" | "instagram";
  description: string;
}

const detectPlatform = (url: string): "youtube" | "tiktok" | "instagram" => {
  if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";
  if (url.includes("tiktok")) return "tiktok";
  if (url.includes("instagram")) return "instagram";
  return "youtube";
};

const getEmbedUrl = (url: string, platform: string): string => {
  if (platform === "youtube") {
    const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }
  return url;
};

const platformColors: Record<string, string> = {
  youtube: "bg-red-100 text-red-700",
  tiktok: "bg-gray-100 text-gray-700",
  instagram: "bg-pink-100 text-pink-700",
};

const CmsVideos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<VideoItem>>({});
  const { toast } = useToast();

  useEffect(() => {
    setVideos(getData("videos", []));
  }, []);

  const save = (items: VideoItem[]) => {
    setData("videos", items);
    toast({ title: "Salvo!" });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ title: "", url: "", platform: "youtube", description: "" });
  };

  const startEdit = (v: VideoItem) => {
    setEditingId(v.id);
    setForm(v);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveItem = () => {
    if (!form.title || !form.url) return;
    const platform = detectPlatform(form.url || "");
    let updated: VideoItem[];
    if (editingId === "new") {
      updated = [...videos, { ...form, id: generateId(), platform } as VideoItem];
    } else {
      updated = videos.map((v) => (v.id === editingId ? { ...v, ...form, platform } as VideoItem : v));
    }
    setVideos(updated);
    save(updated);
    cancelEdit();
  };

  const deleteItem = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    save(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vídeos</h1>
          <p className="text-muted-foreground">Adicione vídeos do YouTube, TikTok e Instagram</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Novo Vídeo</Button>
      </div>

      {editingId && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Novo Vídeo" : "Editar Vídeo"}</h2>
          <div>
            <label className="cms-label">Título</label>
            <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do vídeo" />
          </div>
          <div>
            <label className="cms-label">URL do Vídeo</label>
            <Input value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value, platform: detectPlatform(e.target.value) })} placeholder="https://youtube.com/watch?v=..." />
            {form.url && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[form.platform || "youtube"]}`}>
                {form.platform?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <label className="cms-label">Descrição</label>
            <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição" />
          </div>
          {form.url && form.platform === "youtube" && (
            <div>
              <label className="cms-label">Preview</label>
              <iframe src={getEmbedUrl(form.url, "youtube")} className="w-full aspect-video rounded-lg border" allowFullScreen />
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={saveItem}><Save className="h-4 w-4 mr-2" /> Salvar</Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.length === 0 && (
          <div className="col-span-full cms-card text-center py-12 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum vídeo cadastrado.</p>
          </div>
        )}
        {videos.map((v) => (
          <div key={v.id} className="cms-card space-y-3">
            {v.platform === "youtube" && (
              <iframe src={getEmbedUrl(v.url, "youtube")} className="w-full aspect-video rounded-lg" allowFullScreen />
            )}
            {v.platform !== "youtube" && (
              <div className="w-full aspect-video rounded-lg bg-secondary flex items-center justify-center">
                <a href={v.url} target="_blank" rel="noopener" className="flex items-center gap-2 text-primary hover:underline">
                  <ExternalLink className="h-5 w-5" /> Abrir no {v.platform}
                </a>
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[v.platform]}`}>{v.platform.toUpperCase()}</span>
                <h3 className="font-medium text-foreground mt-1">{v.title}</h3>
                {v.description && <p className="text-sm text-muted-foreground">{v.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button onClick={() => startEdit(v)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => deleteItem(v.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsVideos;
