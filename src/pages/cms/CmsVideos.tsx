import React, { useState, useEffect } from 'react';
import { getVideos, createVideo, deleteVideo } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, X, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CmsVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<"new" | null>(null);
  const [titulo, setTitulo] = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try { setVideos(await getVideos()); } catch { toast({ title: "Erro ao carregar", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !urlVideo.trim()) return;
    setSaving(true);
    try {
      await createVideo({ titulo, url_video: urlVideo, descricao });
      toast({ title: "Vídeo salvo!" });
      setEditingId(null); setTitulo(''); setUrlVideo(''); setDescricao('');
      await loadData();
    } catch { toast({ title: "Erro ao salvar", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este vídeo?")) return;
    try { await deleteVideo(id); await loadData(); toast({ title: "Excluído!" }); }
    catch { toast({ title: "Erro ao excluir", variant: "destructive" }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Vídeos</h1>
          <p className="text-muted-foreground">Adicione vídeos do YouTube e outras plataformas.</p>
        </div>
        <Button onClick={() => setEditingId("new")} className="gap-2"><Plus className="h-4 w-4" /> Novo Vídeo</Button>
      </div>

      {editingId !== null && (
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Cadastrar Vídeo</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título do vídeo" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL do Vídeo</label>
              <Input value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Legenda do vídeo..." rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">Nenhum vídeo cadastrado.</p>
          </div>
        ) : videos.map((v: any) => (
          <div key={v.id} className="group bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{v.titulo}</h3>
              <p className="text-sm text-blue-600 truncate">{v.url_video}</p>
              {v.descricao && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.descricao}</p>}
              <div className="flex justify-end mt-3">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(v.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
