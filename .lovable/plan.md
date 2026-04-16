

# Mapa Completo: Tudo que Falta para Funcionar 100%

---

## 1. BACKEND (PHP) -- Voce Precisa Criar

### 1.1 Endpoint `api/configuracoes.php` (CRITICO)

Sem isso, **Aparencia**, **Home** e **Contato** salvam apenas no navegador do admin (localStorage) e NAO aparecem no site publico.

**Tabela SQL:**
```text
CREATE TABLE configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_id INT NOT NULL,
  chave VARCHAR(100) NOT NULL,
  valor LONGTEXT,
  UNIQUE KEY unique_config (site_id, chave)
);
```

**Endpoints:**
```text
GET  /api/configuracoes.php?site_id=1&chave=siteTheme
POST /api/configuracoes.php
     Body JSON: { "site_id": 1, "chave": "siteTheme", "valor": "{...json...}" }

Chaves usadas: "siteTheme", "home", "contato"
POST faz INSERT ... ON DUPLICATE KEY UPDATE
```

### 1.2 Endpoint `api/resolve.php` (para producao)

Quando o site publico for hospedado em dominio proprio, ele precisa saber qual `site_id` carregar.

```text
GET /api/resolve.php?domain=politico-a.com.br
Resposta: { "site_id": 3 }
```

Consulta a tabela `sites` pelo campo `domain`.

### 1.3 CORS em TODOS os endpoints

Cada arquivo PHP precisa no topo:
```text
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
```

---

## 2. FRONTEND (Eu Faco) -- Apos Voce Criar os Endpoints

### 2.1 Conectar Aparencia/Home/Contato ao banco

Trocar `getSetting`/`saveSetting` de localStorage para fetch ao `/api/configuracoes.php`. Afeta 6 arquivos:

| Arquivo | Chave |
|---------|-------|
| CmsAparencia.tsx | `siteTheme` |
| CmsHome.tsx | `home` |
| CmsContato.tsx | `contato` |
| SiteLayout.tsx | `siteTheme` + `contato` |
| SiteHome.tsx | `home` |
| SiteContato.tsx | `contato` |

### 2.2 Corrigir o color picker da Aparencia

O input `type="color"` esta com estilo quebrado em alguns navegadores. Vou ajustar o CSS para funcionar corretamente (ja mapeei o problema no codigo).

### 2.3 Site publico multi-tenant

Implementar resolucao do `site_id` para o site publico:
- Fallback imediato: parametro na URL `?sid=2`
- Producao: chamar `/api/resolve.php?domain=...` usando `window.location.hostname`
- Passar `siteId` via React Context para todas as paginas do site

### 2.4 Edição (PUT) nos modulos

Atualmente so tem **criar** e **deletar**. Falta **editar** em:
- Propostas
- Noticias
- Videos
- Livros
- Categorias
- Banners

Preciso saber: seus endpoints aceitam PUT? Se sim, com quais campos?

---

## 3. QUESTAO DO ADMIN MULTI-TENANT

**Como funciona hoje:**
- Login retorna `token`, `user` e `site_id`
- Todas as chamadas usam esse `site_id`
- Cada admin so ve dados do seu site

**O que falta para ser 100%:**
- O site publico precisa do endpoint `resolve.php` para saber qual `site_id` carregar pelo dominio
- Sem isso, funciona com `?sid=X` na URL (suficiente para testes)

---

## RESUMO VISUAL

```text
STATUS ATUAL:
  ✅ Login .................... Conectado ao backend
  ✅ Categorias ............... CRUD via API
  ✅ Noticias ................. Criar/Deletar via API
  ✅ Propostas ................ Criar/Deletar via API
  ✅ Videos ................... Criar/Deletar via API
  ✅ Livros ................... Criar/Deletar via API
  ✅ Banners .................. Criar/Deletar via API
  ✅ Biografia ................ Criar/Atualizar via API
  ⚠️ Aparencia ................ localStorage (precisa configuracoes.php)
  ⚠️ Home ..................... localStorage (precisa configuracoes.php)
  ⚠️ Contato (config) ......... localStorage (precisa configuracoes.php)
  ⚠️ Color Picker ............. Bug visual no CSS
  ❌ Edicao (PUT) ............. Nao implementado
  ❌ Site resolve dominio ..... Precisa resolve.php

O QUE VOCE CRIA (PHP):         O QUE EU FACO (React):
  configuracoes.php              Conectar 6 arquivos a API
  resolve.php                    Multi-tenant no site publico
  CORS nos headers               Fix color picker
  (opcional) PUT nos endpoints   Telas de edicao
```

---

## Proximo Passo

Crie o `configuracoes.php` + tabela e me avise. Eu conecto tudo imediatamente e corrijo o color picker na mesma atualizacao.

