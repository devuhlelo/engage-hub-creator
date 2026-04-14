import React, { useState, useEffect } from "react";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, Plus, Trash2, Edit, Newspaper, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Noticia {
  id: number;
  title: string;
  resumo: string;
  content: string;
  image: string;
  link: string;
  date: string;
  category: string;
}

const CmsNoticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Partial<Noticia>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setNoticias(await getPosts("noticia"));
    } catch {
      toast({ title: "Erro ao carregar notícias", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ title: "", resumo: "", content: "", image: "", link: "", date: new Date().toISOString().split("T")[0], category: "" });
  };
  const startEdit = (n: Noticia) => { setEditingId(n.id); setForm(n); };
  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveItem = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        await createPost({ ...form, type: "noticia", status: "published" });
      } else {
        await updatePost(editingId as number, { ...form, type: "noticia" });
      }
      toast({ title: "Salvo!" });
      cancelEdit();
      await loadData();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await deletePost(id);
      setNoticias(noticias.filter((n) => n.id !== id));
      toast({ title: "Removido!" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notícias</h1>
          <p className="text-muted-foreground">Publique e gerencie notícias</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Notícia</Button>
      </div>

      {editingId !== null && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Nova Notícia" : "Editar Notícia"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Título</label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="cms-label">Categoria</label><Input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Política, Saúde..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Data</label><Input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><label className="cms-label">Link Externo (opcional)</label><Input value={form.link || ""} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div><label className="cms-label">Resumo</label><Input value={form.resumo || ""} onChange={(e) => setForm({ ...form, resumo: e.target.value })} placeholder="Breve resumo para listagem" /></div>
          <ImageUpload value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} label="Imagem de Capa" aspectHint="Recomendado: 800x450px" />
          <div><label className="cms-label">Conteúdo</label><RichTextEditor value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} placeholder="Escreva a notícia completa..." /></div>
          <div className="flex gap-2">
            <Button onClick={saveItem} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Salvar</Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {noticias.length === 0 && (
          <div className="cms-card text-center py-12 text-muted-foreground">
            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma notícia cadastrada.</p>
          </div>
        )}
        {noticias.map((n) => (
          <div key={n.id} className="cms-card flex items-center gap-4">
            {n.image && <img src={n.image} alt="" className="w-20 h-14 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {n.category && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{n.category}</span>}
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <h3 className="font-medium text-foreground truncate">{n.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{n.resumo}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button onClick={() => startEdit(n)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button onClick={() => removeItem(n.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsNoticias;
