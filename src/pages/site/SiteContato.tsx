import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getSetting } from "@/lib/api";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, Send, Loader2 } from "lucide-react";

const SiteContato: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const [contato, setContato] = useState<any>({});
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSetting("contato", {}).then(setContato).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Conectar com endpoint de envio de email do seu backend
    setSent(true);
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="h-10 w-10 animate-spin" style={{ color: theme.primaryColor }} /></div>;

  const InfoItem = ({ icon: Icon, label, value, href }: any) => (
    <div className="flex items-start gap-4 p-4 border rounded-xl" style={{ borderRadius: theme.borderRadius }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${theme.primaryColor}15` }}>
        <Icon className="h-5 w-5" style={{ color: theme.primaryColor }} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-0.5">{label}</p>
        {href ? <a href={href} target="_blank" rel="noopener" className="font-medium hover:underline" style={{ color: theme.primaryColor }}>{value}</a> : <p className="font-medium">{value}</p>}
      </div>
    </div>
  );

  return (
    <div>
      <section className="relative py-20 px-6 text-center text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor} 0%, ${theme.primaryColor} 100%)` }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Entre em Contato</h1>
          <p className="text-lg mt-4 opacity-80">Envie sua mensagem, dúvida ou sugestão</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L720 30L1440 60V60H0Z" fill={theme.bodyBg} /></svg></div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Informações</h2>
          {contato?.email && <InfoItem icon={Mail} label="E-mail" value={contato.email} href={`mailto:${contato.email}`} />}
          {contato?.whatsapp && <InfoItem icon={MessageCircle} label="WhatsApp" value={contato.whatsapp} href={`https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`} />}
          {contato?.telefone && <InfoItem icon={Phone} label="Telefone" value={contato.telefone} href={`tel:${contato.telefone}`} />}
          {contato?.endereco && <InfoItem icon={MapPin} label="Endereço" value={contato.endereco} />}
          {contato?.mapaEmbed && <iframe src={contato.mapaEmbed} className="w-full h-52 border" style={{ borderRadius: theme.borderRadius }} allowFullScreen loading="lazy" />}
        </div>

        <div className="lg:col-span-3">
          <div className="border p-8 shadow-sm" style={{ borderRadius: theme.borderRadius }}>
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: theme.primaryColor }} />
                <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
                <p className="opacity-70 mb-6">{contato?.mensagemSucesso || "Obrigado pelo contato."}</p>
                <button onClick={() => { setSent(false); setForm({ nome: "", email: "", assunto: "", mensagem: "" }); }} className="px-6 py-2.5 text-sm font-semibold text-white" style={{ background: theme.primaryColor, borderRadius: btnRadius }}>Enviar outra mensagem</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold mb-2">Envie uma Mensagem</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1.5">Nome *</label><input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full border px-4 py-3 text-sm outline-none focus:ring-2 transition-shadow" style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }} placeholder="Seu nome completo" /></div>
                  <div><label className="block text-sm font-medium mb-1.5">E-mail *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border px-4 py-3 text-sm outline-none focus:ring-2 transition-shadow" style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }} placeholder="seu@email.com" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1.5">Assunto</label><input type="text" value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} className="w-full border px-4 py-3 text-sm outline-none focus:ring-2 transition-shadow" style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }} placeholder="Assunto" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Mensagem *</label><textarea required rows={5} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} className="w-full border px-4 py-3 text-sm outline-none focus:ring-2 resize-none transition-shadow" style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }} placeholder="Escreva sua mensagem..." /></div>
                <button type="submit" className="w-full py-3.5 font-semibold text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all" style={{ background: theme.primaryColor, borderRadius: btnRadius }}>
                  <Send className="h-4 w-4" /> Enviar Mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteContato;
