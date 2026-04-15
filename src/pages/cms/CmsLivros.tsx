import React, { useState, useEffect, useRef } from "react";
import { getLivros, createLivro, deleteLivro } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, X, BookOpen, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CmsLivros() {
  const [livros, setLivros] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<"new" | null>(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadData = async () => {
    try { setLivros(await getLivros()); } catch { toast({ title: "Erro ao carregar", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setSaving(true);
    try {
      await createLivro({ titulo, autor, resumo, imagem: imagem || undefined });
      toast({ title: "Livro salvo!" });
      setEditingId(null); setTitulo(""); setAutor(""); setResumo(""); setImagem(null);
      await loadData();
    } catch { toast({ title: "Erro ao salvar", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este livro?")) return;
    try { await deleteLivro(id); await loadData(); toast({ title: "Excluído!" }); }
    catch { toast({ title: "Erro ao excluir", variant: "destructive" }); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Livros</h1>
          <p className="text-muted-foreground">Biblioteca de obras escritas e recomendadas.</p>
        </div>
        <Button onClick={() => { setEditingId("new"); setTitulo(""); setAutor(""); setResumo(""); setImagem(null); }} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Livro
        </Button>
      </div>

      {editingId !== null && (
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Cadastrar Livro</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título do livro" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Autor</label>
                <Input value={autor} onChange={(e) => setAutor(e.target.value)} placeholder="Nome do autor" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resumo</label>
              <Textarea value={resumo} onChange={(e) => setResumo(e.target.value)} placeholder="Sinopse do livro..." rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem da Capa</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" /> {imagem ? imagem.name : "Selecionar imagem"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImagem(e.target.files?.[0] || null)} />
              </div>
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
        {livros.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">Nenhum livro cadastrado.</p>
          </div>
        ) : livros.map((l: any) => (
          <div key={l.id} className="group bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all">
            {l.imagem && <img src={l.imagem} alt="" className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{l.titulo}</h3>
              {l.autor && <p className="text-sm text-muted-foreground">{l.autor}</p>}
              {l.resumo && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{l.resumo}</p>}
              <div className="flex justify-end mt-3">
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(l.id)}>
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
