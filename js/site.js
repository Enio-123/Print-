/* print() · comportamento do site: menus, prova, cursores que constroem a página, rolagem suave e formulário. Regras: veja AGENTS.md na raiz. */
(function(){
  "use strict";
  /* ===== contatos da print(): preencha aqui quando estiverem definidos ===== */
  var CONTATO = {
    whatsapp: "",   // só números, com DDI e DDD. Ex.: "5585999998888"
    email: "falecomprint1@gmail.com", // com domínio próprio, troque por ex.: "falecom@seudominio.com.br"
    instagram: ""   // só o usuário, sem @
  };

  var $ = function(s, el){ return (el || document).querySelector(s); };
  var $$ = function(s, el){ return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var raiz = document.documentElement;
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var anima = raiz.classList.contains("anima");
  var limitar = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
  var suave = function(p){ return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var freia = function(p){ return 1 - Math.pow(1 - p, 3); };
  var agora = function(){ return window.performance && performance.now ? performance.now() : Date.now(); };

  /* ----- cabeçalho: borda ao rolar ----- */
  var topo = $("#topo");
  function aoRolar(){ topo.classList.toggle("rolou", window.scrollY > 8); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* ----- mega menu (computador) ----- */
  var btnServ = $("#btn-servicos"), mega = $("#mega-servicos");
  function abrirMega(abrir){
    btnServ.setAttribute("aria-expanded", abrir ? "true" : "false");
    mega.hidden = !abrir;
    topo.classList.toggle("mega-aberto", abrir);
  }
  btnServ.addEventListener("click", function(e){
    e.stopPropagation();
    var abrir = mega.hidden;
    abrirMega(abrir);
    if (abrir && e.detail === 0){ var l = mega.querySelector("a"); if (l) l.focus(); }
  });
  mega.addEventListener("click", function(e){ if (e.target.closest("a")) abrirMega(false); });
  document.addEventListener("click", function(e){ if (!mega.hidden && !mega.contains(e.target) && e.target !== btnServ) abrirMega(false); });
  mega.addEventListener("focusout", function(e){ if (!mega.contains(e.relatedTarget) && e.relatedTarget !== btnServ) abrirMega(false); });

  /* ----- menu do celular ----- */
  var btnMenu = $("#btn-menu"), gaveta = $("#gaveta"), btnTxt = $("#btn-menu-txt");
  function abrirGaveta(abrir){
    btnMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
    btnTxt.textContent = abrir ? "Fechar" : "Menu";
    gaveta.hidden = !abrir;
    document.body.classList.toggle("menu-aberto", abrir);
  }
  btnMenu.addEventListener("click", function(){ abrirGaveta(gaveta.hidden); });
  gaveta.addEventListener("click", function(e){ if (e.target.closest("a")) abrirGaveta(false); });
  window.addEventListener("resize", function(){ if (window.innerWidth >= 960 && !gaveta.hidden) abrirGaveta(false); });

  document.addEventListener("keydown", function(e){
    if (e.key !== "Escape") return;
    if (!mega.hidden){ abrirMega(false); btnServ.focus(); }
    if (!gaveta.hidden){ abrirGaveta(false); btnMenu.focus(); }
  });

  /* ----- rolagem suave: a roda do mouse e o touchpad deslizam; links internos deslizam até a seção.
     No celular, o dedo continua com a rolagem do próprio aparelho. Com "reduzir movimento", nada muda. ----- */
  var rolagem = (function(){
    if (reduz || !window.requestAnimationFrame) return null;
    raiz.classList.add("suave");
    var FORCA = 6.2; // quanto maior, mais curto o deslize
    var alvoY = window.scrollY, atualY = alvoY, aplicado = alvoY, ligado = false, tAnt = 0, ida = null;
    function maxY(){ return Math.max(0, raiz.scrollHeight - window.innerHeight); }
    function sincronizar(){ alvoY = atualY = aplicado = window.scrollY; }
    function parar(){ ligado = false; ida = null; sincronizar(); }
    function iniciar(){ if (!ligado){ ligado = true; tAnt = 0; requestAnimationFrame(passo); } }
    function passo(t){
      if (!ligado) return;
      if (Math.abs(window.scrollY - aplicado) > 2.5){ parar(); return; } // outra coisa rolou a página (teclado, busca)
      var dt = tAnt ? Math.min(0.05, (t - tAnt) / 1000) : 1 / 60;
      tAnt = t;
      var max = maxY(), fim = null;
      if (ida){
        if (ida.t0 === null) ida.t0 = t;
        var p = Math.min(1, (t - ida.t0) / ida.dur);
        atualY = ida.de + (limitar(ida.para(), 0, max) - ida.de) * suave(p);
        alvoY = atualY;
        if (p >= 1){ fim = ida.fim; ida = null; }
      } else {
        alvoY = limitar(alvoY, 0, max);
        atualY += (alvoY - atualY) * (1 - Math.exp(-FORCA * dt));
        if (Math.abs(alvoY - atualY) < 0.5) atualY = alvoY;
      }
      window.scrollTo(0, atualY);
      aplicado = window.scrollY;
      if (!ida && atualY === alvoY){ ligado = false; if (fim) fim(); return; }
      requestAnimationFrame(passo);
    }
    function rolaDentro(el, dy){
      for (; el && el !== document.body && el !== raiz; el = el.parentElement){
        var oy = getComputedStyle(el).overflowY;
        if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1){
          if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
          if (dy < 0 && el.scrollTop > 0) return true;
        }
      }
      return false;
    }
    window.addEventListener("wheel", function(e){
      if (e.defaultPrevented || e.ctrlKey || e.shiftKey || document.body.classList.contains("menu-aberto")) return;
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (!dy || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (rolaDentro(e.target, dy)) return;
      e.preventDefault();
      if (!ligado) sincronizar();
      if (ida){ ida = null; alvoY = atualY; }
      alvoY = limitar(alvoY + dy, 0, maxY());
      iniciar();
    }, { passive: false });
    window.addEventListener("scroll", function(){ if (!ligado) sincronizar(); }, { passive: true });
    window.addEventListener("resize", function(){ if (!ligado) sincronizar(); });
    window.addEventListener("touchstart", function(){ if (ligado) parar(); }, { passive: true });
    window.addEventListener("keydown", function(e){ if (ligado && /^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key)) parar(); });
    return {
      ir: function(el, aoChegar){
        var pad = parseFloat(getComputedStyle(raiz).scrollPaddingTop) || 0;
        var para = function(){ return el.getBoundingClientRect().top + window.scrollY - pad; };
        if (!ligado) sincronizar();
        var d = Math.abs(limitar(para(), 0, maxY()) - atualY);
        if (d < 2){ if (aoChegar) aoChegar(); return; }
        ida = { de: atualY, para: para, t0: null, dur: limitar(480 + d * 0.2, 600, 1300), fim: aoChegar };
        iniciar();
      }
    };
  })();

  /* links internos: clique ou toque deslizam até a seção (pelo teclado, o pulo continua direto) */
  document.addEventListener("click", function(e){
    if (!rolagem || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.detail === 0) return;
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.classList.contains("pular")) return;
    var id = a.getAttribute("href").slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    rolagem.ir(el);
    if (location.hash !== "#" + id){ try { history.pushState(null, "", "#" + id); } catch (err) {} }
  });

  /* ----- prova: as chapas seguem o mouse ----- */
  var placas = { c: $("#placa-c"), m: $("#placa-m"), y: $("#placa-y") };
  var BASE = { c: [-22, -14], m: [22, 14], y: [6, 28] };
  var alvo = { x: 0, y: 0 }, atual = { x: 0, y: 0 }, abertura = 1, rodando = false, tLaco = 0;
  function desenhar(){
    ["c", "m", "y"].forEach(function(k){
      var b = BASE[k];
      var sinal = (k === "m") ? 1 : (k === "c" ? -1 : 0.4);
      var dx = b[0] * abertura + atual.x * 24 * sinal;
      var dy = b[1] * abertura + atual.y * 16 * sinal + (k === "y" ? atual.y * 10 : 0);
      placas[k].setAttribute("transform", "translate(" + dx.toFixed(1) + " " + dy.toFixed(1) + ")");
    });
  }
  function laco(t){
    var dt = tLaco ? Math.min(0.05, (t - tLaco) / 1000) : 1 / 60, k = 1 - Math.exp(-7.7 * dt);
    tLaco = t;
    atual.x += (alvo.x - atual.x) * k;
    atual.y += (alvo.y - atual.y) * k;
    desenhar();
    if (Math.abs(alvo.x - atual.x) > 0.001 || Math.abs(alvo.y - atual.y) > 0.001){ requestAnimationFrame(laco); }
    else { rodando = false; tLaco = 0; }
  }
  function acordar(){ if (!rodando){ rodando = true; requestAnimationFrame(laco); } }
  desenhar();
  if (!reduz){
    var prova = $("#prova");
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches){
      prova.addEventListener("pointermove", function(e){
        var r = prova.getBoundingClientRect();
        alvo.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        alvo.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        acordar();
      });
      prova.addEventListener("pointerleave", function(){ alvo.x = 0; alvo.y = 0; acordar(); });
    } else {
      window.addEventListener("scroll", function(){
        var r = prova.getBoundingClientRect();
        var meio = (r.top + r.height / 2) / window.innerHeight - 0.5;
        alvo.x = Math.max(-1, Math.min(1, meio * -1.6));
        alvo.y = Math.max(-1, Math.min(1, meio * -1.2));
        acordar();
      }, { passive: true });
    }
  }
  /* abre ou fecha as chapas de um logo (1 = em registro) */
  function porPlacas(svg, a){
    if (svg.classList.contains("prova-logo")){ abertura = a; desenhar(); return; }
    $$("use[data-p]", svg).forEach(function(u){
      var b = BASE[u.getAttribute("data-p")];
      u.setAttribute("transform", "translate(" + (b[0] * a).toFixed(1) + " " + (b[1] * a).toFixed(1) + ")");
    });
  }

  /* ===== construção da página: quatro cursores (ciano, magenta, amarelo e preto) constroem cada parte quando ela aparece =====
     Grupos (iguais aos do CSS): varre = títulos pintados, caixa = caixas desenhadas com seleção, sobe = textos de apoio,
     pop = ícones, digita = rótulos digitados, linha = traços riscados, logo = chapas do logo encaixadas, clique = botões do topo. */
  var SEL = {
    varre: ".heroi h1,.cab h2,.servico h3,.publico h3,.etapa h3,.motivo h3,.socio .papel-s,.contato h2",
    caixa: ".servico,.publico,.motivo,.socio,.form,.prova",
    sobe: ".heroi .sub,.cab p.sub,.servico p,.servico ul,.servico .acao,.publico p.desc,.publico ul,.publico .acao,.etapa p,.etapa .saida,.motivo p,.socio .nome,.socio p.desc,.contato .sub,.canais,.rodape-marca p,.col,.base",
    pop: ".servico .ico,.etapa .num i,.motivo .marca-c",
    digita: ".cab > .rot,.publico > .rot,.socio > .rot,.contato .rot,.etapa .num",
    linha: ".etapas,.contato",
    logo: ".prova-logo,.rodape-marca .logo-cor",
    clique: ".heroi .ctas"
  };
  var NOME_ANIM = { varre: "varrer", caixa: "registro", sobe: "sobe", pop: "pop", linha: "risca", clique: "aparece-r" };
  var TIPO = { varre: "pintar", caixa: "caixa", linha: "linha", logo: "placas", clique: "clique" };
  var CORES = ["c", "m", "y", "k"];
  var NOMES = { c: "ciano", m: "magenta", y: "amarelo", k: "preto" };
  var REF = { c: [300, -270], m: [1450, -250], y: [2550, -300] }; // onde cada cursor segura a sua chapa (unidades do desenho do logo)
  var pressa = false, desligado = false;
  function grupoDe(el){ for (var g in SEL){ if (el.matches(SEL[g])) return g; } return null; }

  /* animação simples de cada grupo: textos de apoio, e qualquer parte quando os quatro cursores estão ocupados */
  function imprimir(el, atraso, fim){
    var g = grupoDe(el);
    if (g === "digita"){ digitar(el, atraso, fim); return; }
    if (g === "logo"){ registrarLogo(el, atraso, fim); return; }
    el.style.setProperty("--atraso", atraso.toFixed(2) + "s");
    el.classList.add("impresso");
    var pronto = false;
    function terminar(){
      if (pronto) return;
      pronto = true;
      el.removeEventListener("animationend", aoFim);
      el.classList.remove("impresso"); el.classList.add("feito"); el.style.removeProperty("--atraso");
      if (fim) fim();
    }
    function aoFim(e){ if (e.target === el && e.animationName === NOME_ANIM[g]) terminar(); }
    el.addEventListener("animationend", aoFim);
    setTimeout(terminar, (atraso + 2.4) * 1000);
  }

  function digitar(el, atraso, fim){
    setTimeout(function(){
      if (el.classList.contains("feito")){ if (fim) fim(); return; }
      var nos = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      while (w.nextNode()) nos.push(w.currentNode);
      var partes = nos.map(function(n){
        var v = document.createElement("span"), r = document.createElement("span");
        r.className = "d-r"; r.textContent = n.nodeValue;
        n.parentNode.replaceChild(r, n); r.parentNode.insertBefore(v, r);
        return { v: v, r: r, txt: r.textContent };
      });
      var cursor = document.createElement("span"); cursor.className = "d-cursor"; cursor.setAttribute("aria-hidden", "true");
      el.classList.add("digitando");
      var i = 0, j = 0;
      (function passo(){
        if (pressa) i = partes.length;
        if (i >= partes.length){
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          partes.forEach(function(p){ p.v.parentNode.insertBefore(document.createTextNode(p.txt), p.v); p.v.parentNode.removeChild(p.v); p.r.parentNode.removeChild(p.r); });
          el.normalize();
          el.classList.remove("digitando"); el.classList.add("feito");
          if (fim) fim();
          return;
        }
        var p = partes[i];
        if (j === 0) p.r.parentNode.insertBefore(cursor, p.r);
        j++; p.v.textContent = p.txt.slice(0, j); p.r.textContent = p.txt.slice(j);
        if (j >= p.txt.length){ i++; j = 0; }
        setTimeout(passo, 24 + Math.random() * 34);
      })();
    }, atraso * 1000);
  }

  function registrarLogo(svg, atraso, fim){
    porPlacas(svg, 4.2);
    svg.style.setProperty("--atraso", atraso.toFixed(2) + "s");
    svg.classList.add("impresso");
    setTimeout(function(){
      var t0 = null;
      requestAnimationFrame(function quadroL(t){
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / 1100);
        if (p < 1){ porPlacas(svg, 4.2 - 3.2 * freia(p)); requestAnimationFrame(quadroL); return; }
        porPlacas(svg, 1);
        svg.classList.remove("impresso"); svg.classList.add("feito"); svg.style.removeProperty("--atraso");
        if (fim) fim();
      });
    }, atraso * 1000);
  }

  function iniciarLoop(){
    var linha = $(".heroi .linha-cod"), alvoP = $("#palavra");
    var palavras = ["seu negócio", "sua padaria", "sua clínica", "sua loja", "sua startup"];
    var k = 0, txt = "", apagando = false, visivel = true;
    new IntersectionObserver(function(es){ visivel = es[es.length - 1].isIntersecting; }).observe($(".heroi"));
    alvoP.textContent = "";
    linha.classList.add("digitando");
    (function tick(){
      if (!visivel || document.hidden){ setTimeout(tick, 400); return; }
      var alvoT = palavras[k];
      if (!apagando){
        txt = alvoT.slice(0, txt.length + 1); alvoP.textContent = txt;
        if (txt === alvoT){ apagando = true; setTimeout(tick, 2300); return; }
        setTimeout(tick, 55 + Math.random() * 45);
      } else {
        txt = txt.slice(0, -1); alvoP.textContent = txt;
        if (!txt){ apagando = false; k = (k + 1) % palavras.length; setTimeout(tick, 320); return; }
        setTimeout(tick, 30);
      }
    })();
  }

  /* ----- cada parte da página é um "nó": espera aparecer na tela e espera a parte de que depende ----- */
  var nos = [], io = null;
  function antes(a, b){ return !!(a.compareDocumentPosition(b) & 4); }
  function ordemDoc(a, b){ return a.el === b.el ? 0 : (antes(a.el, b.el) ? -1 : 1); }
  function paiDe(el){
    var caixa = el.parentElement && el.parentElement.closest(SEL.caixa);
    if (caixa){ // dentro de uma caixa: o texto espera o título da caixa; título, ícone e rótulo esperam a caixa
      var tit = caixa.querySelector(SEL.varre);
      return (tit && tit !== el && el.matches(SEL.sobe) && antes(tit, el)) ? tit : caixa;
    }
    if (el.matches(".rodape-marca p")) return $(".rodape-marca .logo-cor");
    var bloco = el.closest(".cab,.etapa,.contato-in > div,.heroi-in > div");
    if (bloco && el.matches(SEL.sobe + "," + SEL.clique)){
      var t = bloco.querySelector(SEL.varre);
      if (t && t !== el && antes(t, el)) return t;
    }
    return null;
  }
  function corDe(n){ // cursor preferido de cada parte (a cor do cartão, do motivo ou da etapa)
    var el = n.el;
    if (n.tipo === "caixa"){
      for (var i = 0; i < 4; i++){ if (el.matches(".servico") && el.classList.contains(CORES[i])) return CORES[i]; }
      if (el.matches(".motivo")){ var mc = $(".marca-c", el), l = mc ? mc.textContent.trim().toLowerCase() : ""; if (CORES.indexOf(l) >= 0) return l; }
      if (el.matches(".publico")) return el.classList.contains("escuro") ? "y" : "m";
      if (el.matches(".socio")) return $$(".socio").indexOf(el) % 2 ? "m" : "c";
      return "c";
    }
    if (n.tipo === "pintar"){
      if (n.pai && n.pai.cor) return n.pai.cor;
      if (el.matches(".heroi h1")) return "k";
      var et = el.closest(".etapa");
      return et ? CORES[$$(".etapa").indexOf(et) % 4] : null;
    }
    if (n.tipo === "linha") return el.matches(".etapas") ? "k" : "m";
    if (n.tipo === "clique") return "k";
    if (n.tipo === "placas") return "c";
    return null;
  }
  function criarNos(){
    Object.keys(SEL).forEach(function(g){
      $$(SEL[g]).forEach(function(el){
        if (el.__no) return;
        var n = { el: el, tipo: TIPO[g] || "auto", estado: "espera", vis: false, ok: false, liberado: false, pai: null, filhos: [], cbs: [], cor: null, pronto: 0, desde: 0 };
        el.__no = n; nos.push(n);
      });
    });
    nos.forEach(function(n){ var p = paiDe(n.el); if (p && p.__no && p.__no !== n){ n.pai = p.__no; p.__no.filhos.push(n); } });
    nos.forEach(function(n){ if (n.tipo === "caixa") n.cor = corDe(n); });
    nos.forEach(function(n){ if (n.tipo !== "caixa") n.cor = corDe(n); });
  }

  /* ----- os quatro cursores ----- */
  var CUR = {}, LISTA = [], camada = null, rodandoC = false;
  var SETA = '<svg viewBox="0 0 17 23" aria-hidden="true"><path d="M1.5 1.5v16.2l4.2-4 2.9 6.8 3-1.25-2.85-6.7h6.05z"/></svg>';
  function criarCursores(){
    camada = document.createElement("div");
    camada.className = "cursores"; camada.setAttribute("aria-hidden", "true");
    CORES.forEach(function(k, i){
      var sel = document.createElement("div"); sel.className = "sel sel-" + k;
      sel.innerHTML = '<i></i><i></i><i></i><i></i><span class="med"></span>';
      var toq = document.createElement("div"); toq.className = "toque toque-" + k;
      var el = document.createElement("div"); el.className = "cur cur-" + k;
      el.innerHTML = SETA + '<span class="nome">' + NOMES[k] + "</span>";
      camada.appendChild(sel); camada.appendChild(toq); camada.appendChild(el);
      var c = { k: k, el: el, sel: sel, med: sel.querySelector(".med"), toq: toq, x: -60, y: -60, vis: false, fila: [], tarefa: null, ocio: 0, lado: i % 2 ? 1 : -1, selEl: null, selAte: 0 };
      CUR[k] = c; LISTA.push(c);
    });
    document.body.appendChild(camada);
  }
  function mover(c, x, y){
    if (!isFinite(x) || !isFinite(y)) return;
    c.x = x; c.y = y;
    c.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
  }
  function mostrar(c, sim){ if (c.vis !== sim){ c.vis = sim; c.el.classList.toggle("ve", sim); } }
  function apertar(c, sim){ c.el.classList.toggle("aperta", sim); }
  function entrada(c){ // cada cursor entra por um lado da tela
    var W = window.innerWidth, H = window.innerHeight;
    return { c: [-30, H * 0.42], m: [W + 30, H * 0.28], y: [W * 0.82, H + 30], k: [W * 0.14, H + 30] }[c.k];
  }
  function selecao(c, x, y, w, h){
    w = Math.max(0, w); h = Math.max(0, h);
    c.sel.style.transform = "translate3d(" + (x - 1).toFixed(1) + "px," + (y - 1).toFixed(1) + "px,0)";
    c.sel.style.width = (w + 2).toFixed(1) + "px";
    c.sel.style.height = (h + 2).toFixed(1) + "px";
    c.med.textContent = Math.round(w) + " \u00d7 " + Math.round(h);
    c.med.style.visibility = (w > 40 && h > 24) ? "" : "hidden"; // a medida só aparece quando a seleção já tem tamanho
  }
  function verSel(c, sim){ c.sel.classList.toggle("ve", sim); if (!sim) c.selEl = null; }
  function toque(c, x, y){
    var t = c.toq;
    t.style.left = x.toFixed(1) + "px"; t.style.top = y.toFixed(1) + "px";
    t.classList.remove("vai"); void t.offsetWidth; t.classList.add("vai");
  }

  function ligar(){ if (!rodandoC && !desligado){ rodandoC = true; requestAnimationFrame(quadro); } }
  function quadro(t){
    if (desligado){ rodandoC = false; return; }
    try {
      var vivo = false;
      for (var i = 0; i < LISTA.length; i++){
        var c = LISTA[i];
        if (!c.tarefa) proxima(c);
        if (c.tarefa){ executar(c, t); vivo = true; c.ocio = 0; }
        else if (c.vis){
          if (!c.ocio) c.ocio = t;
          if (t - c.ocio > 1100) mostrar(c, false); else vivo = true;
        }
        if (c.selEl){
          var r = c.selEl.getBoundingClientRect();
          selecao(c, r.left, r.top, r.width, r.height);
          if (t > c.selAte) verSel(c, false); else vivo = true;
        }
      }
      if (vivo) requestAnimationFrame(quadro); else rodandoC = false;
    } catch (err) {
      rodandoC = false;
      desligar();
    }
  }
  function proxima(c){
    while (c.fila.length){
      var item = c.fila.shift(), passos = item.montar(c);
      if (!passos) continue;
      if (!c.vis){ var p = entrada(c); mover(c, p[0], p[1]); mostrar(c, true); }
      c.tarefa = { item: item, passos: passos, i: 0, t0: null, dur: 0 };
      return;
    }
  }
  /* cada tarefa é uma lista de passos: { ini, dur (s), upd(p de 0 a 1), ate (termina antes), fim } */
  function executar(c, t){
    var tf = c.tarefa;
    for (var volta = 0; volta < 24; volta++){
      var ps = tf.passos[tf.i];
      if (!ps){ c.tarefa = null; c.ocio = t; return; }
      if (tf.t0 === null){
        tf.t0 = t;
        if (ps.ini) ps.ini(c, tf);
        if (c.tarefa !== tf) return;
        tf.dur = (typeof ps.dur === "function" ? ps.dur(c, tf) : (ps.dur || 0)) * 1000;
      }
      var p = tf.dur > 0 ? Math.min(1, (t - tf.t0) / tf.dur) : 1;
      if (ps.ate && ps.ate(c, tf)) p = 1;
      if (ps.upd) ps.upd(c, tf, p);
      if (p < 1) return;
      if (ps.fim) ps.fim(c, tf);
      if (c.tarefa !== tf) return;
      tf.i++; tf.t0 = null;
    }
  }
  function passoVoar(alvoFn){ // voo curvo até um ponto que pode estar se mexendo (a página rola)
    return {
      ini: function(c, tf){
        var a = alvoFn();
        tf.de = [c.x, c.y];
        tf.dist = Math.hypot(a[0] - c.x, a[1] - c.y);
        tf.curva = c.lado * Math.min(56, tf.dist * 0.15);
      },
      dur: function(c, tf){ return tf.dist < 3 ? 0 : limitar(0.18 + tf.dist / 2600, 0.22, 0.5); },
      upd: function(c, tf, p){
        var a = alvoFn(), e = suave(p), dx = a[0] - tf.de[0], dy = a[1] - tf.de[1], L = Math.hypot(dx, dy) || 1, s = Math.sin(Math.PI * e) * tf.curva;
        mover(c, tf.de[0] + dx * e - dy / L * s, tf.de[1] + dy * e + dx / L * s);
      }
    };
  }

  function passoAfastar(vetFn){ // depois de soltar, o cursor sai de cima do que construiu
    return {
      ini: function(c, tf){ tf.de = [c.x, c.y]; tf.vet = vetFn(c); },
      dur: 0.38,
      upd: function(c, tf, p){ var e = freia(p); mover(c, tf.de[0] + tf.vet[0] * e, tf.de[1] + tf.vet[1] * e); }
    };
  }
  function longeDe(el, dist){ // vetor que leva o cursor para longe do centro do elemento
    return function(c){
      var r = el.getBoundingClientRect(), dx = c.x - (r.left + r.width / 2), dy = c.y - (r.top + r.height / 2), L = Math.hypot(dx, dy) || 1;
      return [dx / L * dist, dy / L * dist + 12];
    };
  }

  /* CAIXA: o cursor arrasta uma seleção do canto de cima ao canto de baixo; ao soltar, as chapas C, M e Y se encaixam */
  function tarefaCaixa(c, n, item){
    var el = n.el;
    function ret(){ return el.getBoundingClientRect(); }
    function arrastar(p){
      var r = ret(), e = suave(p);
      var fimY = Math.min(r.bottom, Math.max(r.top + 40, window.innerHeight - 28));
      var x = r.left + r.width * e, y = r.top + (fimY - r.top) * e;
      var w = x - r.left, h = y - r.top;
      if (p >= 1){ w = r.width; h = r.height; }
      el.style.setProperty("--dr", Math.max(0, r.width - w).toFixed(1) + "px");
      el.style.setProperty("--db", Math.max(0, r.height - h).toFixed(1) + "px");
      selecao(c, r.left, r.top, w, h);
      mover(c, x, y);
    }
    item.limpar = function(){
      el.classList.remove("vivo", "desenhando"); el.style.removeProperty("--dr"); el.style.removeProperty("--db");
      verSel(c, false); apertar(c, false);
    };
    return [
      passoVoar(function(){ var r = ret(); return [r.left, r.top]; }),
      { dur: 0.08, ini: function(){
          c.selEl = null; apertar(c, true);
          el.classList.add("vivo", "desenhando"); arrastar(0); verSel(c, true);
        } },
      { dur: function(){ var r = ret(); return limitar(0.3 + Math.hypot(r.width, Math.min(r.height, window.innerHeight)) / 3000, 0.36, 0.6); },
        upd: function(c, tf, p){ arrastar(p); } },
      { ini: function(){
          apertar(c, false);
          el.classList.remove("desenhando"); el.style.removeProperty("--dr"); el.style.removeProperty("--db");
          registrar(el);
          c.selEl = el; c.selAte = agora() + 450;
          concluir(n);
        } }
    ];
  }
  function registrar(el){
    el.classList.add("registra");
    var pronto = false;
    function fim(e){
      if (pronto || (e && (e.target !== el || e.animationName !== "registro-c"))) return;
      pronto = true;
      el.removeEventListener("animationend", fim);
      el.classList.remove("registra", "vivo"); el.classList.add("feito");
    }
    el.addEventListener("animationend", fim);
    setTimeout(fim, 1500);
  }

  /* VARRE: o cursor pinta o título palavra por palavra, linha por linha; a tinta passa por ciano, magenta e amarelo */
  function tarefaPintar(c, n, item){
    var el = n.el, pal = [], est = [], segs = [], total = 0, b = 8;
    function embrulhar(){
      var textos = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      while (w.nextNode()) textos.push(w.currentNode);
      textos.forEach(function(tx){
        var fr = document.createDocumentFragment();
        tx.nodeValue.split(/(\s+)/).forEach(function(s){
          if (!s) return;
          if (/^\s+$/.test(s)){ fr.appendChild(document.createTextNode(s)); return; }
          var sp = document.createElement("span"); sp.className = "pp"; sp.textContent = s;
          fr.appendChild(sp); pal.push(sp); est.push(0);
        });
        tx.parentNode.replaceChild(fr, tx);
      });
    }
    function desembrulhar(){
      pal.forEach(function(sp){ if (sp.parentNode) sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp); });
      pal = []; est = [];
      el.normalize();
    }
    function medir(){
      var ls = [], rs = [], lin = [], L = null;
      for (var i = 0; i < pal.length; i++){
        var r = pal[i].getBoundingClientRect();
        rs.push(r);
        if (!L || r.top >= L.b - r.height * 0.45){ L = { t: r.top, b: r.bottom, l: r.left, r: r.right }; ls.push(L); }
        else { L.t = Math.min(L.t, r.top); L.b = Math.max(L.b, r.bottom); L.l = Math.min(L.l, r.left); L.r = Math.max(L.r, r.right); }
        lin.push(ls.length - 1);
      }
      return { ls: ls, rs: rs, lin: lin };
    }
    function planejar(ls){
      var soma = 0, t = 0;
      ls.forEach(function(L){ soma += Math.max(1, L.r - L.l + 3 * b); });
      var tp = limitar(0.22 + soma / 2300, 0.3, 0.85), v = soma / tp;
      segs = [];
      ls.forEach(function(L, i){
        if (i > 0){ segs.push({ volta: true, t0: t, t1: t + 0.13, de: i - 1, para: i }); t += 0.13; }
        var d = Math.max(1, L.r - L.l + 3 * b) / v;
        segs.push({ volta: false, t0: t, t1: t + d, i: i }); t += d;
      });
      total = t;
    }
    function altura(L){ return L.t + (L.b - L.t) * 0.62; }
    function aplicar(i, st, fx){
      var sp = pal[i];
      if (st === 1){
        var a = (fx - 3 * b).toFixed(1), bb = (fx - 2 * b).toFixed(1), cc = (fx - b).toFixed(1), f = fx.toFixed(1);
        sp.style.backgroundImage = "linear-gradient(90deg,var(--final) " + a + "px,var(--y) " + a + "px " + bb + "px,var(--m) " + bb + "px " + cc + "px,var(--c) " + cc + "px " + f + "px,transparent " + f + "px)";
      } else if (est[i] === 1) sp.style.backgroundImage = "";
      if (st !== est[i]){ sp.classList.toggle("ok", st === 2); est[i] = st; }
    }
    function pintar(tt){
      var m = medir(), ls = m.ls;
      if (!ls.length || !segs.length) return;
      var sg = segs[segs.length - 1];
      for (var s = 0; s < segs.length; s++){ if (tt <= segs[s].t1){ sg = segs[s]; break; } }
      var q = sg.t1 > sg.t0 ? limitar((tt - sg.t0) / (sg.t1 - sg.t0), 0, 1) : 1;
      var li, fx, cx, cy;
      if (!sg.volta){
        li = Math.min(sg.i, ls.length - 1);
        var L = ls[li];
        fx = L.l + (L.r + 3 * b - L.l) * q; cx = fx; cy = altura(L);
      } else { // volta para o começo da linha de baixo, como numa máquina de escrever
        var A = ls[Math.min(sg.de, ls.length - 1)], B = ls[Math.min(sg.para, ls.length - 1)], e = suave(q);
        li = Math.min(sg.para, ls.length - 1); fx = -1e5;
        cx = A.r + 3 * b + (B.l - A.r - 3 * b) * e; cy = altura(A) + (altura(B) - altura(A)) * e;
      }
      for (var i = 0; i < pal.length; i++){
        var lw = m.lin[i], st, fxw = 0;
        if (lw < li) st = 2;
        else if (lw > li) st = 0;
        else { fxw = fx - m.rs[i].left; st = fxw <= 0 ? 0 : (fxw - 3 * b >= m.rs[i].width ? 2 : 1); }
        aplicar(i, st, fxw);
      }
      mover(c, cx, cy);
    }
    item.limpar = function(){ desembrulhar(); el.classList.remove("pintando"); };
    return [
      { ini: function(){
          embrulhar(); el.classList.add("pintando");
          b = limitar(parseFloat(getComputedStyle(el).fontSize) * 0.16, 5, 14);
          planejar(medir().ls);
        } },
      passoVoar(function(){ var ls = medir().ls; return ls.length ? [ls[0].l, altura(ls[0])] : [c.x, c.y]; }),
      { dur: function(){ return total; }, upd: function(c, tf, p){ pintar(p * total); if (p >= 0.6) liberar(n); } },
      { ini: function(){ desembrulhar(); el.classList.remove("pintando"); el.classList.add("feito"); concluir(n); } }
    ];
  }

  /* LINHA: o cursor risca o traço da esquerda para a direita */
  function tarefaLinha(c, n, item){
    var el = n.el, dy = el.matches(".contato") ? 3 : 0.75;
    function ponto(p){ var r = el.getBoundingClientRect(); return [r.left + r.width * p, r.top + dy]; }
    item.limpar = function(){ el.classList.remove("riscando"); el.style.removeProperty("--risca"); apertar(c, false); };
    return [
      passoVoar(function(){ return ponto(0); }),
      { dur: 0.08, ini: function(){ apertar(c, true); el.style.setProperty("--risca", "0"); el.classList.add("riscando"); } },
      { dur: function(){ return limitar(0.4 + el.getBoundingClientRect().width / 3000, 0.45, 0.8); },
        upd: function(c, tf, p){ var e = suave(p), q = ponto(e); el.style.setProperty("--risca", e.toFixed(4)); mover(c, q[0], q[1]); } },
      { ini: function(){ apertar(c, false); el.classList.add("feito"); el.classList.remove("riscando"); el.style.removeProperty("--risca"); concluir(n); } }
    ];
  }

  /* CLIQUE: o cursor preto clica e os botões do topo aparecem */
  function tarefaClique(c, n, item){
    var el = n.el;
    function ponto(){ var bt = $(".btn", el) || el, r = bt.getBoundingClientRect(); return [r.left + Math.min(r.width * 0.42, 78), r.top + r.height * 0.6]; }
    item.limpar = function(){ apertar(c, false); };
    return [
      passoVoar(ponto),
      { dur: 0.12, ini: function(){ apertar(c, true); var p = ponto(); toque(c, p[0], p[1]); } },
      { dur: 0.16, ini: function(){ apertar(c, false); imprimir(el, 0, function(){ concluir(n); }); } },
      passoAfastar(function(){ return [22, 34]; })
    ];
  }

  /* LOGO: ciano, magenta e amarelo seguram cada um a sua chapa e arrastam até o registro */
  function tarefaPlacas(c, n, item){
    var svg = n.el, A0 = 4.2, ctx = { svg: svg, a: 4.2, fim: false, prontos: {} };
    ctx.ponto = function(k){
      var m = svg.getScreenCTM();
      if (!m) return [CUR[k].x, CUR[k].y];
      var x = REF[k][0] + BASE[k][0] * ctx.a, y = REF[k][1] + BASE[k][1] * ctx.a;
      return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
    };
    function segurar(){ var q = ctx.ponto("c"); mover(c, q[0], q[1]); }
    item.limpar = function(){ ctx.fim = true; ctx.a = 1; porPlacas(svg, 1); svg.classList.remove("montando"); apertar(c, false); };
    return [
      { ini: function(){
          var m = svg.getScreenCTM(), esc = m ? Math.abs(m.a) : 0.1;
          A0 = limitar(30 / (22 * esc), 4.2, 30); ctx.a = A0; porPlacas(svg, A0);
          svg.classList.add("montando");
          ["m", "y"].forEach(function(k){ CUR[k].fila.unshift(itemSeguir(k, ctx)); });
        } },
      passoVoar(function(){ return ctx.ponto("c"); }),
      { dur: 0.6, ini: function(){ apertar(c, true); ctx.prontos.c = true; }, ate: function(){ return ctx.prontos.m && ctx.prontos.y; }, upd: segurar },
      { dur: 0.14, upd: segurar },
      { dur: 0.8, ini: function(){ liberar(n); }, upd: function(c, tf, p){ ctx.a = A0 + (1 - A0) * freia(p); porPlacas(svg, ctx.a); segurar(); } },
      { ini: function(){
          ctx.a = 1; porPlacas(svg, 1); ctx.fim = true; apertar(c, false);
          svg.classList.remove("montando"); svg.classList.add("feito");
          concluir(n);
        } },
      passoAfastar(longeDe(svg, 44))
    ];
  }
  function itemSeguir(k, ctx){
    return { n: null, montar: function(c){
      if (ctx.fim) return null;
      this.limpar = function(){ apertar(c, false); };
      return [
        passoVoar(function(){ return ctx.ponto(k); }),
        { dur: 3, ini: function(){ apertar(c, true); ctx.prontos[k] = true; }, ate: function(){ return ctx.fim; }, upd: function(){ var q = ctx.ponto(k); mover(c, q[0], q[1]); } },
        { ini: function(){ apertar(c, false); } },
        passoAfastar(longeDe(ctx.svg, 44))
      ];
    } };
  }

  /* ----- quem faz o quê ----- */
  var MONTA = { caixa: tarefaCaixa, pintar: tarefaPintar, linha: tarefaLinha, clique: tarefaClique, placas: tarefaPlacas };
  function itemNo(n){
    return { n: n, montar: function(c){
      if (n.estado !== "fila") return null;
      if (!n.vis || !naTela(n.el)){ n.estado = "espera"; return null; } // saiu da tela antes da vez: espera voltar
      n.estado = "obra";
      if (agora() - n.desde > 2200){ imprimir(n.el, 0, function(){ concluir(n); }); return null; } // esperou demais: aparece sem cursor
      return MONTA[n.tipo](c, n, this);
    } };
  }
  function naTela(el){ var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
  function carga(c){ return c.fila.length + (c.tarefa ? 1 : 0); }
  function distancia(c, el){ var r = el.getBoundingClientRect(); return Math.hypot(c.x - r.left, c.y - r.top); }
  function atribuir(n){
    var pref = n.cor ? CUR[n.cor] : null, esc = null;
    if (pref && carga(pref) <= 1) esc = pref;
    if (!esc){
      var livres = LISTA.filter(function(c){ return carga(c) === 0; });
      if (livres.length){ livres.sort(function(a, b){ return distancia(a, n.el) - distancia(b, n.el); }); esc = livres[0]; }
    }
    if (!esc && pref && carga(pref) <= 2) esc = pref;
    if (!esc){
      var menor = LISTA.slice().sort(function(a, b){ return carga(a) - carga(b); })[0];
      if (carga(menor) <= 1) esc = menor;
    }
    if (!esc){ n.estado = "obra"; imprimir(n.el, 0, function(){ concluir(n); }); return; } // todos ocupados: aparece sem cursor
    n.estado = "fila"; n.desde = agora();
    esc.fila.push(itemNo(n));
    ligar();
  }
  function tentar(n, k){
    if (desligado || n.estado !== "espera" || !n.vis || (n.pai && !n.pai.liberado)) return false;
    if (n.tipo === "auto"){
      n.estado = "obra";
      imprimir(n.el, Math.min(0.45, (k || 0) * 0.07), function(){ concluir(n); });
      return true;
    }
    atribuir(n);
    return false;
  }
  function liberar(n){ // o que depende desta parte já pode começar
    if (n.liberado) return;
    n.liberado = true;
    var k = 0;
    n.filhos.slice().sort(ordemDoc).forEach(function(f){ if (tentar(f, k)) k++; });
  }
  function concluir(n){
    if (n.ok) return;
    n.ok = true; n.estado = "feito";
    if (io) io.unobserve(n.el);
    liberar(n);
    var cbs = n.cbs; n.cbs = [];
    cbs.forEach(function(f){ f(); });
  }
  function quandoPronto(el, fn, max){ // chama fn quando a parte estiver construída (ou depois de max ms)
    var n = el && el.__no, foi = false;
    function vai(){ if (!foi){ foi = true; fn(); } }
    if (!n || n.ok || desligado){ vai(); return; }
    n.cbs.push(vai);
    setTimeout(vai, max || 1600);
  }
  function forcar(n){ // mostra a parte na hora, sem cursor
    if (n.ok) return;
    LISTA.forEach(function(c){
      c.fila = c.fila.filter(function(it){ return it.n !== n; });
      if (c.tarefa && c.tarefa.item.n === n){ var it = c.tarefa.item; c.tarefa = null; if (it.limpar) it.limpar(); apertar(c, false); }
    });
    var el = n.el;
    el.classList.remove("impresso", "pintando", "desenhando", "registra", "riscando", "montando", "vivo");
    ["--atraso", "--dr", "--db", "--risca"].forEach(function(p){ el.style.removeProperty(p); });
    if (n.tipo === "placas") porPlacas(el, 1);
    el.classList.add("feito");
    concluir(n);
  }
  function desligar(){ // qualquer falha: para os cursores e mostra a página inteira
    desligado = true;
    LISTA.forEach(function(c){
      var it = c.tarefa && c.tarefa.item;
      c.tarefa = null; c.fila = [];
      if (it && it.limpar){ try { it.limpar(); } catch (e) {} }
    });
    $$(SEL.logo).forEach(function(svg){ try { porPlacas(svg, 1); } catch (e) {} });
    raiz.classList.remove("anima");
    if (camada) camada.hidden = true;
  }
  function fundo(){
    if (desligado || window.scrollY + window.innerHeight < raiz.scrollHeight - 4) return;
    var k = 0;
    nos.forEach(function(n){
      if (n.ok || n.vis || !naTela(n.el) || !(n.el.getClientRects().length)) return;
      n.vis = true;
      if (tentar(n, k)) k++;
    });
  }
  function vigiar(){ // rede de segurança: nada fica escondido na tela por mais de 6 s
    if (desligado) return;
    fundo();
    var t = agora();
    nos.forEach(function(n){
      if (n.ok || !n.vis || (n.pai && !n.pai.liberado)){ n.pronto = 0; return; }
      if (!n.pronto) n.pronto = t;
      else if (t - n.pronto > 6000) forcar(n);
    });
  }

  if (anima){
    try {
      criarNos();
      criarCursores();
      $$(SEL.logo).forEach(function(svg){ porPlacas(svg, 4.2); });
      io = new IntersectionObserver(function(es){
        if (desligado) return;
        var novos = [], acima = [];
        es.forEach(function(e){
          var n = e.target.__no; if (!n) return;
          n.vis = e.isIntersecting;
          if (n.vis) novos.push(n);
          else if (e.boundingClientRect.bottom <= 0 && !n.ok && n.estado !== "obra") acima.push(n);
        });
        acima.forEach(forcar); // passou para cima sem ser construída: aparece pronta para quando a pessoa voltar
        novos.sort(ordemDoc);
        var k = 0;
        novos.forEach(function(n){ if (tentar(n, k)) k++; });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
      /* no fim da página, o rodapé nunca passa da margem de baixo: entra assim que aparece */
      var olhando = false;
      window.addEventListener("scroll", function(){
        if (olhando) return;
        olhando = true;
        requestAnimationFrame(function(){ olhando = false; fundo(); });
      }, { passive: true });
      nos.forEach(function(n){ io.observe(n.el); });
      setTimeout(iniciarLoop, 150);
      /* quem navega pelo teclado não espera: a parte com foco aparece na hora */
      document.addEventListener("focusin", function(e){
        if (desligado) return;
        nos.forEach(function(n){ if (!n.ok && n.estado !== "obra" && n.el.contains(e.target)) forcar(n); });
      });
      setInterval(vigiar, 1200);
      /* ao imprimir no papel, mostra tudo de uma vez */
      window.addEventListener("beforeprint", function(){ pressa = true; desligar(); });
    } catch (err) {
      desligar();
    }
  }
  window.__printOK = true;

  /* ----- contatos (só aparecem os que foram definidos) ----- */
  var canais = $("#canais"), rodapeC = $("#rodape-contatos");
  var lista = [];
  if (CONTATO.whatsapp) lista.push({ rot: "whatsapp", txt: formatarFone(CONTATO.whatsapp), href: "https://wa.me/" + CONTATO.whatsapp });
  if (CONTATO.email) lista.push({ rot: "e-mail", txt: CONTATO.email, href: "mailto:" + CONTATO.email });
  if (CONTATO.instagram) lista.push({ rot: "instagram", txt: "@" + CONTATO.instagram, href: "https://instagram.com/" + CONTATO.instagram });
  function formatarFone(n){
    var m = String(n).match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? "(" + m[1] + ") " + m[2] + "-" + m[3] : "+" + n;
  }
  if (lista.length){
    lista.forEach(function(c){
      var d = document.createElement("div"); d.className = "canal";
      var s = document.createElement("span"); s.textContent = c.rot;
      var a = document.createElement("a"); a.href = c.href; a.textContent = c.txt; a.rel = "noopener"; if (c.href.indexOf("http") === 0) a.target = "_blank";
      d.appendChild(s); d.appendChild(a); canais.appendChild(d);
      var li = document.createElement("li"); var a2 = a.cloneNode(true); li.appendChild(a2); rodapeC.appendChild(li);
    });
  } else {
    /* sem canal definido: a lista some e o rodapé leva ao formulário */
    canais.hidden = true;
    var li = document.createElement("li"), a0 = document.createElement("a");
    a0.href = "#contato"; a0.textContent = "Pedir orçamento";
    li.appendChild(a0); rodapeC.appendChild(li);
  }

  /* ----- formulário ----- */
  var form = $("#form"), resultado = $("#resultado");
  function irParaForm(focar){
    var alvoEl = $("#contato");
    var focarNome = function(){ if (focar) quandoPronto(form, function(){ $("#f-nome").focus({ preventScroll: true }); }); };
    if (rolagem) rolagem.ir(alvoEl, focarNome);
    else { alvoEl.scrollIntoView({ behavior: "auto", block: "start" }); focarNome(); }
  }
  $$("[data-servico]").forEach(function(b){
    b.addEventListener("click", function(){
      var v = b.getAttribute("data-servico");
      $$('input[name="precisa"]').forEach(function(i){ if (i.value === v) i.checked = true; });
      limparErro("precisa");
      irParaForm(true);
    });
  });
  $$("[data-publico]").forEach(function(b){
    b.addEventListener("click", function(){
      $("#f-negocio").value = b.getAttribute("data-publico");
      limparErro("negocio");
      irParaForm(true);
    });
  });
  function erro(campo, msg){ var c = $("#campo-" + campo); c.setAttribute("data-erro", ""); $("#erro-" + campo).textContent = msg; }
  function limparErro(campo){ var c = $("#campo-" + campo); if (c){ c.removeAttribute("data-erro"); $("#erro-" + campo).textContent = ""; } }
  $("#f-nome").addEventListener("input", function(){ limparErro("nome"); });
  $("#f-negocio").addEventListener("change", function(){ limparErro("negocio"); });
  $$('input[name="precisa"]').forEach(function(i){ i.addEventListener("change", function(){ limparErro("precisa"); }); });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var nome = $("#f-nome").value.trim();
    var negocio = $("#f-negocio").value;
    var precisa = $$('input[name="precisa"]:checked').map(function(i){ return i.value; });
    var msg = $("#f-msg").value.trim();
    var primeiro = null;
    if (nome.length < 2){ erro("nome", "Escreva o seu nome."); primeiro = primeiro || $("#f-nome"); }
    if (!negocio){ erro("negocio", "Escolha o tipo de cliente."); primeiro = primeiro || $("#f-negocio"); }
    if (!precisa.length){ erro("precisa", "Marque pelo menos uma opção."); primeiro = primeiro || $("#f-p1"); }
    if (primeiro){ primeiro.focus(); return; }

    var texto = "Olá, print()! Meu nome é " + nome + ".\n" +
      "Tipo de cliente: " + negocio + "\n" +
      "Preciso de: " + precisa.join(", ") +
      (msg ? "\n\nSobre o projeto: " + msg : "");

    resultado.innerHTML = "";
    var aviso = document.createElement("p"); aviso.className = "aviso";
    var pre = document.createElement("pre"); pre.textContent = texto;
    var linha = document.createElement("div"); linha.className = "linha-b";
    if (CONTATO.whatsapp){
      aviso.textContent = "Mensagem pronta. Abra o WhatsApp para enviar:";
      var a = document.createElement("a"); a.className = "btn ciano";
      a.href = "https://wa.me/" + CONTATO.whatsapp + "?text=" + encodeURIComponent(texto);
      a.target = "_blank"; a.rel = "noopener"; a.textContent = "Abrir no WhatsApp";
      linha.appendChild(a);
    } else if (CONTATO.email){
      aviso.textContent = "Mensagem pronta. Envie para " + CONTATO.email + ":";
      var a2 = document.createElement("a"); a2.className = "btn ciano";
      a2.href = "mailto:" + CONTATO.email + "?subject=" + encodeURIComponent("Orçamento - " + nome) + "&body=" + encodeURIComponent(texto);
      a2.textContent = "Abrir e-mail";
      linha.appendChild(a2);
    } else {
      aviso.textContent = "Mensagem pronta. Os canais de contato da print() ainda estão sendo definidos, então copie o texto para enviar depois.";
    }
    var copiar = document.createElement("button"); copiar.type = "button"; copiar.className = "btn claro"; copiar.textContent = "Copiar mensagem";
    copiar.addEventListener("click", function(){
      var ok = function(){ copiar.textContent = "Copiado"; setTimeout(function(){ copiar.textContent = "Copiar mensagem"; }, 1800); };
      var falha = function(){ var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); copiar.textContent = "Texto selecionado"; };
      try { navigator.clipboard.writeText(texto).then(ok, falha); } catch (err) { falha(); }
    });
    linha.appendChild(copiar);
    resultado.appendChild(aviso); resultado.appendChild(pre); resultado.appendChild(linha);
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "nearest" });
  });

  $("#ano").textContent = String(new Date().getFullYear());
})();
