import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getData } from "@/lib/storage";

const SiteContato: React.FC = () => {
  const { theme, btnRadius } = useOutletContext<any>();
  const contato = useMemo(() => getData<any>("contato", {}), []);
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulates sending - in production, would call API
    setSent(true);
  };

  return (
    <div>
      <section className="py-16 px-6" style={{ background: theme.secondaryColor, color: "#fff" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="opacity-75">Envie sua mensagem, dúvida ou sugestão</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Informações de Contato</h2>
          {contato?.email && (
            <div>
              <h3 className="font-semibold mb-1">E-mail</h3>
              <a href={`mailto:${contato.email}`} style={{ color: theme.primaryColor }}>{contato.email}</a>
            </div>
          )}
          {contato?.whatsapp && (
            <div>
              <h3 className="font-semibold mb-1">WhatsApp</h3>
              <a href={`https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" style={{ color: theme.primaryColor }}>
                {contato.whatsapp}
              </a>
            </div>
          )}
          {contato?.telefone && (
            <div>
              <h3 className="font-semibold mb-1">Telefone</h3>
              <p>{contato.telefone}</p>
            </div>
          )}
          {contato?.endereco && (
            <div>
              <h3 className="font-semibold mb-1">Endereço</h3>
              <p className="opacity-70">{contato.endereco}</p>
            </div>
          )}
          {contato?.googleMaps && (
            <iframe src={contato.googleMaps} className="w-full h-48 rounded-xl border" allowFullScreen loading="lazy" />
          )}
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Mensagem Enviada!</h3>
              <p className="opacity-70">Obrigado pelo contato. Retornaremos em breve.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm font-medium" style={{ color: theme.primaryColor }}>
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensagem</label>
                <textarea
                  required
                  rows={5}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 resize-none"
                  style={{ borderRadius: theme.borderRadius, borderColor: "#e5e7eb" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: theme.primaryColor, borderRadius: btnRadius }}
              >
                Enviar Mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteContato;
