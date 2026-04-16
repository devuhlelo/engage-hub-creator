import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { getSetting, resolveSiteByDomain } from "@/lib/api";
import { defaultTheme } from "@/pages/cms/CmsAparencia";
import type { SiteTheme } from "@/pages/cms/CmsAparencia";
import { Menu, X, Loader2 } from "lucide-react";

const navLinks = [
  { to: "/site", label: "Início", end: true },
  { to: "/site/biografia", label: "Biografia" },
  { to: "/site/propostas", label: "Propostas" },
  { to: "/site/videos", label: "Vídeos" },
  { to: "/site/noticias", label: "Notícias" },
  { to: "/site/livros", label: "Livros" },
  { to: "/site/contato", label: "Contato" },
];

const loadGoogleFont = (fontFamily: string) => {
  const id = `gfont-${fontFamily.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
};

const SiteLayout: React.FC = () => {
  const [theme, setTheme] = useState<SiteTheme>(defaultTheme);
  const [homeData, setHomeData] = useState<any>({});
  const [contato, setContato] = useState<any>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteId, setSiteId] = useState<number>(1);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Resolve site_id: ?sid=X from URL, or resolve by domain, fallback to 1
  useEffect(() => {
    const sidParam = searchParams.get("sid");
    if (sidParam) {
      setSiteId(parseInt(sidParam));
    } else {
      const hostname = window.location.hostname;
      if (hostname !== "localhost" && !hostname.includes("lovable.app")) {
        resolveSiteByDomain(hostname).then((id) => {
          if (id) setSiteId(id);
        });
      }
    }
  }, [searchParams]);

  const loadAllData = async () => {
    try {
      const [t, h, c] = await Promise.all([
        getSetting("siteTheme", defaultTheme, siteId),
        getSetting("home", {}, siteId),
        getSetting("contato", {}, siteId),
      ]);
      setTheme(t || defaultTheme);
      setHomeData(h || {});
      setContato(c || {});
    } catch {
      // Fallback to defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, [siteId]);
  useEffect(() => { if (!loading) loadAllData(); }, [location.pathname]);
  useEffect(() => { if (theme.fontFamily && theme.fontFamily !== "Inter") loadGoogleFont(theme.fontFamily); }, [theme.fontFamily]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const siteTitle = homeData?.heroTitle || "Meu Site";
  const btnRadius = theme.buttonStyle === "pill" ? "9999px" : theme.buttonStyle === "square" ? "0" : theme.borderRadius;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div style={{ fontFamily: `'${theme.fontFamily}', sans-serif`, color: theme.bodyText, background: theme.bodyBg }}>
      <header className="sticky top-0 z-50 transition-shadow duration-300" style={{ background: theme.headerBg, color: theme.headerText, boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/site" className="text-xl font-bold tracking-tight">{siteTitle}</Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-white/15 opacity-100" : "opacity-70 hover:opacity-100 hover:bg-white/10"}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-1" style={{ background: theme.headerBg }}>
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-white/15" : "opacity-70 hover:opacity-100 hover:bg-white/10"}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="min-h-screen"><Outlet context={{ theme, btnRadius, siteId }} /></main>

      <footer style={{ background: theme.footerBg, color: theme.footerText }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-xl mb-4" style={{ color: theme.headerText }}>{siteTitle}</h3>
              <p className="text-sm opacity-75 leading-relaxed">Construindo um futuro melhor para todos.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: theme.headerText }}>Navegação</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                {navLinks.map((l) => <Link key={l.to} to={l.to} className="opacity-60 hover:opacity-100 transition-opacity">{l.label}</Link>)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: theme.headerText }}>Contato</h4>
              <div className="text-sm space-y-2 opacity-75">
                {contato?.email && <p>📧 {contato.email}</p>}
                {contato?.whatsapp && <p>📱 {contato.whatsapp}</p>}
                {contato?.telefone && <p>📞 {contato.telefone}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50">
            <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
            <span>Feito com ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;