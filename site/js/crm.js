/* ===========================================================
   Funil de vendas / CRM (Etapa 3).
   Kanban com drag-and-drop (desktop) e setas (mobile).
   Estado em localStorage (leo_crm).
   =========================================================== */
(function () {
  "use strict";
  var LEADS = window.LEADS || [];
  var KEY = "leo_crm";

  var ETAPAS = [
    { id: "novo",     nome: "Novo lead" },
    { id: "contato",  nome: "Em contato" },
    { id: "visita",   nome: "Visita" },
    { id: "proposta", nome: "Proposta" },
    { id: "fechado",  nome: "Fechado" }
  ];
  var ORDEM = ETAPAS.map(function (e) { return e.id; });

  var DADOS = window.GestaoStore.get(KEY, LEADS);
  function save() { window.GestaoStore.set(KEY, DADOS); }

  function fmt(v) {
    if (v >= 1e6) return "R$ " + (v / 1e6).toFixed(1).replace(".", ",") + " mi";
    if (v >= 1e3) return "R$ " + Math.round(v / 1e3) + " mil";
    return "R$ " + v;
  }
  function leadsDe(etapa) { return DADOS.filter(function (l) { return l.etapa === etapa; }); }

  function move(id, dir) {
    var l = DADOS.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    var i = ORDEM.indexOf(l.etapa) + dir;
    if (i < 0 || i >= ORDEM.length) return;
    l.etapa = ORDEM[i];
    save(); render();
  }
  function setEtapa(id, etapa) {
    var l = DADOS.filter(function (x) { return x.id === id; })[0];
    if (!l || l.etapa === etapa) return;
    l.etapa = etapa;
    save(); render();
  }

  function renderKpis() {
    var total = DADOS.length;
    var fechados = leadsDe("fechado");
    var ativos = DADOS.filter(function (l) { return l.etapa !== "fechado"; });
    var pipe = ativos.reduce(function (s, l) { return s + (l.orcamento || 0); }, 0);
    var ganho = fechados.reduce(function (s, l) { return s + (l.orcamento || 0); }, 0);
    var cards = [
      { v: total, l: "Leads no funil" },
      { v: fmt(pipe), l: "Em negociação" },
      { v: fechados.length, l: "Negócios fechados" },
      { v: fmt(ganho), l: "Valor fechado" }
    ];
    document.getElementById("kpis").innerHTML = cards.map(function (c) {
      return '<div class="gx-kpi"><b>' + c.v + "</b><span>" + c.l + "</span></div>";
    }).join("");
  }

  function cardHTML(l) {
    var pos = ORDEM.indexOf(l.etapa);
    return '<article class="gx-card" draggable="true" data-id="' + l.id + '">' +
      '<div class="gx-card-top"><b>' + l.nome + '</b><span class="gx-tag gx-tag--' + l.perfil + '">' + l.perfil + "</span></div>" +
      '<div class="gx-card-meta">' + l.interesse + " · " + fmt(l.orcamento) + "</div>" +
      '<div class="gx-card-imovel">' + l.imovel + " · " + l.origem + "</div>" +
      '<p class="gx-card-nota">' + l.nota + "</p>" +
      '<div class="gx-card-nav">' +
        '<button type="button" class="gx-arrow" data-dir="-1" data-id="' + l.id + '"' + (pos === 0 ? " disabled" : "") + ">‹</button>" +
        '<span>' + ETAPAS[pos].nome + "</span>" +
        '<button type="button" class="gx-arrow" data-dir="1" data-id="' + l.id + '"' + (pos === ORDEM.length - 1 ? " disabled" : "") + ">›</button>" +
      "</div>" +
      "</article>";
  }

  function render() {
    renderKpis();
    var kb = document.getElementById("kanban");
    kb.innerHTML = ETAPAS.map(function (e) {
      var ls = leadsDe(e.id);
      var soma = ls.reduce(function (s, l) { return s + (l.orcamento || 0); }, 0);
      return '<div class="gx-col" data-etapa="' + e.id + '">' +
        '<div class="gx-col-head"><b>' + e.nome + "</b><span>" + ls.length + " · " + fmt(soma) + "</span></div>" +
        '<div class="gx-col-body">' + ls.map(cardHTML).join("") + "</div>" +
        "</div>";
    }).join("");

    bind();
  }

  function bind() {
    document.querySelectorAll(".gx-arrow").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.hasAttribute("disabled")) return;
        move(b.getAttribute("data-id"), +b.getAttribute("data-dir"));
      });
    });

    var dragId = null;
    document.querySelectorAll(".gx-card").forEach(function (c) {
      c.addEventListener("dragstart", function (e) {
        dragId = c.getAttribute("data-id");
        c.classList.add("dragging");
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      });
      c.addEventListener("dragend", function () {
        c.classList.remove("dragging"); dragId = null;
      });
    });
    document.querySelectorAll(".gx-col").forEach(function (col) {
      col.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("over"); });
      col.addEventListener("dragleave", function () { col.classList.remove("over"); });
      col.addEventListener("drop", function (e) {
        e.preventDefault(); col.classList.remove("over");
        if (dragId) setEtapa(dragId, col.getAttribute("data-etapa"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
