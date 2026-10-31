"""
Sanitização de HTML do QuarkOps.

Usa `nh3` (wrapper Python do `ammonia` em Rust) para limpar o HTML do `Post.content`
antes de persistir. Estratégia "permissiva mas segura": preserva tags de formatação
e classes (necessárias para highlight.js e Tailwind), mas remove scripts, eventos
inline e estilos.

A config cobre o que o CRM gera hoje (ver `CrmModal` + `highlight.js` no frontend).
Ao adicionar novas tags permitidas, atualize `ALLOWED_TAGS` e `ALLOWED_ATTRIBUTES`.
"""
import nh3

# ────────────────────────────────────────────────────────────
# Config: tags e atributos permitidos
# ────────────────────────────────────────────────────────────

ALLOWED_TAGS = {
    # Estrutura
    "h2", "h3", "h4", "p", "br", "hr",
    "div", "span",
    # Listas
    "ul", "ol", "li",
    # Texto inline
    "strong", "em", "b", "i", "u", "s", "code", "pre",
    "blockquote",
    # Links
    "a",
    # Imagens
    "img",
    # Tabelas (suporte futuro)
    "table", "thead", "tbody", "tr", "td", "th",
}

# `class` liberado em `span`/`div`/`pre`/`code` (highlight.js + Tailwind).
# Em `h2`/`h3` liberamos `id` (TOC do frontend).
ALLOWED_ATTRIBUTES = {
    "*": {"class"},                     # qualquer tag pode ter class (Tailwind)
    "a": {"href", "title", "target"},
    "img": {"src", "alt", "title", "width", "height"},
    "h2": {"id"},
    "h3": {"id"},
    "h4": {"id"},
}

# Esquemas de URL permitidos (nh3 valida automaticamente por tipo de atributo).
URL_SCHEMES = {"http", "https", "mailto"}


# ────────────────────────────────────────────────────────────
# Função pública
# ────────────────────────────────────────────────────────────

def sanitize_html(raw_html: str) -> str:
    """
    Limpa HTML arbitrário removendo tags perigosas, atributos `on*` e `style`.

    Preserva:
    - Estrutura semântica (h2/h3/p/ul/ol/li/blockquote/pre/code).
    - Classes CSS (necessárias para highlight.js e Tailwind).
    - IDs de headings (necessários para TOC no frontend).
    - Links (http/https/mailto) e imagens (http/https).

    Remove:
    - `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, etc.
    - Atributos `onclick`, `onerror`, `onload`, ...
    - Atributos `style` (injeção CSS).
    - URLs com esquemas perigosos (`javascript:`, `data:`, ...).
    """
    if not raw_html:
        return ""

    return nh3.clean(
        raw_html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        url_schemes=URL_SCHEMES,
        link_rel="noopener noreferrer",  # hardening em links externos
        strip_comments=True,
    )
