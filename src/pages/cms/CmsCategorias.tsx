import React, { useState, useEffect } from "react";
import { getData, setData, generateId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Edit, Tag, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  descricao: string;
}

const defaultColors = [
  "#2563eb", "#dc2626", "#16a34a", "#9333ea",
  "#ea580c", "#0891b2", "#4f46e5", "#be185d",
];

const CmsCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Categoria>>({});
  const { toast } = useToast();

  useEffect(() => {
    setCategorias(getData("categorias", []));
  }, []);

  const save = (items: Categoria[]) => {
    setData("categorias", items);
    toast({ title: "Categorias salvas!" });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ nome: "", cor: defaultColors[categorias.length % defaultColors.length], descricao: "" });
  };

  const startEdit = (c: Categoria) => {
    setEditingId(c.id);
    setForm(c);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveItem = () => {
    if (!form.nome) return;
    let updated: Categoria[];
    if (editingId === "new") {
      updated = [...categorias, { ...form, id: generateId() } as Categoria];
    } else {
      updated = categorias.map((c) => (c.id === editingId ? { ...c, ...form } as Categoria : c));
    }
    setCategorias(updated);
    save(updated);
    cancelEdit();
  };

  const deleteItem = (id: string) => {
    const updated = categorias.filter((c) => c.id !== id);
    setCategorias(updated);
    save(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">Categorias compartilhadas entre Propostas e Vídeos</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Categoria</Button>
      </div>

      {editingId && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Nova Categoria" : "Editar Categoria"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="cms-label">Nome da Categoria</label>
              <Input
                value={form.nome || ""}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Saúde, Educação, Tecnologia..."
              />
            </div>
            <div>
              <label className="cms-label">Cor</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.cor || "#2563eb"}
                  onChange={(e) => setForm({ ...form, cor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer p-0.5"
                />
                <div className="flex gap-1.5 flex-wrap">
                  {defaultColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm({ ...form, cor: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.cor === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="cms-label">Descrição (opcional)</label>
            <Input
              value={form.descricao || ""}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Breve descrição da categoria"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveItem} className="gap-2"><Save className="h-4 w-4" /> Salvar</Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.length === 0 && !editingId && (
          <div className="col-span-full cms-card text-center py-12 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma categoria cadastrada.</p>
            <p className="text-sm mt-1">Crie categorias para organizar suas Propostas e Vídeos.</p>
          </div>
        )}
        {categorias.map((c) => (
          <div key={c.id} className="cms-card flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
              style={{ background: c.cor }}
            >
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{c.nome}</h3>
              {c.descricao && <p className="text-sm text-muted-foreground truncate">{c.descricao}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button onClick={() => startEdit(c)} variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              <Button onClick={() => deleteItem(c.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsCategorias;
