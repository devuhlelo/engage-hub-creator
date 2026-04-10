import React, { useMemo } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { getData } from "@/lib/storage";
import type { SiteTheme } from "@/pages/cms/CmsAparencia";

const defaultTheme: SiteTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#1e293b",
  accentColor: "#f59e0b",
  headerBg: "#1e293b",
  headerText: "#ffffff",
  footerBg: "#0f172a",
  footerText: "#94a3b8",
  bodyBg: "#ffffff",
  bodyText: "#1e293b",
  fontFamily: "Inter",
  heroOverlayOpacity: 0.5,
  borderRadius: "8px",
  buttonStyle: "rounded",
};

const navLinks = [
  { to: "/site", label: "Início", end: true },
  { to: "/site/biografia", label: "Biografia" },
  { to: "/site/propostas", label: "Propostas" },
  { to: "/site/videos", label: "Vídeos" },
  { to: "/site/noticias", label: "Notícias" },
  { to: "/site/livros", label: "Livros" },
  { to: "/site/contato", label: "Contato" },
];

const SiteLayout: React.FC = () => {
  const theme = useMemo(() => getData<SiteTheme>("siteTheme", defaultTheme), []);
  const contato = useMemo(() => getData<any>("contato", {}), []);
  const home = useMemo(() => getData<any>("home", {}), []);

  const btnRadius =
    theme.buttonStyle === "pill" ? "9999px" : theme.buttonStyle === "square" ? "0" : theme.borderRadius;

  return (
    <div style={{ fontFamily: theme.fontFamily, color: theme.bodyText, background: theme.bodyBg }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{ background: theme.headerBg, color: theme.headerText }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/site" className="text-xl font-bold">{home?.hero?.title || "Meu Site"}</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `transition-opacity ${isActive ? "opacity-100 font-semibold" : "opacity-75 hover:opacity-100"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="min-h-screen">
        <Outlet context={{ theme, btnRadius }} />
      </main>

      {/* Footer */}
      <footer style={{ background: theme.footerBg, color: theme.footerText }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: theme.headerText }}>
              {home?.hero?.title || "Meu Site"}
            </h3>
            <p className="text-sm opacity-75">{home?.sobre?.subtitle || ""}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: theme.headerText }}>Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="opacity-75 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: theme.headerText }}>Contato</h4>
            <div className="text-sm space-y-1 opacity-75">
              {contato?.email && <p>{contato.email}</p>}
              {contato?.whatsapp && <p>WhatsApp: {contato.whatsapp}</p>}
              {contato?.telefone && <p>Tel: {contato.telefone}</p>}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs opacity-50">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
