# print() · site de apresentação

Guia para o agente de IA (Antigravity) e para quem for editar este projeto. Leia antes de mudar qualquer arquivo.

## O que é
Site de apresentação da print(), empresa que faz sites institucionais, landing pages, lojas virtuais e apps/sistemas sob medida, para negócios locais e para empresas ou startups. Público brasileiro: todo texto em português do Brasil, tom direto e próximo ("a gente"), profissional, sem gíria forçada.

## Como o projeto é feito
- HTML, CSS e JavaScript puros. Sem framework, sem npm, sem etapa de build. Para ver, abra `index.html` no navegador.
- `index.html`: conteúdo e estrutura. O logo está desenhado em SVG no começo do `<body>` (`<path id="k">`); as outras cópias do logo usam `<use href="#k">`.
- `css/estilo.css`: todos os estilos. As animações ficam no fim do arquivo.
- `js/site.js`: mega menu (computador), menu em tela cheia (celular), prova interativa do topo, animações de impressão e formulário.
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
- Contatos ficam só no objeto `CONTATO`, no começo de `js/site.js` (WhatsApp só números com 55 e DDD; e-mail; Instagram sem @). O que estiver vazio não aparece no site.
- Em "Quem somos", o nome do sócio da gestão está como "nome a definir". Só troque quando o nome for informado.
- Os textos de serviços e de "Para quem" são um rascunho em revisão.

## Animações (efeito de impressão)
- Só funcionam quando o `<html>` tem a classe `anima`. O script curto no `<head>` coloca essa classe. Se o `js/site.js` não rodar em 3,5 s, a classe sai e tudo aparece sem animação. Com "reduzir movimento" ligado no aparelho, não há animação.
- Grupos. Os seletores são iguais no CSS e no objeto `SEL` do `js/site.js`; ao mudar um, mude o outro.
  - `varre`: títulos. Ciano, magenta e amarelo passam pelo texto e deixam a tinta final.
  - `caixa`: cartões e caixas. Entram com as chapas C, M e Y desalinhadas, que se encaixam.
  - `sobe`: parágrafos, listas e botões. Sobem e aparecem.
  - `pop`: ícones e quadradinhos de cor.
  - `digita`: rótulos em fonte mono, digitados com cursor.
  - `linha`: traços que se desenham (linha das etapas e faixa do contato).
  - `logo`: logo do rodapé, com as chapas entrando em registro.
- Para animar um elemento novo, coloque o seletor dele no grupo certo nos dois lugares. Para não animar, não coloque em nenhum grupo.
- Abertura: a cabeça de impressão CMYK desce pelo topo e "imprime" título, texto, botões e a prova. A linha `>>> print("...")` digita e apaga palavras em loop, só enquanto o topo está na tela.

## Qualidade (obrigatório)
- Funciona igual no celular (teste com 390 px de largura) e no computador (1366 px ou mais), sem rolagem lateral e com botões fáceis de tocar.
- Mantenha a acessibilidade: atributos `aria-*`, rótulos dos campos, link "Pular para o conteúdo" e foco visível.
- Sem erros no console. Depois de cada mudança, teste o mega menu, o menu do celular, o formulário e as animações (rolando a página inteira).
- Não adicione bibliotecas, frameworks ou serviços externos sem pedir. O site precisa continuar leve.
- Não mude o que já foi aprovado (identidade, logo, cores, ordem das seções) sem pedido explícito.

## Publicar
- Publicado pelo GitHub Pages a partir da branch `main` (pasta raiz), no repositório Enio-123/Print-: https://enio-123.github.io/Print-/. Cada mudança enviada para a `main` entra no ar em poucos minutos. O arquivo `.nojekyll` faz o GitHub servir os arquivos como estão.
- Quando houver domínio próprio, troque `og:url`, `og:image` e o `<link rel="canonical">` do `<head>` pelo novo endereço.
- Regra do GitHub Pages: não pode ser usado para rodar um negócio online (loja, vendas, SaaS). Se o site passar a vender, mude a hospedagem: o Cloudflare Pages grátis não tem essa restrição, e o plano grátis da Vercel é só para uso pessoal ou não comercial.
