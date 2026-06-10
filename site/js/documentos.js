/* ===========================================================
   Documentos e assinatura digital (Etapa 3).
   Fluxo gov.br simulado: ler -> autenticar -> assinar.
   Estado em localStorage (leo_docs).
   =========================================================== */
(function () {
  "use strict";
  var DOCS = window.DOCUMENTOS || [];
  var KEY = "leo_docs";

  var DADOS = window.GestaoStore.get(KEY, DOCS);
  function save() { window.GestaoStore.set(KEY, DADOS); }

  function fmt(v) { return v ? "R$ " + Number(v).toLocaleString("pt-BR") : "-"; }
  function docDe(id) { return DADOS.filter(function (d) { return d.id === id; })[0]; }

  function renderKpis() {
    var total = DADOS.length;
    var assinados = DADOS.filter(function (d) { return d.status === "assinado"; }).length;
    var pend = total - assinados;
    var pct = total ? Math.round((assinados / total) * 100) : 0;
    var cards = [
      { v: total, l: "Documentos" },
      { v: pend, l: "Aguardando assinatura" },
      { v: assinados, l: "Assinados" },
      { v: pct + "%", l: "Concluído" }
    ];
    document.getElementById("kpis").innerHTML = cards.map(function (c) {
      return '<div class="gx-kpi"><b>' + c.v + "</b><span>" + c.l + "</span></div>";
    }).join("");
  }

  function render() {
    renderKpis();
    var rows = DADOS.map(function (d) {
      var assinado = d.status === "assinado";
      var acao = assinado
        ? '<span class="gx-ok">✓ Assinado' + (d.quando ? " · " + d.quando : "") + "</span>"
        : '<button type="button" class="gx-mini gx-mini--dark" data-sign="' + d.id + '">Assinar com gov.br</button>';
      return '<tr>' +
        '<td class="gx-cod">' + d.id + "</td>" +
        '<td><b>' + d.tipo + "</b><span class=\"gx-sub\">" + d.contraparte + " · " + d.imovel + "</span></td>" +
        '<td>' + d.paginas + " pág.</td>" +
        '<td class="gx-right">' + fmt(d.valor) + "</td>" +
        '<td><span class="gx-pill gx-' + (assinado ? "em-dia" : "atraso") + '">' + (assinado ? "Assinado" : "Pendente") + "</span></td>" +
        '<td class="gx-acoes">' + acao + "</td>" +
        "</tr>";
    }).join("");

    document.getElementById("docs").innerHTML =
      '<div class="gx-tablewrap"><table class="gx-table">' +
        "<thead><tr><th>Cód.</th><th>Documento</th><th>Páginas</th><th class=\"gx-right\">Valor</th><th>Status</th><th>Ação</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";

    document.querySelectorAll("[data-sign]").forEach(function (b) {
      b.addEventListener("click", function () { abrirModal(b.getAttribute("data-sign")); });
    });
  }

  /* ---------- modal de assinatura gov.br (simulado) ---------- */
  var modal = function () { return document.getElementById("modal"); };

  function fecharModal() { modal().hidden = true; modal().innerHTML = ""; }

  function abrirModal(id) {
    var d = docDe(id);
    if (!d) return;
    var m = modal();
    m.hidden = false;
    m.innerHTML =
      '<div class="gx-modal-box">' +
        '<button type="button" class="gx-modal-x" id="mx">×</button>' +
        '<div class="gx-gov">gov.br</div>' +
        "<h3>" + d.tipo + "</h3>" +
        '<p class="gx-modal-sub">' + d.contraparte + " · " + d.paginas + " páginas · " + d.imovel + "</p>" +
        '<div class="gx-modal-body" id="mbody"></div>' +
      "</div>";
    m.querySelector("#mx").addEventListener("click", fecharModal);
    passoCPF(d);
  }

  function passoCPF(d) {
    document.getElementById("mbody").innerHTML =
      '<label class="gx-modal-lbl">Confirme seu CPF para assinar</label>' +
      '<input class="gx-modal-input" id="cpf" placeholder="000.000.000-00" inputmode="numeric">' +
      '<button class="btn btn--brand btn--block" id="mauth">Entrar com gov.br</button>' +
      '<p class="gx-modal-note">Assinatura eletrônica com validade jurídica. Sem rubricar página por página.</p>';
    document.getElementById("mauth").addEventListener("click", function () { passoAuth(d); });
  }

  function passoAuth(d) {
    document.getElementById("mbody").innerHTML =
      '<div class="gx-spin"></div><p class="gx-modal-center">Autenticando no gov.br…</p>';
    setTimeout(function () { passoConfirma(d); }, 1100);
  }

  function passoConfirma(d) {
    document.getElementById("mbody").innerHTML =
      '<div class="gx-doc-prev">' +
        '<div class="gx-doc-line"></div><div class="gx-doc-line"></div><div class="gx-doc-line short"></div>' +
        '<div class="gx-doc-line"></div><div class="gx-doc-line short"></div>' +
      "</div>" +
      '<label class="gx-check"><input type="checkbox" id="li"> Li e concordo com o documento</label>' +
      '<button class="btn btn--brand btn--block" id="mok" disabled>Assinar agora</button>';
    var li = document.getElementById("li"), ok = document.getElementById("mok");
    li.addEventListener("change", function () { ok.disabled = !li.checked; });
    ok.addEventListener("click", function () { assinar(d); });
  }

  function assinar(d) {
    var dt = new Date();
    d.status = "assinado";
    d.quando = dt.toLocaleDateString("pt-BR");
    save();
    document.getElementById("mbody").innerHTML =
      '<div class="gx-success-ic">✓</div>' +
      '<p class="gx-modal-center"><b>Documento assinado!</b><br>Validado via gov.br em ' + d.quando + ".</p>" +
      '<button class="btn btn--brand btn--block" id="mfim">Concluir</button>';
    document.getElementById("mfim").addEventListener("click", function () { fecharModal(); render(); });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
