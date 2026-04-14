import React, { useState, useEffect } from "react";
import { getPosts, createPost, updatePost, deletePost, getCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Proposta {
  id: number;
  eixo: string;
  title: string;
  resumo: string;
  content: string;
  image: string;
  category_id?: number;
}

const CmsPropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedEixo, setSelectedEixo] = useState("todos");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Partial<Proposta>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [posts, cats] = await Promise.all([
        getPosts("proposta"),
        getCategories(),
      ]);
      setPropostas(posts);
      setCategorias(cats);
    } catch {
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ eixo: categorias[0]?.name || "", title: "", resumo: "", content: "", image: "", category_id: categorias[0]?.id });
  };

  const startEdit = (p: Proposta) => {
    setEditingId(p.id);
    setForm(p);
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveItem = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        await createPost({ ...form, type: "proposta", status: "published" });
      } else {
        await updatePost(editingId as number, { ...form, type: "proposta" });
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
      setPropostas(propostas.filter((p) => p.id !== id));
      toast({ title: "Removido!" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const allEixos = [...new Set(categorias.map((c) => c.name))].filter(Boolean);
  const filtered = selectedEixo === "todos" ? propostas : propostas.filter((p) => p.eixo === selectedEixo);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propostas</h1>
          <p className="text-muted-foreground">Gerencie propostas organizadas por eixo</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Proposta</Button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setSelectedEixo("todos")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedEixo === "todos" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>
          Todos ({propostas.length})
        </button>
        {allEixos.map((e) => (
          <button key={e} onClick={() => setSelectedEixo(e)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedEixo === e ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>
            {e} ({propostas.filter((p) => p.eixo === e).length})
          </button>
        ))}
      </div>

      {editingId !== null && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Nova Proposta" : "Editar Proposta"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="cms-label">Categoria / Eixo</label>
              <select className="cms-input" value={form.category_id || ""} onChange={(e) => {
                const cat = categorias.find((c) => c.id === Number(e.target.value));
                setForm({ ...form, category_id: Number(e.target.value), eixo: cat?.name || "" });
              }}>
                <option value="">Selecione...</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="cms-label">Título</label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          </div>
          <div><label className="cms-label">Resumo</label><Input value={form.resumo || ""} onChange={(e) => setForm({ ...form, resumo: e.target.value })} placeholder="Breve resumo da proposta" /></div>
          <ImageUpload value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} label="Imagem da Proposta" />
          <div><label className="cms-label">Conteúdo Completo</label><RichTextEditor value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} /></div>
          <div className="flex gap-2">
            <Button onClick={saveItem} className="gap-2" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
            </Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="cms-card text-center py-12 text-muted-foreground">
            <p>Nenhuma proposta cadastrada{selectedEixo !== "todos" ? ` no eixo "${selectedEixo}"` : ""}.</p>
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="cms-card flex items-center gap-4">
            {p.image && <img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.eixo}</span>
              <h3 className="font-medium text-foreground mt-1 truncate">{p.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{p.resumo}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button onClick={() => startEdit(p)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button onClick={() => removeItem(p.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsPropostas;
