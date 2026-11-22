# print() · site de apresentação

Guia para o agente de IA (Antigravity) e para quem for editar este projeto. Leia antes de mudar qualquer arquivo.

## O que é
Site de apresentação da print(), empresa que faz sites institucionais, landing pages, lojas virtuais e apps/sistemas sob medida, para negócios locais e para empresas ou startups. Público brasileiro: todo texto em português do Brasil, tom direto e próximo ("a gente"), profissional, sem gíria forçada.

## Como o projeto é feito
- HTML, CSS e JavaScript puros. Sem framework, sem npm, sem etapa de build. Para ver, abra `index.html` no navegador.
- `index.html`: conteúdo e estrutura. O logo está desenhado em SVG no começo do `<body>` (`<path id="k">`); as outras cópias do logo usam `<use href="#k">`.
- `css/estilo.css`: todos os estilos. As animações ficam no fim do arquivo.
- `js/site.js`: mega menu (computador), menu em tela cheia (celular), rolagem suave, prova interativa do topo, cursores que constroem a página e formulário.
- `img/`: ícones da aba e a imagem de compartilhamento `og-imagem.png` (1200 × 630).
- `marca/`: arquivos oficiais do logo em SVG. Não edite nem redesenhe.
- Fontes (Google Fonts): Bricolage Grotesque (títulos, peso 800), Manrope (texto), JetBrains Mono (rótulos como `// serviços`).

## Regras da marca
- Cores: Ciano #00AEE8, Magenta #EF2A7B, Amarelo #FFD200, Preto #111114 e Papel #FBFAF7 (fundo). Estão em variáveis no topo do CSS (`--c`, `--m`, `--y`, `--tinta`, `--papel`). Use as variáveis e não crie cores novas.
- Texto é sempre preto ou branco. Sobre ciano, magenta ou amarelo, o texto é preto.
- Cada serviço tem uma cor fixa: site = ciano, landing page = magenta, loja virtual = amarelo, app/sistema = preto.
- Logo: não mude as cores, não distorça, não gire, não aumente o deslocamento das chapas coloridas e não aplique efeitos (sombra, brilho, degradê). Logo colorido só com 200 px de largura ou mais; menor que isso, use a versão preta ou branca. Espaço livre em volta do logo: no mínimo a largura de um "(".
- Visual limpo: sem degradês, sem sombras decorativas e sem emojis. O único efeito de cor permitido é o das chapas fora de registro (ciano, magenta e amarelo deslocados que se encaixam), que é a assinatura da marca.

## Conteúdo
- Não invente dados: nada de clientes, depoimentos, números, prêmios ou preços que os sócios não informaram.
- Contatos ficam só no objeto `CONTATO`, no começo de `js/site.js` (WhatsApp só números com 55 e DDD; e-mail; Instagram sem @). O que estiver vazio não aparece no site. Sem nenhum contato definido, a lista de canais some e o rodapé mostra só o link "Pedir orçamento", que leva ao formulário.
- Em "Quem somos", o nome do sócio da gestão ainda não foi informado, então o segundo cartão não tem a linha do nome. Quando o nome for informado, coloque `<p class="nome">Nome</p>` logo depois do `<p class="papel-s">` desse cartão, igual ao primeiro. Não use texto provisório como "nome a definir".
- Os textos de serviços e de "Para quem" são um rascunho em revisão.

## Animações (cursores que constroem a página)
- Só funcionam quando o `<html>` tem a classe `anima`. O script curto no `<head>` coloca essa classe. Se o `js/site.js` não rodar em 3,5 s, a classe sai e tudo aparece sem animação. Com "reduzir movimento" ligado no aparelho, não há animação nem rolagem suave.
- Quatro cursores, um de cada cor (ciano, magenta, amarelo e preto, com o nome escrito), entram na tela e constroem cada parte quando ela aparece ao rolar. Eles ficam numa camada por cima da página (`.cursores`), que não bloqueia cliques. O código está em `js/site.js`, na parte "construção da página".
- Grupos. Os seletores são iguais no CSS e no objeto `SEL` do `js/site.js`; ao mudar um, mude o outro.
  - `varre`: títulos. Um cursor pinta o texto palavra por palavra; a tinta passa por ciano, magenta e amarelo e fica preta (ou branca no fundo escuro).
  - `caixa`: cartões e caixas. Um cursor arrasta uma seleção (com a medida em px) do canto de cima até o canto de baixo; ao soltar, as chapas C, M e Y entram em registro.
  - `sobe`, `pop`, `digita`: textos de apoio, ícones e rótulos em mono. Aparecem sozinhos logo depois do título ou da caixa de que dependem.
  - `linha`: traços (linha das etapas e faixa do contato), riscados por um cursor.
  - `logo`: logo da prova e do rodapé. Os cursores ciano, magenta e amarelo seguram cada um a sua chapa e arrastam até o registro.
  - `clique`: botões do topo, que aparecem com o clique do cursor preto.
- Ordem: o que está dentro de uma caixa espera a caixa; parágrafos e listas esperam o título acima deles. Cada cartão de serviço, motivo e etapa é feito pelo cursor da sua cor.
- Nada fica escondido: se os quatro cursores estiverem ocupados, a parte aparece com a animação simples do grupo; o que passa para cima sem ser construído aparece pronto; o que tem foco do teclado aparece na hora; e depois de 6 s na tela tudo aparece de qualquer jeito.
- Para animar um elemento novo, coloque o seletor dele no grupo certo nos dois lugares. Para não animar, não coloque em nenhum grupo.
- A linha `>>> print("...")` do topo digita e apaga palavras em loop, só enquanto o topo está na tela.

## Rolagem
- No computador, a roda do mouse e o touchpad deslizam suave (parte "rolagem suave" do `js/site.js`, sem biblioteca). Links internos (`href="#..."`) clicados deslizam até a seção e descontam a altura do cabeçalho. No celular, o dedo usa a rolagem do próprio aparelho.
- Campos e caixas que rolam por dentro (como o campo de mensagem) continuam rolando por dentro.
- As barras de rolagem ficam escondidas no site inteiro (`scrollbar-width:none` e `::-webkit-scrollbar`). Não coloque barras de volta.

## Qualidade (obrigatório)
- Funciona igual no celular (teste com 390 px de largura) e no computador (1366 px ou mais), sem rolagem lateral e com botões fáceis de tocar.
- Mantenha a acessibilidade: atributos `aria-*`, rótulos dos campos, link "Pular para o conteúdo" e foco visível.
- Sem erros no console. Depois de cada mudança, teste o mega menu, o menu do celular, o formulário, a rolagem suave e os cursores (rolando a página inteira, no computador e no celular).
- Não adicione bibliotecas, frameworks ou serviços externos sem pedir. O site precisa continuar leve.
- Não mude o que já foi aprovado (identidade, logo, cores, ordem das seções) sem pedido explícito.

## Publicar
- Publicado pelo GitHub Pages a partir da branch `main` (pasta raiz), no repositório Enio-123/Print-: https://enio-123.github.io/Print-/. Cada mudança enviada para a `main` entra no ar em poucos minutos. O arquivo `.nojekyll` faz o GitHub servir os arquivos como estão.
- Quando houver domínio próprio, troque `og:url`, `og:image` e o `<link rel="canonical">` do `<head>` pelo novo endereço.
- Regra do GitHub Pages: não pode ser usado para rodar um negócio online (loja, vendas, SaaS). Se o site passar a vender, mude a hospedagem: o Cloudflare Pages grátis não tem essa restrição, e o plano grátis da Vercel é só para uso pessoal ou não comercial.
