import React, { useState, useEffect } from "react";
// Importamos apenas o objeto 'api' para evitar erros de "export not found"
import { api } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Edit, BookOpen, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CmsLivros() {
  const [livros, setLivros] = useState([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadLivros = async () => {
    try {
      setLoading(true);
      // Usando a estrutura exata do seu api.ts
      const data = await api.getPosts(1, 'livro');
      setLivros(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao carregar livros", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLivros();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ajustado para os campos do seu banco
      await api.createPost({ 
        site_id: 1, 
        type: 'livro', 
        title, 
        content, 
        status: 'published' 
      });
      
      toast({ title: "Sucesso!", description: "Livro salvo no acervo." });
      setEditingId(null);
      setTitle("");
      setContent("");
      loadLivros();
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER DESIGN SISGEN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Livros</h1>
          <p className="text-muted-foreground">Biblioteca de obras escritas e recomendadas.</p>
        </div>
        <Button onClick={() => { setEditingId("new"); setTitle(""); setContent(""); }} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Novo Livro
        </Button>
      </div>

      {/* FORMULÁRIO COM DESIGN RESTAURADO */}
      {editingId !== null && (
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="bg-muted/50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-foreground">
              {editingId === "new" ? "Cadastrar Novo Livro" : "Editar Livro"}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título do Livro</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Título da obra" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição ou Link</label>
              <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Sinopse ou link de referência..." 
                rows={4} 
                required 
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Confirmar e Salvar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* GRID DE CARDS DESIGN ORIGINAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livros.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground">Nenhum livro cadastrado.</p>
          </div>
        ) : (
          livros.map((livro: any) => (
            <div key={livro.id} className="group bg-card border rounded-xl p-5 hover:shadow-md transition-all border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => { if(confirm("Deseja excluir?")) api.deletePost(livro.id).then(loadLivros) }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1">{livro.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {livro.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}