import React, { useState, useEffect } from "react";
import { getCategories, getPropostas, createProposta, deleteProposta } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, X, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CmsPropostas = () => {
  const [propostas, setPropostas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("todos");
  const [editingId, setEditingId] = useState<"new" | null>(null);
  const [form, setForm] = useState({ titulo: "", descricao: "", categoria_id: 0, icone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([getPropostas(), getCategories()]);
      setPropostas(p);
      setCategorias(c);
    } catch {
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ titulo: "", descricao: "", categoria_id: categorias[0]?.id || 0, icone: "" });
  };

  const cancelEdit = () => { setEditingId(null); setForm({ titulo: "", descricao: "", categoria_id: 0, icone: "" }); };

  const saveItem = async () => {
    if (!form.titulo.trim()) {
      toast({ title: "Título é obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await createProposta(form);
      toast({ title: "Proposta salva!" });
      cancelEdit();
      await loadData();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta proposta?")) return;
    try { await deleteProposta(id); await loadData(); toast({ title: "Excluído!" }); }
    catch { toast({ title: "Erro ao excluir", variant: "destructive" }); }
  };

  const getCatName = (catId: number) => categorias.find(c => c.id === catId)?.nome || "Sem categoria";
  const filtered = selectedCat === "todos" ? propostas : propostas.filter(p => String(p.categoria_id) === selectedCat);

  if (loading) return <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary mb-2" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu plano de governo.</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Proposta</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setSelectedCat("todos")} className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${selectedCat === "todos" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
          Todos ({propostas.length})
        </button>
        {categorias.map((c) => (
          <button key={c.id} onClick={() => setSelectedCat(String(c.id))} className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${selectedCat === String(c.id) ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {c.nome}
          </button>
        ))}
      </div>

      {editingId !== null && (
        <div className="bg-card border rounded-xl shadow-xl overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500" /> Cadastrar Proposta</h2>
            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-5 w-5" /></Button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: Number(e.target.value) })}>
                  <option value={0}>Selecione...</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título da proposta" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ícone (ex: FaSchool)</label>
              <Input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} placeholder="Nome do ícone" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva a proposta..." rows={5} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={cancelEdit}>Cancelar</Button>
              <Button onClick={saveItem} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar Proposta
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">Nenhuma proposta encontrada.</p>
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="group bg-card border rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">{getCatName(p.categoria_id)}</span>
              <h3 className="font-bold text-lg">{p.titulo}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{p.descricao}</p>
            </div>
            <Button onClick={() => handleDelete(p.id)} variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsPropostas;
