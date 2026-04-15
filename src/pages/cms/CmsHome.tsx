import React, { useState, useEffect } from "react";
import { getSetting, saveSetting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Save, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomeData {
  heroBanner: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  sobreTitle: string;
  sobreContent: string;
  sobreImage: string;
  bandeiras: { id: string; title: string; icon: string; description: string }[];
  diferenciais: { id: string; title: string; description: string }[];
  propostasTitle: string;
  propostasSubtitle: string;
  junteSeTitle: string;
  junteSeContent: string;
  junteSeButtonText: string;
  junteSeButtonLink: string;
  footerText: string;
  socialLinks: { facebook: string; instagram: string; twitter: string; youtube: string; tiktok: string };
}

const defaultHome: HomeData = {
  heroBanner: "", heroTitle: "", heroSubtitle: "",
  heroButtonText: "Saiba Mais", heroButtonLink: "",
  sobreTitle: "Sobre", sobreContent: "", sobreImage: "",
  bandeiras: [{ id: "1", title: "", icon: "", description: "" }],
  diferenciais: [{ id: "1", title: "", description: "" }],
  propostasTitle: "Nossas Propostas", propostasSubtitle: "",
  junteSeTitle: "Junte-se a Nós", junteSeContent: "",
  junteSeButtonText: "Participar", junteSeButtonLink: "",
  footerText: "",
  socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "", tiktok: "" },
};

const CmsHome = () => {
  const [data, setFormData] = useState<HomeData>(defaultHome);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [activeBlock, setActiveBlock] = useState("hero");

  useEffect(() => {
    getSetting("home", defaultHome).then((d) => {
      if (d) setFormData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveSetting("home", data);
      toast({ title: "Salvo com sucesso!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof HomeData>(key: K, value: HomeData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const blocks = [
    { id: "hero", label: "Hero / Banner" },
    { id: "sobre", label: "Sobre" },
    { id: "bandeiras", label: "Bandeiras" },
    { id: "diferenciais", label: "Diferenciais" },
    { id: "propostas", label: "Propostas" },
    { id: "juntese", label: "Junte-se a nós" },
    { id: "footer", label: "Footer" },
  ];

  const addBandeira = () => update("bandeiras", [...data.bandeiras, { id: Date.now().toString(), title: "", icon: "", description: "" }]);
  const removeBandeira = (id: string) => update("bandeiras", data.bandeiras.filter((b) => b.id !== id));
  const updateBandeira = (id: string, field: string, value: string) => update("bandeiras", data.bandeiras.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  const addDiferencial = () => update("diferenciais", [...data.diferenciais, { id: Date.now().toString(), title: "", description: "" }]);
  const removeDiferencial = (id: string) => update("diferenciais", data.diferenciais.filter((d) => d.id !== id));
  const updateDiferencial = (id: string, field: string, value: string) => update("diferenciais", data.diferenciais.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Página Inicial</h1>
          <p className="text-muted-foreground">Gerencie todos os blocos da página inicial</p>
        </div>
        <Button onClick={save} className="gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar Alterações
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {blocks.map((block) => (
          <button key={block.id} onClick={() => setActiveBlock(block.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeBlock === block.id ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground hover:text-foreground"}`}>
            {block.label}
          </button>
        ))}
      </div>

      {activeBlock === "hero" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Hero / Banner</h2>
          <ImageUpload value={data.heroBanner} onChange={(v) => update("heroBanner", v)} label="Imagem do Banner" aspectHint="Recomendado: 1920x600px" />
          <div><label className="cms-label">Título Principal</label><Input value={data.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} placeholder="Título do hero" /></div>
          <div><label className="cms-label">Subtítulo</label><Textarea value={data.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} placeholder="Subtítulo ou slogan" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Texto do Botão</label><Input value={data.heroButtonText} onChange={(e) => update("heroButtonText", e.target.value)} /></div>
            <div><label className="cms-label">Link do Botão</label><Input value={data.heroButtonLink} onChange={(e) => update("heroButtonLink", e.target.value)} placeholder="https://..." /></div>
          </div>
        </div>
      )}

      {activeBlock === "sobre" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Sobre</h2>
          <div><label className="cms-label">Título da Seção</label><Input value={data.sobreTitle} onChange={(e) => update("sobreTitle", e.target.value)} /></div>
          <ImageUpload value={data.sobreImage} onChange={(v) => update("sobreImage", v)} label="Foto" aspectHint="Recomendado: 600x600px" />
          <div><label className="cms-label">Conteúdo</label><RichTextEditor value={data.sobreContent} onChange={(v) => update("sobreContent", v)} placeholder="Conte sobre você..." /></div>
        </div>
      )}

      {activeBlock === "bandeiras" && (
        <div className="cms-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="cms-section-title flex items-center gap-2 mb-0"><CheckCircle className="h-5 w-5 text-primary" /> Bandeiras</h2>
            <Button onClick={addBandeira} variant="outline" size="sm">+ Adicionar</Button>
          </div>
          {data.bandeiras.map((b, i) => (
            <div key={b.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bandeira {i + 1}</span>
                <Button onClick={() => removeBandeira(b.id)} variant="ghost" size="sm" className="text-destructive">Remover</Button>
              </div>
              <Input placeholder="Título" value={b.title} onChange={(e) => updateBandeira(b.id, "title", e.target.value)} />
              <Input placeholder="Ícone (emoji)" value={b.icon} onChange={(e) => updateBandeira(b.id, "icon", e.target.value)} />
              <Textarea placeholder="Descrição" value={b.description} onChange={(e) => updateBandeira(b.id, "description", e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {activeBlock === "diferenciais" && (
        <div className="cms-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="cms-section-title flex items-center gap-2 mb-0"><CheckCircle className="h-5 w-5 text-primary" /> Diferenciais</h2>
            <Button onClick={addDiferencial} variant="outline" size="sm">+ Adicionar</Button>
          </div>
          {data.diferenciais.map((d, i) => (
            <div key={d.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Diferencial {i + 1}</span>
                <Button onClick={() => removeDiferencial(d.id)} variant="ghost" size="sm" className="text-destructive">Remover</Button>
              </div>
              <Input placeholder="Título" value={d.title} onChange={(e) => updateDiferencial(d.id, "title", e.target.value)} />
              <Textarea placeholder="Descrição" value={d.description} onChange={(e) => updateDiferencial(d.id, "description", e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {activeBlock === "propostas" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Seção Propostas (Início)</h2>
          <div><label className="cms-label">Título</label><Input value={data.propostasTitle} onChange={(e) => update("propostasTitle", e.target.value)} /></div>
          <div><label className="cms-label">Subtítulo</label><Textarea value={data.propostasSubtitle} onChange={(e) => update("propostasSubtitle", e.target.value)} /></div>
          <p className="text-sm text-muted-foreground">As propostas são gerenciadas na aba "Propostas" do menu lateral.</p>
        </div>
      )}

      {activeBlock === "juntese" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Junte-se a Nós</h2>
          <div><label className="cms-label">Título</label><Input value={data.junteSeTitle} onChange={(e) => update("junteSeTitle", e.target.value)} /></div>
          <div><label className="cms-label">Conteúdo</label><RichTextEditor value={data.junteSeContent} onChange={(v) => update("junteSeContent", v)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="cms-label">Texto do Botão</label><Input value={data.junteSeButtonText} onChange={(e) => update("junteSeButtonText", e.target.value)} /></div>
            <div><label className="cms-label">Link do Botão</label><Input value={data.junteSeButtonLink} onChange={(e) => update("junteSeButtonLink", e.target.value)} /></div>
          </div>
        </div>
      )}

      {activeBlock === "footer" && (
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Footer</h2>
          <div><label className="cms-label">Texto do Footer</label><Textarea value={data.footerText} onChange={(e) => update("footerText", e.target.value)} /></div>
          <div className="space-y-3">
            <label className="cms-label">Redes Sociais</label>
            <Input placeholder="Facebook" value={data.socialLinks.facebook} onChange={(e) => update("socialLinks", { ...data.socialLinks, facebook: e.target.value })} />
            <Input placeholder="Instagram" value={data.socialLinks.instagram} onChange={(e) => update("socialLinks", { ...data.socialLinks, instagram: e.target.value })} />
            <Input placeholder="Twitter/X" value={data.socialLinks.twitter} onChange={(e) => update("socialLinks", { ...data.socialLinks, twitter: e.target.value })} />
            <Input placeholder="YouTube" value={data.socialLinks.youtube} onChange={(e) => update("socialLinks", { ...data.socialLinks, youtube: e.target.value })} />
            <Input placeholder="TikTok" value={data.socialLinks.tiktok} onChange={(e) => update("socialLinks", { ...data.socialLinks, tiktok: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsHome;
