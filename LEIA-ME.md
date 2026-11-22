# Site da print() · versão 3 (cursores que constroem a página)

## Abrir e ver
- Para ver o site: dê dois cliques em `index.html`. Ele abre no navegador.
- No Antigravity: abra esta pasta (File > Open Folder). O agente lê o `AGENTS.md` sozinho, com as regras da marca e do projeto. É só pedir as mudanças no chat do Antigravity.

## Arquivos
- `index.html`: textos e estrutura da página.
- `css/estilo.css`: visual, cursores e animações.
- `js/site.js`: menus, rolagem suave, prova interativa, cursores que constroem a página e formulário.
- `img/`: ícones e imagem de compartilhamento.
- `marca/`: logos oficiais em SVG.

## Antes de publicar
1. Em `js/site.js`, procure `var CONTATO` e preencha o WhatsApp (só números, com 55 e DDD), o e-mail e o Instagram. O que ficar vazio não aparece no site.
2. Revise os textos de serviços e de "Para quem". São um rascunho.

## Colocar no ar
- O site está no repositório Enio-123/Print- e é publicado pelo GitHub Pages a partir da branch main: https://enio-123.github.io/Print-/
- O Pages já está ligado: o arquivo `.github/workflows/pages.yml` publica o site a cada envio para a main.
- Cada mudança enviada para a main entra no ar em poucos minutos.
- Domínio próprio (.com.br no registro.br): Settings > Pages > Custom domain. Depois troque og:url, og:image e canonical no `index.html`.
- Atenção: a regra do GitHub Pages proíbe usar para rodar um negócio online (loja, vendas). Para um site só de apresentação é zona cinzenta. Se o site passar a vender, use o Cloudflare Pages (grátis e sem essa restrição).

## Como o formulário funciona
Não precisa de servidor. O cliente preenche, o site monta a mensagem e abre o WhatsApp (ou o e-mail) da print() com tudo escrito. O cliente revisa e envia.

## Animações e rolagem
- Quatro cursores (ciano, magenta, amarelo e preto) constroem a página enquanto ela é rolada: desenham as caixas, pintam os títulos, riscam as linhas, clicam nos botões do topo e encaixam as chapas do logo.
- No computador, a roda do mouse desliza suave. As barras de rolagem ficam escondidas.
- Quem usa "reduzir movimento" no aparelho vê a página pronta, sem cursores.
