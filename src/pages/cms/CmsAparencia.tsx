import React, { useState, useEffect } from "react";
import { getData, setData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Palette, RotateCcw, Eye, Monitor, Smartphone, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBg: string;
  headerText: string;
  footerBg: string;
  footerText: string;
  bodyBg: string;
  bodyText: string;
  fontFamily: string;
  heroOverlayOpacity: number;
  borderRadius: string;
  buttonStyle: "rounded" | "pill" | "square";
}

export const defaultTheme: SiteTheme = {
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

const fonts = ["Inter", "Poppins", "Roboto", "Montserrat", "Open Sans", "Lato", "Playfair Display", "Merriweather"];

const presetThemes = [
  { name: "Azul Clássico", primary: "#2563eb", secondary: "#1e293b", accent: "#f59e0b" },
  { name: "Verde Esperança", primary: "#059669", secondary: "#064e3b", accent: "#fbbf24" },
  { name: "Vermelho Paixão", primary: "#dc2626", secondary: "#1c1917", accent: "#facc15" },
  { name: "Roxo Moderno", primary: "#7c3aed", secondary: "#1e1b4b", accent: "#f97316" },
  { name: "Azul Marinho", primary: "#0369a1", secondary: "#0c4a6e", accent: "#06b6d4" },
  { name: "Laranja Energia", primary: "#ea580c", secondary: "#292524", accent: "#84cc16" },
];

const CmsAparencia = () => {
  const [theme, setTheme] = useState<SiteTheme>(defaultTheme);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const { toast } = useToast();

  useEffect(() => {
    setTheme(getData("siteTheme", defaultTheme));
  }, []);

  const handleSave = () => {
    setData("siteTheme", theme);
    toast({ title: "Aparência salva com sucesso!", description: "As mudanças já estão visíveis no site." });
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    setData("siteTheme", defaultTheme);
    toast({ title: "Aparência restaurada ao padrão!" });
  };

  const applyPreset = (preset: typeof presetThemes[0]) => {
    const updated = {
      ...theme,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      headerBg: preset.secondary,
      footerBg: preset.secondary,
    };
    setTheme(updated);
  };

  const updateField = (field: keyof SiteTheme, value: string | number) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  const getBtnRadius = () =>
    theme.buttonStyle === "pill" ? "9999px" : theme.buttonStyle === "square" ? "0" : theme.borderRadius;

  const ColorField = ({ label, field }: { label: string; field: keyof SiteTheme }) => (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={theme[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        className="w-10 h-10 rounded-lg border border-input cursor-pointer p-0.5 shrink-0"
      />
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Input
          value={theme[field] as string}
          onChange={(e) => updateField(field, e.target.value)}
          className="mt-1 font-mono text-xs h-8"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aparência do Site</h1>
          <p className="text-muted-foreground">Personalize cores, fontes e estilos do site público</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Restaurar
          </Button>
          <Button onClick={handleSave} size="sm" className="gap-2">
            <Save className="h-4 w-4" /> Salvar Aparência
          </Button>
        </div>
      </div>

      {/* Temas Prontos */}
      <div className="cms-card mb-6">
        <h2 className="cms-section-title flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> Temas Prontos
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Selecione um tema base e personalize depois</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presetThemes.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="border rounded-lg p-3 hover:shadow-md transition-all group text-left"
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ background: p.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ background: p.secondary }} />
                <div className="w-6 h-6 rounded-full" style={{ background: p.accent }} />
              </div>
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cores Principais */}
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title">Cores Principais</h2>
          <ColorField label="Cor Primária" field="primaryColor" />
          <ColorField label="Cor Secundária" field="secondaryColor" />
          <ColorField label="Cor de Destaque" field="accentColor" />
        </div>

        {/* Header e Footer */}
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title">Cabeçalho e Rodapé</h2>
          <ColorField label="Fundo do Cabeçalho" field="headerBg" />
          <ColorField label="Texto do Cabeçalho" field="headerText" />
          <ColorField label="Fundo do Rodapé" field="footerBg" />
          <ColorField label="Texto do Rodapé" field="footerText" />
        </div>

        {/* Corpo */}
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title">Corpo do Site</h2>
          <ColorField label="Fundo do Corpo" field="bodyBg" />
          <ColorField label="Texto do Corpo" field="bodyText" />
        </div>

        {/* Tipografia e Estilo */}
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" /> Tipografia e Estilo
          </h2>
          <div>
            <label className="cms-label">Fonte Principal</label>
            <select
              className="cms-input"
              value={theme.fontFamily}
              onChange={(e) => updateField("fontFamily", e.target.value)}
            >
              {fonts.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">A fonte será carregada automaticamente do Google Fonts</p>
          </div>
          <div>
            <label className="cms-label">Arredondamento dos Cantos</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "0px", label: "Nenhum" },
                { val: "4px", label: "Sutil" },
                { val: "8px", label: "Médio" },
                { val: "12px", label: "Grande" },
                { val: "16px", label: "Extra" },
                { val: "9999px", label: "Pílula" },
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => updateField("borderRadius", r.val)}
                  className={`px-3 py-2 text-xs font-medium border transition-colors ${
                    theme.borderRadius === r.val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-input hover:bg-secondary"
                  }`}
                  style={{ borderRadius: r.val === "9999px" ? "12px" : r.val }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="cms-label">Estilo dos Botões</label>
            <div className="flex gap-2">
              {(["rounded", "pill", "square"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateField("buttonStyle", s)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium border transition-all ${
                    theme.buttonStyle === s
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-input hover:bg-secondary"
                  }`}
                  style={{
                    borderRadius: s === "pill" ? "9999px" : s === "square" ? "0" : "8px",
                  }}
                >
                  {s === "rounded" ? "Arredondado" : s === "pill" ? "Pílula" : "Quadrado"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="cms-label">
              Opacidade do Overlay do Hero — {Math.round(theme.heroOverlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={theme.heroOverlayOpacity}
              onChange={(e) => updateField("heroOverlayOpacity", parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Transparente</span>
              <span>Escuro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="cms-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="cms-section-title mb-0 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Pré-visualização ao Vivo
          </h2>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "desktop" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-md transition-colors ${previewMode === "mobile" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className={`mx-auto transition-all ${previewMode === "mobile" ? "max-w-sm" : "max-w-full"}`}>
          <div className="rounded-xl overflow-hidden border-2 shadow-lg" style={{ fontFamily: theme.fontFamily }}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: theme.headerBg, color: theme.headerText }}>
              <span className="font-bold text-lg">Meu Site</span>
              {previewMode === "desktop" && (
                <div className="flex gap-4 text-sm">
                  <span className="font-semibold">Início</span>
                  <span className="opacity-75">Biografia</span>
                  <span className="opacity-75">Propostas</span>
                  <span className="opacity-75">Contato</span>
                </div>
              )}
            </div>
            {/* Hero */}
            <div className="relative py-16 px-6 text-center text-white" style={{ background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})` }}>
              <h3 className="text-3xl font-bold mb-2">Título Principal</h3>
              <p className="opacity-80 mb-6">Uma breve descrição do seu site e propósito</p>
              <button
                className="px-8 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
                style={{ background: theme.accentColor, borderRadius: getBtnRadius() }}
              >
                Saiba Mais
              </button>
            </div>
            {/* Body */}
            <div className="p-8" style={{ background: theme.bodyBg, color: theme.bodyText }}>
              <h3 className="text-xl font-bold mb-3">Seção de Conteúdo</h3>
              <p className="opacity-70 mb-6 text-sm leading-relaxed">
                Este é um exemplo de como o site ficará com as cores e estilos selecionados.
                Todas as páginas seguirão esta identidade visual.
              </p>
              <div className={`grid ${previewMode === "desktop" ? "grid-cols-3" : "grid-cols-1"} gap-4 mb-6`}>
                {["Proposta 1", "Proposta 2", "Proposta 3"].map((t) => (
                  <div key={t} className="border p-4 shadow-sm" style={{ borderRadius: theme.borderRadius }}>
                    <div className="w-full h-20 rounded mb-3" style={{ background: `${theme.primaryColor}15` }} />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: theme.primaryColor }}> Categoria </span>
                    <h4 className="font-semibold mt-2 text-sm">{t}</h4>
                    <p className="text-xs opacity-60 mt-1">Descrição breve da proposta</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 text-sm font-medium text-white shadow-sm"
                  style={{ background: theme.primaryColor, borderRadius: getBtnRadius() }}
                >
                  Botão Primário
                </button>
                <button
                  className="px-6 py-2.5 text-sm font-medium border-2"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor, borderRadius: getBtnRadius() }}
                >
                  Botão Secundário
                </button>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 text-sm" style={{ background: theme.footerBg, color: theme.footerText }}>
              © 2026 Meu Site · Todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsAparencia;
