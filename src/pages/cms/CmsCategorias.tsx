import React, { useState, useEffect } from "react";
import { getCategories, createCategory, deleteCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Categoria {
  id: number;
  nome: string;
}

const CmsCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const data = await getCategories();
      setCategorias(data);
    } catch {
      toast({ title: "Erro ao carregar categorias", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!nome.trim()) return;
    setSaving(true);
    try {
      await createCategory({ nome: nome.trim() });
      toast({ title: "Categoria criada!" });
      setNome("");
      await loadData();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: number) => {
    if (!confirm("Excluir esta categoria?")) return;
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
      </div>

      <div className="cms-card mb-6 space-y-4">
        <h2 className="cms-section-title">Nova Categoria</h2>
        <div className="flex gap-3">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da categoria (ex: Saúde, Educação)" className="max-w-md" onKeyDown={(e) => e.key === "Enter" && handleSave()} />
          <Button onClick={handleSave} className="gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Adicionar
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.length === 0 && (
          <div className="col-span-full cms-card text-center py-12 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma categoria cadastrada.</p>
          </div>
        )}
        {categorias.map((c) => (
          <div key={c.id} className="cms-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{c.nome}</h3>
            </div>
            <Button onClick={() => removeItem(c.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsCategorias;
