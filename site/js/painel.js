/* ===========================================================
   Painel da imobiliária (Etapa 2 · backoffice).
   Status de cada imóvel em localStorage; KPIs recalculam ao vivo.
   =========================================================== */
(function () {
  "use strict";
  var IMOVEIS = window.IMOVEIS || [];
  var KEY = "leo_painel";

  // seed inicial de status por imóvel
  var SEED = {
    "LEO-1005": "vendido",
    "LEO-1007": "reservado",
    "LEO-1003": "reservado"
  };
  IMOVEIS.forEach(function (im) { if (!SEED[im.id]) SEED[im.id] = "ativo"; });

  var STATUS = window.GestaoStore.get(KEY, SEED);
  var filtro = "todos";

  var LABELS = { ativo: "Ativo", reservado: "Reservado", vendido: "Vendido/Alugado" };

  function fmtCompact(v) {
    if (v >= 1e6) return "R$ " + (v / 1e6).toFixed(1).replace(".", ",") + " mi";
    if (v >= 1e3) return "R$ " + Math.round(v / 1e3) + " mil";
    return "R$ " + v;
  }
  function fmt(v) { return "R$ " + Number(v).toLocaleString("pt-BR"); }

  function statusDe(id) { return STATUS[id] || "ativo"; }

  function calc() {
    var k = { total: IMOVEIS.length, ativo: 0, reservado: 0, vendido: 0, vgvAtivo: 0, fechado: 0, aluguelMes: 0 };
    IMOVEIS.forEach(function (im) {
      var s = statusDe(im.id);
      k[s]++;
      if (s === "ativo" && im.finalidade === "venda") k.vgvAtivo += im.preco;
      if (s === "ativo" && im.finalidade === "locacao") k.aluguelMes += im.preco;
      if (s === "vendido") k.fechado += im.preco;
    });
    return k;
  }

  function renderKpis() {
    var k = calc();
    var cards = [
      { v: k.total, l: "Imóveis na carteira" },
      { v: k.ativo, l: "Ativos no site" },
      { v: k.reservado, l: "Reservados" },
      { v: k.vendido, l: "Vendidos / alugados" },
      { v: fmtCompact(k.vgvAtivo), l: "VGV ativo (à venda)" },
      { v: fmtCompact(k.aluguelMes) + "/mês", l: "Locação ativa/mês" }
    ];
    document.getElementById("kpis").innerHTML = cards.map(function (c) {
      return '<div class="gx-kpi"><b>' + c.v + "</b><span>" + c.l + "</span></div>";
    }).join("");
  }

  function renderSeg() {
    var opts = [["todos", "Todos"], ["ativo", "Ativos"], ["reservado", "Reservados"], ["vendido", "Vendidos"]];
    document.getElementById("filtro-status").innerHTML = opts.map(function (o) {
      return '<button type="button" class="gx-seg-b' + (filtro === o[0] ? " on" : "") + '" data-f="' + o[0] + '">' + o[1] + "</button>";
    }).join("");
    document.querySelectorAll("#filtro-status .gx-seg-b").forEach(function (b) {
      b.addEventListener("click", function () { filtro = b.getAttribute("data-f"); renderSeg(); renderTabela(); });
    });
  }

  function renderTabela() {
    var list = IMOVEIS.filter(function (im) { return filtro === "todos" || statusDe(im.id) === filtro; });
    var rows = list.map(function (im) {
      var s = statusDe(im.id);
      var preco = im.finalidade === "locacao" ? fmt(im.preco) + "/mês" : fmt(im.preco);
      var sel = ["ativo", "reservado", "vendido"].map(function (v) {
        return '<option value="' + v + '"' + (v === s ? " selected" : "") + ">" + LABELS[v] + "</option>";
      }).join("");
      return '<tr>' +
        '<td class="gx-cod">' + im.id + "</td>" +
        '<td><b>' + im.titulo + "</b><span class=\"gx-sub\">" + im.bairro + " · " + im.tipo + "</span></td>" +
        '<td>' + (im.finalidade === "locacao" ? "Locação" : "Venda") + "</td>" +
        '<td class="gx-right">' + preco + "</td>" +
        '<td><span class="gx-pill gx-' + s + '">' + LABELS[s] + "</span></td>" +
        '<td><select class="gx-status" data-id="' + im.id + '">' + sel + "</select></td>" +
        "</tr>";
    }).join("");

    document.getElementById("tabela").innerHTML =
      '<div class="gx-tablewrap"><table class="gx-table">' +
        "<thead><tr><th>Código</th><th>Imóvel</th><th>Finalidade</th><th class=\"gx-right\">Valor</th><th>Status</th><th>Mudar</th></tr></thead>" +
        "<tbody>" + (rows || '<tr><td colspan="6" class="gx-empty">Nenhum imóvel neste filtro.</td></tr>') + "</tbody>" +
      "</table></div>";

    document.querySelectorAll(".gx-status").forEach(function (sel) {
      sel.addEventListener("change", function () {
        STATUS[sel.getAttribute("data-id")] = sel.value;
        window.GestaoStore.set(KEY, STATUS);
        renderKpis(); renderTabela();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderKpis(); renderSeg(); renderTabela();
  });
})();
