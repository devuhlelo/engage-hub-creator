import React, { useState, useEffect } from "react";
import { getSetting, saveSetting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContatoData {
  email: string;
  emailSecundario: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  horarioAtendimento: string;
  mapaEmbed: string;
  mensagemSucesso: string;
  assuntos: string[];
}

const defaultContato: ContatoData = {
  email: "", emailSecundario: "", telefone: "", whatsapp: "",
  endereco: "", horarioAtendimento: "", mapaEmbed: "",
  mensagemSucesso: "Mensagem enviada com sucesso!",
  assuntos: ["Informações", "Propostas", "Imprensa", "Outros"],
};

const CmsContato = () => {
  const [data, setFormData] = useState<ContatoData>(defaultContato);
  const [novoAssunto, setNovoAssunto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getSetting("contato", defaultContato).then((d) => {
      if (d) setFormData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveSetting("contato", data);
      toast({ title: "Salvo!", description: "Configurações de contato atualizadas." });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof ContatoData>(key: K, value: ContatoData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addAssunto = () => {
    if (!novoAssunto.trim()) return;
    update("assuntos", [...data.assuntos, novoAssunto.trim()]);
    setNovoAssunto("");
  };

  const removeAssunto = (i: number) => update("assuntos", data.assuntos.filter((_, idx) => idx !== i));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contato</h1>
          <p className="text-muted-foreground">Configure informações de contato e formulário</p>
        </div>
        <Button onClick={save} className="gap-2" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> E-mails</h2>
          <div><label className="cms-label">E-mail Principal</label><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="contato@seusite.com" /></div>
          <div><label className="cms-label">E-mail Secundário</label><Input type="email" value={data.emailSecundario} onChange={(e) => update("emailSecundario", e.target.value)} /></div>
        </div>
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> Telefones</h2>
          <div><label className="cms-label">Telefone</label><Input value={data.telefone} onChange={(e) => update("telefone", e.target.value)} placeholder="(00) 0000-0000" /></div>
          <div><label className="cms-label">WhatsApp</label><Input value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="(00) 00000-0000" /></div>
        </div>
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Localização</h2>
          <div><label className="cms-label">Endereço</label><Textarea value={data.endereco} onChange={(e) => update("endereco", e.target.value)} /></div>
          <div><label className="cms-label">Horário</label><Input value={data.horarioAtendimento} onChange={(e) => update("horarioAtendimento", e.target.value)} /></div>
          <div><label className="cms-label">Embed do Google Maps</label><Input value={data.mapaEmbed} onChange={(e) => update("mapaEmbed", e.target.value)} /></div>
        </div>
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title">Formulário de Contato</h2>
          <div><label className="cms-label">Mensagem de Sucesso</label><Input value={data.mensagemSucesso} onChange={(e) => update("mensagemSucesso", e.target.value)} /></div>
          <div>
            <label className="cms-label">Assuntos</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {data.assuntos.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm">
                  {a}<button onClick={() => removeAssunto(i)} className="text-muted-foreground hover:text-destructive ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={novoAssunto} onChange={(e) => setNovoAssunto(e.target.value)} placeholder="Novo assunto..." className="max-w-xs" onKeyDown={(e) => e.key === "Enter" && addAssunto()} />
              <Button onClick={addAssunto} variant="outline" size="sm">Adicionar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsContato;
