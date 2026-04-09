import React, { useState, useEffect } from "react";
import { getData, setData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BioData {
  banner: string;
  quemSouTitle: string;
  quemSouContent: string;
  quemSouImage: string;
  objetivoCampanha: string;
  biografiaCompleta: string;
  areasAtuacao: { id: string; title: string; description: string }[];
  compromissos: { id: string; title: string; description: string }[];
  reconhecimentos: { id: string; title: string; year: string; description: string }[];
}

const defaultBio: BioData = {
  banner: "",
  quemSouTitle: "Quem eu sou?",
  quemSouContent: "",
  quemSouImage: "",
  objetivoCampanha: "",
  biografiaCompleta: "",
  areasAtuacao: [{ id: "1", title: "", description: "" }],
  compromissos: [{ id: "1", title: "", description: "" }],
  reconhecimentos: [{ id: "1", title: "", year: "", description: "" }],
};

const CmsBiografia = () => {
  const [data, setFormData] = useState<BioData>(defaultBio);
  const { toast } = useToast();
  const [activeBlock, setActiveBlock] = useState("banner");

  useEffect(() => {
    setFormData(getData("biografia", defaultBio));
  }, []);

  const save = () => {
    setData("biografia", data);
    toast({ title: "Salvo!", description: "Biografia atualizada com sucesso." });
  };

  const update = <K extends keyof BioData>(key: K, value: BioData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const blocks = [
    { id: "banner", label: "Banner" },
    { id: "quemsou", label: "Quem eu sou?" },
    { id: "objetivo", label: "Objetivo de Campanha" },
    { id: "bio", label: "Biografia Completa" },
    { id: "areas", label: "Áreas de Atuação" },
    { id: "compromissos", label: "Compromissos" },
    { id: "reconhecimentos", label: "Reconhecimentos" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biografia</h1>
          <p className="text-muted-foreground">Gerencie sua história e trajetória</p>
        </div>
        <Button onClick={save} className="gap-2">
          <Save className="h-4 w-4" /> Salvar
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {blocks.map((b) => (
          <button key={b.id} onClick={() => setActiveBlock(b.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeBlock === b.id ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground hover:text-foreground"}`}>
            {b.label}
          </button>
        ))}
      </div>

      {activeBlock === "banner" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Banner da Biografia</h2>
          <ImageUpload value={data.banner} onChange={(v) => update("banner", v)} label="Imagem do Banner" aspectHint="Recomendado: 1920x400px" />
        </div>
      )}

      {activeBlock === "quemsou" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Quem eu sou?</h2>
          <Input value={data.quemSouTitle} onChange={(e) => update("quemSouTitle", e.target.value)} placeholder="Título" />
          <ImageUpload value={data.quemSouImage} onChange={(v) => update("quemSouImage", v)} label="Foto pessoal" />
          <div>
            <label className="cms-label">Conteúdo</label>
            <RichTextEditor value={data.quemSouContent} onChange={(v) => update("quemSouContent", v)} placeholder="Conte quem você é..." />
          </div>
        </div>
      )}

      {activeBlock === "objetivo" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Objetivo de Campanha</h2>
          <RichTextEditor value={data.objetivoCampanha} onChange={(v) => update("objetivoCampanha", v)} placeholder="Descreva os objetivos da campanha..." />
        </div>
      )}

      {activeBlock === "bio" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Biografia Completa</h2>
          <RichTextEditor value={data.biografiaCompleta} onChange={(v) => update("biografiaCompleta", v)} placeholder="Escreva sua biografia completa..." />
        </div>
      )}

      {activeBlock === "areas" && (
        <div className="cms-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="cms-section-title mb-0"><CheckCircle className="h-5 w-5 text-primary inline mr-2" />Áreas de Atuação</h2>
            <Button onClick={() => update("areasAtuacao", [...data.areasAtuacao, { id: Date.now().toString(), title: "", description: "" }])} variant="outline" size="sm">+ Adicionar</Button>
          </div>
          {data.areasAtuacao.map((a, i) => (
            <div key={a.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between"><span className="text-sm font-medium">Área {i + 1}</span>
                <Button onClick={() => update("areasAtuacao", data.areasAtuacao.filter((x) => x.id !== a.id))} variant="ghost" size="sm" className="text-destructive">Remover</Button>
              </div>
              <Input placeholder="Título" value={a.title} onChange={(e) => update("areasAtuacao", data.areasAtuacao.map((x) => x.id === a.id ? { ...x, title: e.target.value } : x))} />
              <RichTextEditor value={a.description} onChange={(v) => update("areasAtuacao", data.areasAtuacao.map((x) => x.id === a.id ? { ...x, description: v } : x))} />
            </div>
          ))}
        </div>
      )}

      {activeBlock === "compromissos" && (
        <div className="cms-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="cms-section-title mb-0"><CheckCircle className="h-5 w-5 text-primary inline mr-2" />Compromissos Principais</h2>
            <Button onClick={() => update("compromissos", [...data.compromissos, { id: Date.now().toString(), title: "", description: "" }])} variant="outline" size="sm">+ Adicionar</Button>
          </div>
          {data.compromissos.map((c, i) => (
            <div key={c.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between"><span className="text-sm font-medium">Compromisso {i + 1}</span>
                <Button onClick={() => update("compromissos", data.compromissos.filter((x) => x.id !== c.id))} variant="ghost" size="sm" className="text-destructive">Remover</Button>
              </div>
              <Input placeholder="Título" value={c.title} onChange={(e) => update("compromissos", data.compromissos.map((x) => x.id === c.id ? { ...x, title: e.target.value } : x))} />
              <RichTextEditor value={c.description} onChange={(v) => update("compromissos", data.compromissos.map((x) => x.id === c.id ? { ...x, description: v } : x))} />
            </div>
          ))}
        </div>
      )}

      {activeBlock === "reconhecimentos" && (
        <div className="cms-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="cms-section-title mb-0"><CheckCircle className="h-5 w-5 text-primary inline mr-2" />Reconhecimentos</h2>
            <Button onClick={() => update("reconhecimentos", [...data.reconhecimentos, { id: Date.now().toString(), title: "", year: "", description: "" }])} variant="outline" size="sm">+ Adicionar</Button>
          </div>
          {data.reconhecimentos.map((r, i) => (
            <div key={r.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between"><span className="text-sm font-medium">Reconhecimento {i + 1}</span>
                <Button onClick={() => update("reconhecimentos", data.reconhecimentos.filter((x) => x.id !== r.id))} variant="ghost" size="sm" className="text-destructive">Remover</Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Título" value={r.title} onChange={(e) => update("reconhecimentos", data.reconhecimentos.map((x) => x.id === r.id ? { ...x, title: e.target.value } : x))} />
                <Input placeholder="Ano" value={r.year} onChange={(e) => update("reconhecimentos", data.reconhecimentos.map((x) => x.id === r.id ? { ...x, year: e.target.value } : x))} />
              </div>
              <RichTextEditor value={r.description} onChange={(v) => update("reconhecimentos", data.reconhecimentos.map((x) => x.id === r.id ? { ...x, description: v } : x))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CmsBiografia;
