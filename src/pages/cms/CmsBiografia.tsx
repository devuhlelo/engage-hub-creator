import React, { useState, useEffect, useRef } from "react";
import { getBiografia, saveBiografia } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import { Save, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CmsBiografia = () => {
  const [titulo, setTitulo] = useState("");
  const [textoBiografia, setTextoBiografia] = useState("");
  const [fotoAtual, setFotoAtual] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    getBiografia().then((data) => {
      if (data) {
        setTitulo(data.titulo || "");
        setTextoBiografia(data.texto_biografia || "");
        setFotoAtual(data.imagem || "");
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveBiografia({
        titulo,
        texto_biografia: textoBiografia,
        imagem: imagem || undefined,
        foto_atual: fotoAtual || undefined,
      });
      toast({ title: "Biografia salva com sucesso!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biografia</h1>
          <p className="text-muted-foreground">Gerencie sua história e trajetória</p>
        </div>
        <Button onClick={save} className="gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
        </Button>
      </div>

      <div className="cms-card space-y-6">
        <div className="space-y-2">
          <label className="cms-label">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Minha História" />
        </div>

        <div className="space-y-2">
          <label className="cms-label">Foto</label>
          {fotoAtual && !imagem && <img src={fotoAtual} alt="Foto atual" className="w-40 h-40 object-cover rounded-lg mb-2" />}
          {imagem && <p className="text-sm text-muted-foreground mb-2">Nova imagem: {imagem.name}</p>}
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> {imagem ? "Trocar imagem" : "Selecionar imagem"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImagem(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-2">
          <label className="cms-label">Texto da Biografia</label>
          <RichTextEditor value={textoBiografia} onChange={setTextoBiografia} placeholder="Conte sua história..." />
        </div>
      </div>
    </div>
  );
};

export default CmsBiografia;
