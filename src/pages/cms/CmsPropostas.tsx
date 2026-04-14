import React, { useState, useEffect } from "react";
import { getCategories, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, Plus, Trash2, Edit, Loader2, X, Lightbulb } from "lucide-react";
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
  const [categorias, setCategorias] = useState<any[]>([]); // Inicializado como array vazio
  const [selectedEixo, setSelectedEixo] = useState("todos");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Partial<Proposta>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, catsData] = await Promise.all([
        api.getPosts(1, "proposta"),
        getCategories(),
      ]);

      // GARANTIA: Se catsData não for array, vira array vazio para não dar tela branca
      setPropostas(Array.isArray(postsData) ? postsData : []);
      setCategorias(Array.isArray(catsData) ? catsData : []);
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
      setPropostas([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ 
      eixo: categorias[0]?.name || "Geral", 
      title: "", 
      resumo: "", 
      content: "", 
      image: "", 
      category_id: categorias[0]?.id || 0 
    });
  };

  const startEdit = (p: Proposta) => {
    setEditingId(p.id);
    setForm(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveItem = async () => {
    if (!form.title) {
      toast({ title: "Título é obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const postData = { ...form, type: "proposta", status: "published", site_id: 1 };
      
      if (editingId === "new") {
        await api.createPost(postData);
      } else {
        await api.updatePost(editingId as number, postData);
      }
      
      toast({ title: "Proposta salva!" });
      cancelEdit();
      await loadData();
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Proteção para evitar o erro .map() caso categorias venha errado
  const safeCategorias = Array.isArray(categorias) ? categorias : [];
  const allEixos = [...new Set(safeCategorias.map((c) => c.name))].filter(Boolean);
  const filtered = selectedEixo === "todos" ? propostas : propostas.filter((p) => p.eixo === selectedEixo);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-muted-foreground font-medium">Carregando...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu plano de governo.</p>
        </div>
        <Button onClick={startNew} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {/* FILTROS (Com proteção safeCategorias) */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedEixo("todos")} 
          className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${selectedEixo === "todos" ? "bg-primary text-white" : "bg-card"}`}
        >
          Todos ({propostas.length})
        </button>
        {allEixos.map((e) => (
          <button 
            key={e} 
            onClick={() => setSelectedEixo(e)} 
            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${selectedEixo === e ? "bg-primary text-white" : "bg-card"}`}
          >
            {e}
          </button>
        ))}
      </div>

      {editingId !== null && (
        <div className="bg-card border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-4">
          <div className="bg-muted/50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {editingId === "new" ? "Cadastrar Proposta" : "Editar Proposta"}
            </h2>
            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-5 w-5" /></Button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Eixo / Categoria</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category_id || ""} 
                  onChange={(e) => {
                    const cat = safeCategorias.find((c) => c.id === Number(e.target.value));
                    setForm({ ...form, category_id: Number(e.target.value), eixo: cat?.name || "" });
                  }}
                >
                  <option value="">Selecione...</option>
                  {safeCategorias.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resumo</label>
              <Input value={form.resumo || ""} onChange={(e) => setForm({ ...form, resumo: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <ImageUpload value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} label="Imagem" />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium">Conteúdo Detalhado</label>
                <RichTextEditor value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>
              <Button onClick={saveItem} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Proposta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* LISTAGEM */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div key={p.id} className="group bg-card border rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-5">
            <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
              {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Lightbulb className="m-auto text-muted-foreground/30" size={30} />}
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">{p.eixo}</span>
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{p.resumo}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => startEdit(p)} variant="secondary" size="sm"><Edit className="h-4 w-4 mr-2" /> Editar</Button>
              <Button onClick={() => { if(confirm("Excluir?")) api.deletePost(p.id).then(loadData) }} variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsPropostas;