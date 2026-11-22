# Site da print() · versão 2 (com animações)

## Abrir e ver
- Para ver o site: dê dois cliques em `index.html`. Ele abre no navegador.
- No Antigravity: abra esta pasta (File > Open Folder). O agente lê o `AGENTS.md` sozinho, com as regras da marca e do projeto. É só pedir as mudanças no chat do Antigravity.

## Arquivos
- `index.html`: textos e estrutura da página.
- `css/estilo.css`: visual e animações.
- `js/site.js`: menus, prova interativa, animações e formulário.
- `img/`: ícones e imagem de compartilhamento.
- `marca/`: logos oficiais em SVG.

## Antes de publicar
1. Em `js/site.js`, procure `var CONTATO` e preencha o WhatsApp (só números, com 55 e DDD), o e-mail e o Instagram. O que ficar vazio não aparece no site.
2. Em `index.html`, troque "nome a definir" (Quem somos) pelo nome do sócio da gestão.
3. Revise os textos de serviços e de "Para quem". São um rascunho.

## Colocar no ar
- O site está no repositório Enio-123/Print- e é publicado pelo GitHub Pages a partir da branch main: https://enio-123.github.io/Print-/
- Para ligar o Pages (uma vez): Settings > Pages > Branch: main, pasta / (root) > Save.
- Cada mudança enviada para a main entra no ar em poucos minutos.
- Domínio próprio (.com.br no registro.br): Settings > Pages > Custom domain. Depois troque og:url, og:image e canonical no `index.html`.
- Atenção: a regra do GitHub Pages proíbe usar para rodar um negócio online (loja, vendas). Para um site só de apresentação é zona cinzenta. Se o site passar a vender, use o Cloudflare Pages (grátis e sem essa restrição).

## Como o formulário funciona
Não precisa de servidor. O cliente preenche, o site monta a mensagem e abre o WhatsApp (ou o e-mail) da print() com tudo escrito. O cliente revisa e envia.
