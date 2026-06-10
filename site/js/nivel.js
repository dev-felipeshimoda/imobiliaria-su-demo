/* ===========================================================
   Sistema de níveis: o produto cresce em 3 etapas, dentro do
   mesmo app. A barra de demonstração liga/desliga as funções
   de cada etapa, como discutido na reunião (escalável).
     Nível 1 · Vitrine (MVP):          só o site público
     Nível 2 · Gestão (intermediária): painel, condomínio, mapa
     Nível 3 · Plataforma completa:    CRM, documentos, renda, marketing
   =========================================================== */
(function () {
  "use strict";

  var NIVEL_KEY = "leo_nivel";

  var NIVEIS = [
    { n: 1, nome: "Vitrine", desc: "MVP · o site no ar" },
    { n: 2, nome: "Gestão", desc: "Backoffice e condomínios" },
    { n: 3, nome: "Plataforma", desc: "Tudo integrado" }
  ];

  // módulos de gestão (aparecem no menu conforme o nível)
  var MODULOS = [
    { href: "painel.html",     label: "Painel",          nivel: 2 },
    { href: "condominio.html", label: "Condomínios",     nivel: 2 },
    { href: "mapa.html",       label: "Mapa",            nivel: 2 },
    { href: "crm.html",        label: "Funil de vendas", nivel: 3 },
    { href: "renda.html",      label: "Análise de renda",nivel: 3 },
    { href: "documentos.html", label: "Documentos",      nivel: 3 },
    { href: "marketing.html",  label: "Marketing",       nivel: 3 }
  ];

  function getNivel() {
    var v = parseInt(localStorage.getItem(NIVEL_KEY) || "1", 10);
    return (v >= 1 && v <= 3) ? v : 1;
  }
  function setNivel(n) {
    try { localStorage.setItem(NIVEL_KEY, String(n)); } catch (e) {}
    document.body.setAttribute("data-nivel", n);
    syncBar(); syncNav();
  }

  /* store compartilhado: clona o seed para o localStorage e edita a cópia */
  window.GestaoStore = {
    get: function (key, seed) {
      try {
        var raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      var clone = JSON.parse(JSON.stringify(seed));
      this.set(key, clone);
      return clone;
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }
  };

  function resetDemo() {
    ["leo_painel", "leo_cond", "leo_crm", "leo_docs"].forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    location.reload();
  }

  /* ---------- barra de demonstração ---------- */
  function buildBar() {
    var bar = document.createElement("div");
    bar.className = "demobar";
    bar.innerHTML =
      '<div class="demobar-in">' +
        '<div class="demobar-lbl"><span class="demobar-tag">Demonstração</span>' +
          '<span class="demobar-hint">Veja o produto crescer por etapa</span></div>' +
        '<div class="demobar-levels">' +
          NIVEIS.map(function (lv) {
            return '<button class="demobar-lv" data-nivel="' + lv.n + '" type="button">' +
              '<b>' + lv.n + ". " + lv.nome + "</b>" +
              '<span>' + lv.desc + "</span></button>";
          }).join("") +
        "</div>" +
        '<button class="demobar-reset" type="button" title="Reiniciar o demo">Reiniciar</button>' +
      "</div>";
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelectorAll(".demobar-lv").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = +b.getAttribute("data-nivel");
        setNivel(n);
        toast(n);
      });
    });
    bar.querySelector(".demobar-reset").addEventListener("click", resetDemo);
  }

  function syncBar() {
    var atual = getNivel();
    document.querySelectorAll(".demobar-lv").forEach(function (b) {
      b.classList.toggle("on", +b.getAttribute("data-nivel") <= atual);
      b.classList.toggle("cur", +b.getAttribute("data-nivel") === atual);
    });
  }

  function toast(n) {
    var lv = NIVEIS[n - 1];
    var novos = MODULOS.filter(function (m) { return m.nivel === n; });
    var msg = n === 1
      ? "Etapa 1 · só o site público, como ele vai ao ar primeiro."
      : "Etapa " + n + " · " + lv.nome + ", liberado: " + novos.map(function (m) { return m.label; }).join(", ") + ".";
    var t = document.querySelector(".demotoast");
    if (!t) { t = document.createElement("div"); t.className = "demotoast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tmr);
    t._tmr = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- menu Gestão no header ---------- */
  function syncNav() {
    var nav = document.querySelector(".site-header .nav");
    if (!nav) return;
    var old = nav.querySelector(".nav-gestao");
    if (old) old.remove();

    var atual = getNivel();
    var disp = MODULOS.filter(function (m) { return m.nivel <= atual; });
    if (!disp.length) return;

    var here = location.pathname.split("/").pop();
    var wrap = document.createElement("div");
    wrap.className = "nav-gestao";
    var anyActive = disp.some(function (m) { return m.href === here; });
    wrap.innerHTML =
      '<button class="nav-gestao-trigger' + (anyActive ? " active" : "") + '" type="button">Gestão' +
        '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
      "</button>" +
      '<div class="nav-gestao-panel">' +
        disp.map(function (m) {
          return '<a href="' + m.href + '"' + (m.href === here ? ' class="cur"' : "") + ">" + m.label +
            '<span class="nav-gestao-et">Etapa ' + m.nivel + "</span></a>";
        }).join("") +
      "</div>";
    nav.appendChild(wrap);

    var trig = wrap.querySelector(".nav-gestao-trigger");
    trig.addEventListener("click", function (e) {
      e.stopPropagation();
      wrap.classList.toggle("open");
    });
    document.addEventListener("click", function () { wrap.classList.remove("open"); });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    // páginas de gestão sobem o nível automaticamente (deep link funciona)
    var req = parseInt(document.body.getAttribute("data-nivel-req") || "0", 10);
    if (req && getNivel() < req) {
      try { localStorage.setItem(NIVEL_KEY, String(req)); } catch (e) {}
    }
    document.body.setAttribute("data-nivel", getNivel());
    buildBar();
    syncBar();
    syncNav();
  });
})();
