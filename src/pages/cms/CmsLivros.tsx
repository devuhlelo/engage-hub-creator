import React, { useState, useEffect } from "react";
import { getPosts, createPost, updatePost, deletePost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { Save, Plus, Trash2, Edit, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Livro {
  id: number;
  title: string;
  author: string;
  description: string;
  cover: string;
  year: string;
  link: string;
  type: "escrito" | "recomendado";
}

const CmsLivros = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Partial<Livro>>({});
  const [filter, setFilter] = useState<"todos" | "escrito" | "recomendado">("todos");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLivros(await getPosts("livro"));
    } catch {
      toast({ title: "Erro ao carregar livros", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ title: "", author: "", description: "", cover: "", year: "", link: "", type: "escrito" });
  };
  const startEdit = (l: Livro) => { setEditingId(l.id); setForm(l); };
  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveItem = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      // Mapeamos os campos para o formato do posts.php
      const postData = {
        title: form.title,
        content: form.description || "",
        type: "livro",
        status: "published",
        // Campos extras via metadata ou campos customizados no seu backend
        author: form.author,
        cover: form.cover,
        year: form.year,
        link: form.link,
        livro_type: form.type,
      };
      if (editingId === "new") {
        await createPost(postData);
      } else {
        await updatePost(editingId as number, postData);
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
      setLivros(livros.filter((l) => l.id !== id));
      toast({ title: "Removido!" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const filtered = filter === "todos" ? livros : livros.filter((l) => l.type === filter);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Livros</h1>
          <p className="text-muted-foreground">Livros escritos e recomendados</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Novo Livro</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["todos", "escrito", "recomendado"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>
            {f === "todos" ? "Todos" : f === "escrito" ? "Escritos" : "Recomendados"}
          </button>
        ))}
      </div>

      {editingId !== null && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Novo Livro" : "Editar Livro"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Título</label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="cms-label">Autor</label><Input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Ano</label><Input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" /></div>
            <div><label className="cms-label">Tipo</label>
              <select className="cms-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "escrito" | "recomendado" })}>
                <option value="escrito">Escrito por mim</option>
                <option value="recomendado">Recomendado</option>
              </select>
            </div>
          </div>
          <div><label className="cms-label">Link de Compra (opcional)</label><Input value={form.link || ""} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
          <ImageUpload value={form.cover || ""} onChange={(v) => setForm({ ...form, cover: v })} label="Capa do Livro" aspectHint="Recomendado: 400x600px" />
          <div><label className="cms-label">Descrição</label><Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Sinopse ou descrição do livro..." rows={4} /></div>
          <div className="flex gap-2">
            <Button onClick={saveItem} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Salvar</Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full cms-card text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum livro cadastrado.</p>
          </div>
        )}
        {filtered.map((l) => (
          <div key={l.id} className="cms-card space-y-3">
            {l.cover && <img src={l.cover} alt={l.title} className="w-full h-48 object-cover rounded-lg" />}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.type === "escrito" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {l.type === "escrito" ? "Escrito" : "Recomendado"}
            </span>
            <h3 className="font-medium text-foreground">{l.title}</h3>
            <p className="text-sm text-muted-foreground">{l.author} {l.year && `• ${l.year}`}</p>
            <div className="flex gap-1">
              <Button onClick={() => startEdit(l)} variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1" /> Editar</Button>
              <Button onClick={() => removeItem(l.id)} variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4 mr-1" /> Remover</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsLivros;
