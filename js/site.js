/* print() · comportamento do site (menu, prova, animações, formulário). Regras: veja AGENTS.md na raiz. */
(function(){
  "use strict";
  /* ===== contatos da print(): preencha aqui quando estiverem definidos ===== */
  var CONTATO = {
    whatsapp: "",   // só números, com DDI e DDD. Ex.: "5585999998888"
    email: "",      // ex.: "contato@seudominio.com.br"
    instagram: ""   // só o usuário, sem @
  };

  var $ = function(s, el){ return (el || document).querySelector(s); };
  var $$ = function(s, el){ return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var anima = document.documentElement.classList.contains("anima");

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

  /* ----- prova: as chapas entram em registro e seguem o mouse ----- */
  var placas = { c: $("#placa-c"), m: $("#placa-m"), y: $("#placa-y") };
  var BASE = { c: [-22, -14], m: [22, 14], y: [6, 28] };
  var alvo = { x: 0, y: 0 }, atual = { x: 0, y: 0 }, abertura = reduz ? 1 : 4.2, rodando = false;
  function desenhar(){
    ["c", "m", "y"].forEach(function(k, i){
      var b = BASE[k];
      var sinal = (k === "m") ? 1 : (k === "c" ? -1 : 0.4);
      var dx = b[0] * abertura + atual.x * 24 * sinal;
      var dy = b[1] * abertura + atual.y * 16 * sinal + (k === "y" ? atual.y * 10 : 0);
      placas[k].setAttribute("transform", "translate(" + dx.toFixed(1) + " " + dy.toFixed(1) + ")");
    });
  }
  function laco(){
    atual.x += (alvo.x - atual.x) * 0.12;
    atual.y += (alvo.y - atual.y) * 0.12;
    desenhar();
    if (Math.abs(alvo.x - atual.x) > 0.001 || Math.abs(alvo.y - atual.y) > 0.001 || abertura !== 1){ requestAnimationFrame(laco); }
    else { rodando = false; }
  }
  function acordar(){ if (!rodando){ rodando = true; requestAnimationFrame(laco); } }
  if (!reduz){
    var t0 = null, DUR = 1100;
    var entrada = function(t){
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3);
      abertura = 4.2 - 3.2 * e;
      if (p < 1){ desenhar(); requestAnimationFrame(entrada); } else { abertura = 1; desenhar(); }
    };
    desenhar();
    var iniciarPlacas = function(atraso){ setTimeout(function(){ requestAnimationFrame(entrada); }, Math.max(0, atraso) * 1000); };
    if (!anima) iniciarPlacas(0);
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
  } else { desenhar(); }

  /* ----- animações de impressão (grupos iguais aos do CSS) ----- */
  var SEL = {
    varre: ".heroi h1,.cab h2,.servico h3,.publico h3,.etapa h3,.motivo h3,.socio .papel-s,.contato h2",
    caixa: ".servico,.publico,.motivo,.socio,.form,.prova",
    sobe: ".heroi .sub,.heroi .ctas,.cab p.sub,.servico p,.servico ul,.servico .acao,.publico p.desc,.publico ul,.publico .acao,.etapa p,.etapa .saida,.motivo p,.socio .nome,.socio p.desc,.contato .sub,.canais,.rodape-marca p,.col,.base",
    pop: ".servico .ico,.etapa .num i,.motivo .marca-c",
    digita: ".cab > .rot,.publico > .rot,.socio > .rot,.contato .rot,.etapa .num",
    linha: ".etapas,.contato",
    logo: ".rodape-marca .logo-cor"
  };
  var NOME_ANIM = { varre: "varrer", caixa: "registro", sobe: "sobe", pop: "pop", linha: "risca" };
  function grupoDe(el){ for (var g in SEL){ if (el.matches(SEL[g])) return g; } return null; }

  function imprimir(el, atraso){
    var g = grupoDe(el);
    if (g === "digita"){ digitar(el, atraso); return; }
    if (g === "logo"){ registrarLogo(el, atraso); return; }
    el.style.setProperty("--atraso", atraso.toFixed(2) + "s");
    el.classList.add("impresso");
    var fim = function(e){
      if (e.target !== el || e.animationName !== NOME_ANIM[g]) return;
      el.removeEventListener("animationend", fim);
      el.classList.remove("impresso"); el.classList.add("feito"); el.style.removeProperty("--atraso");
    };
    el.addEventListener("animationend", fim);
  }

  var pressa = false;
  function digitar(el, atraso){
    setTimeout(function(){
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
          el.classList.remove("digitando"); el.classList.add("feito");
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

  var BASE_LOGO = [[6, 28], [22, 14], [-22, -14]]; // ordem das chapas no SVG: amarelo, magenta, ciano
  function abrirLogo(svg, a){
    var us = svg.querySelectorAll("use.placa");
    for (var i = 0; i < us.length; i++) us[i].setAttribute("transform", "translate(" + (BASE_LOGO[i][0] * a).toFixed(1) + " " + (BASE_LOGO[i][1] * a).toFixed(1) + ")");
  }
  function registrarLogo(svg, atraso){
    svg.style.setProperty("--atraso", atraso.toFixed(2) + "s");
    svg.classList.add("impresso");
    setTimeout(function(){
      var t0 = null;
      (function quadro(t){
        if (t === undefined) return requestAnimationFrame(quadro);
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - p, 3);
        abrirLogo(svg, 4.2 - 3.2 * e);
        if (p < 1) requestAnimationFrame(quadro); else { svg.classList.remove("impresso"); svg.classList.add("feito"); }
      })();
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

  function abrirPagina(){
    var heroi = $(".heroi"), cab = $(".cabeca");
    var H = heroi.offsetHeight, DURC = 1.25;
    var topoH = heroi.getBoundingClientRect().top + window.scrollY;
    cab.style.setProperty("--curso", Math.max(0, H - 12) + "px");
    cab.style.setProperty("--dur-cabeca", DURC + "s");
    cab.classList.add("roda");
    var atrasoDe = function(el){ var r = el.getBoundingClientRect(); return Math.max(0, (r.top + window.scrollY - topoH) / H) * DURC * 0.9; };
    [$(".heroi h1"), $(".heroi .sub"), $(".heroi .ctas"), $("#prova")].forEach(function(el){ imprimir(el, atrasoDe(el)); });
    iniciarPlacas(atrasoDe($("#prova")) + 0.2);
    setTimeout(iniciarLoop, 120);
  }

  if (anima){
   try {
    var todos = [];
    Object.keys(SEL).forEach(function(g){ $$(SEL[g]).forEach(function(el){ if (!el.closest(".heroi") && todos.indexOf(el) < 0) todos.push(el); }); });
    $$(SEL.logo).forEach(function(svg){ abrirLogo(svg, 4.2); });
    var io = new IntersectionObserver(function(entries){
      var vis = entries.filter(function(e){ return e.isIntersecting; }).map(function(e){ return e.target; });
      if (!vis.length) return;
      vis.sort(function(a, b){ return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
      var rects = vis.map(function(el){ return el.getBoundingClientRect(); });
      var minTop = Math.min.apply(null, rects.map(function(r){ return r.top; }));
      vis.forEach(function(el, i){
        var r = rects[i];
        var a = Math.max(0, (r.top - minTop) / window.innerHeight) * 0.55 + Math.max(0, Math.min(1, r.left / window.innerWidth)) * 0.3;
        var caixa = el.parentElement && el.parentElement.closest(SEL.caixa);
        if (caixa && !el.matches(SEL.caixa)) a += 0.25;
        io.unobserve(el);
        imprimir(el, Math.min(a, 1.3));
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    todos.forEach(function(el){ io.observe(el); });
    abrirPagina();
    /* ao imprimir no papel, mostra tudo de uma vez */
    window.addEventListener("beforeprint", function(){ pressa = true; document.documentElement.classList.remove("anima"); });
   } catch (err) {
    document.documentElement.classList.remove("anima");
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
    var d = document.createElement("div"); d.className = "canal";
    d.innerHTML = '<span>whatsapp · e-mail · instagram</span><span class="pendente">em breve</span>';
    canais.appendChild(d);
    var li = document.createElement("li"); li.className = "pendente"; li.textContent = "Canais em breve"; rodapeC.appendChild(li);
  }

  /* ----- formulário ----- */
  var form = $("#form"), resultado = $("#resultado");
  function irParaForm(focar){
    var alvoEl = $("#contato");
    alvoEl.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
    if (focar) setTimeout(function(){ $("#f-nome").focus({ preventScroll: true }); }, reduz ? 0 : 450);
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
