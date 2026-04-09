import React, { useState, useEffect } from "react";
import { getData, setData, generateId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, Plus, Trash2, Edit, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Proposta {
  id: string;
  eixo: string;
  title: string;
  resumo: string;
  content: string;
  image: string;
  order: number;
}

const CmsPropostas = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [eixos, setEixos] = useState<string[]>([]);
  const [novoEixo, setNovoEixo] = useState("");
  const [selectedEixo, setSelectedEixo] = useState("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Proposta>>({});
  const { toast } = useToast();

  useEffect(() => {
    setPropostas(getData("propostas", []));
    setEixos(getData("eixos", ["Saúde", "Educação", "Segurança", "Economia"]));
  }, []);

  const save = (newPropostas: Proposta[], newEixos?: string[]) => {
    setData("propostas", newPropostas);
    if (newEixos) setData("eixos", newEixos);
    toast({ title: "Salvo!" });
  };

  const addEixo = () => {
    if (!novoEixo.trim()) return;
    const updated = [...eixos, novoEixo.trim()];
    setEixos(updated);
    setNovoEixo("");
    save(propostas, updated);
  };

  const removeEixo = (e: string) => {
    const updated = eixos.filter((x) => x !== e);
    setEixos(updated);
    save(propostas, updated);
  };

  const startNew = () => {
    setEditingId("new");
    setForm({ eixo: eixos[0] || "", title: "", resumo: "", content: "", image: "" });
  };

  const startEdit = (p: Proposta) => {
    setEditingId(p.id);
    setForm(p);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveItem = () => {
    if (!form.title || !form.eixo) return;
    let updated: Proposta[];
    if (editingId === "new") {
      updated = [...propostas, { ...form, id: generateId(), order: propostas.length } as Proposta];
    } else {
      updated = propostas.map((p) => (p.id === editingId ? { ...p, ...form } as Proposta : p));
    }
    setPropostas(updated);
    save(updated);
    cancelEdit();
  };

  const deleteItem = (id: string) => {
    const updated = propostas.filter((p) => p.id !== id);
    setPropostas(updated);
    save(updated);
  };

  const filtered = selectedEixo === "todos" ? propostas : propostas.filter((p) => p.eixo === selectedEixo);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propostas</h1>
          <p className="text-muted-foreground">Gerencie propostas organizadas por eixo</p>
        </div>
        <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> Nova Proposta</Button>
      </div>

      {/* Eixos */}
      <div className="cms-card mb-6">
        <h2 className="cms-section-title">Eixos Temáticos</h2>
        <div className="flex gap-2 flex-wrap mb-3">
          {eixos.map((e) => (
            <span key={e} className="inline-flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm">
              {e}
              <button onClick={() => removeEixo(e)} className="text-muted-foreground hover:text-destructive ml-1"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={novoEixo} onChange={(e) => setNovoEixo(e.target.value)} placeholder="Novo eixo..." className="max-w-xs" onKeyDown={(e) => e.key === "Enter" && addEixo()} />
          <Button onClick={addEixo} variant="outline" size="sm">Adicionar Eixo</Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setSelectedEixo("todos")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedEixo === "todos" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>
          Todos ({propostas.length})
        </button>
        {eixos.map((e) => (
          <button key={e} onClick={() => setSelectedEixo(e)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedEixo === e ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>
            {e} ({propostas.filter((p) => p.eixo === e).length})
          </button>
        ))}
      </div>

      {/* Editor */}
      {editingId && (
        <div className="cms-card mb-6 space-y-4 ring-2 ring-primary/20">
          <h2 className="cms-section-title">{editingId === "new" ? "Nova Proposta" : "Editar Proposta"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="cms-label">Eixo</label>
              <select className="cms-input" value={form.eixo} onChange={(e) => setForm({ ...form, eixo: e.target.value })}>
                {eixos.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="cms-label">Título</label>
              <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="cms-label">Resumo</label>
            <Input value={form.resumo || ""} onChange={(e) => setForm({ ...form, resumo: e.target.value })} placeholder="Breve resumo da proposta" />
          </div>
          <ImageUpload value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} label="Imagem da Proposta" />
          <div>
            <label className="cms-label">Conteúdo Completo</label>
            <RichTextEditor value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveItem} className="gap-2"><Save className="h-4 w-4" /> Salvar</Button>
            <Button onClick={cancelEdit} variant="outline">Cancelar</Button>
          </div>
        </div>
      )}

      {/* List */}
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
              <Button onClick={() => deleteItem(p.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmsPropostas;
