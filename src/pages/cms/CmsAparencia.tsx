import React, { useState, useEffect } from "react";
import { getData, setData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Palette, RotateCcw } from "lucide-react";
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

const fonts = ["Inter", "Poppins", "Roboto", "Montserrat", "Open Sans", "Lato", "Playfair Display", "Merriweather"];

const CmsAparencia = () => {
  const [theme, setTheme] = useState<SiteTheme>(defaultTheme);
  const { toast } = useToast();

  useEffect(() => {
    setTheme(getData("siteTheme", defaultTheme));
  }, []);

  const handleSave = () => {
    setData("siteTheme", theme);
    toast({ title: "Aparência salva!" });
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    setData("siteTheme", defaultTheme);
    toast({ title: "Aparência restaurada ao padrão!" });
  };

  const updateField = (field: keyof SiteTheme, value: string | number) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  const ColorField = ({ label, field }: { label: string; field: keyof SiteTheme }) => (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={theme[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        className="w-10 h-10 rounded-lg border border-input cursor-pointer p-0.5"
      />
      <div className="flex-1">
        <label className="cms-label mb-0">{label}</label>
        <Input
          value={theme[field] as string}
          onChange={(e) => updateField(field, e.target.value)}
          className="mt-1 font-mono text-xs"
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
          <p className="text-muted-foreground">Personalize as cores e estilos do site público</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Restaurar Padrão
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cores Principais */}
        <div className="cms-card space-y-4">
          <h2 className="cms-section-title flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Cores Principais
          </h2>
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
          <h2 className="cms-section-title">Tipografia e Estilo</h2>
          <div>
            <label className="cms-label">Fonte Principal</label>
            <select
              className="cms-input"
              value={theme.fontFamily}
              onChange={(e) => updateField("fontFamily", e.target.value)}
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="cms-label">Arredondamento dos Cantos</label>
            <select
              className="cms-input"
              value={theme.borderRadius}
              onChange={(e) => updateField("borderRadius", e.target.value)}
            >
              <option value="0px">Sem arredondamento</option>
              <option value="4px">Sutil (4px)</option>
              <option value="8px">Médio (8px)</option>
              <option value="12px">Grande (12px)</option>
              <option value="16px">Extra grande (16px)</option>
              <option value="9999px">Pílula</option>
            </select>
          </div>
          <div>
            <label className="cms-label">Estilo dos Botões</label>
            <div className="flex gap-2">
              {(["rounded", "pill", "square"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateField("buttonStyle", s)}
                  className={`px-4 py-2 text-sm font-medium border transition-colors ${
                    theme.buttonStyle === s
                      ? "bg-primary text-primary-foreground border-primary"
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
            <label className="cms-label">Opacidade do Overlay do Hero ({Math.round(theme.heroOverlayOpacity * 100)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={theme.heroOverlayOpacity}
              onChange={(e) => updateField("heroOverlayOpacity", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="cms-card mt-6">
        <h2 className="cms-section-title">Pré-visualização</h2>
        <div className="rounded-lg overflow-hidden border" style={{ fontFamily: theme.fontFamily }}>
          {/* Header preview */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: theme.headerBg, color: theme.headerText }}>
            <span className="font-bold text-lg">Meu Site</span>
            <div className="flex gap-4 text-sm">
              <span>Início</span>
              <span>Biografia</span>
              <span>Propostas</span>
              <span>Contato</span>
            </div>
          </div>
          {/* Body preview */}
          <div className="p-8" style={{ background: theme.bodyBg, color: theme.bodyText }}>
            <h3 className="text-2xl font-bold mb-2">Título de Exemplo</h3>
            <p className="mb-4 opacity-70">Este é um exemplo de como o site ficará com as cores e estilos selecionados.</p>
            <div className="flex gap-3">
              <button
                className="px-6 py-2.5 text-sm font-medium text-white"
                style={{
                  background: theme.primaryColor,
                  borderRadius: theme.buttonStyle === "pill" ? "9999px" : theme.buttonStyle === "square" ? "0" : theme.borderRadius,
                }}
              >
                Botão Primário
              </button>
              <button
                className="px-6 py-2.5 text-sm font-medium border"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  borderRadius: theme.buttonStyle === "pill" ? "9999px" : theme.buttonStyle === "square" ? "0" : theme.borderRadius,
                }}
              >
                Botão Secundário
              </button>
            </div>
          </div>
          {/* Footer preview */}
          <div className="px-6 py-4 text-sm" style={{ background: theme.footerBg, color: theme.footerText }}>
            © 2026 Meu Site. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsAparencia;
