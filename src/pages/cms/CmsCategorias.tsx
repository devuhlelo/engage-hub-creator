import React, { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Edit, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Categoria {
  id: number;
  name: string;
  color: string;
  description: string;
}

const defaultColors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#4f46e5", "#be185d"];

const CmsCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Partial<Categoria>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setCategorias(await getCategories());
    } catch {
      toast({ title: "Erro ao carregar categorias", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const startNew = () => {
    setEditingId("new");
    setForm({ name: "", color: defaultColors[categorias.length % defaultColors.length], description: "" });
  };
  const startEdit = (c: Categoria) => { setEditingId(c.id); setForm(c); };
  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveItem = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        await createCategory({ name: form.name!, color: form.color, description: form.description });
      } else {
        await updateCategory(editingId as number, { name: form.name, color: form.color, description: form.description });
      }
      toast({ title: "Categorias salvas!" });
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
      await deleteCategory(id);
      setCategorias(categorias.filter((c) => c.id !== id));
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
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">Categorias compartilhadas entre Propostas e Vídeos</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Categoria</Button>
      </div>

      {editingId !== null && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Nova Categoria" : "Editar Categoria"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="cms-label">Nome da Categoria</label><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Saúde, Educação..." /></div>
            <div>
              <label className="cms-label">Cor</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color || "#2563eb"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border border-input cursor-pointer p-0.5" />
                <div className="flex gap-1.5 flex-wrap">
                  {defaultColors.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div><label className="cms-label">Descrição (opcional)</label><Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição da categoria" /></div>
          <div className="flex gap-2">
            <Button onClick={saveItem} className="gap-2" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
            </Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.length === 0 && editingId === null && (
          <div className="col-span-full cms-card text-center py-12 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma categoria cadastrada.</p>
            <p className="text-sm mt-1">Crie categorias para organizar suas Propostas e Vídeos.</p>
          </div>
        )}
        {categorias.map((c) => (
          <div key={c.id} className="cms-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: c.color }}>
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{c.name}</h3>
              {c.description && <p className="text-sm text-muted-foreground truncate">{c.description}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button onClick={() => startEdit(c)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button onClick={() => removeItem(c.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsCategorias;
