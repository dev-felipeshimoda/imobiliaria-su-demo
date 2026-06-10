/* ===========================================================
   Administração de condomínios (Etapa 2).
   Inadimplência por unidade, acordos, pagamentos e comunicados.
   Estado em localStorage (leo_cond), recalcula ao vivo.
   =========================================================== */
(function () {
  "use strict";
  var CONDOMINIOS = window.CONDOMINIOS || [];
  var KEY = "leo_cond";

  // seed: clona unidades + status, adiciona comunicados vazios
  var SEED = {};
  CONDOMINIOS.forEach(function (c) {
    SEED[c.id] = {
      unidades: c.unidadesDetalhe.map(function (u) {
        return { unidade: u.unidade, morador: u.morador, atraso: u.atraso, estado: u.atraso > 0 ? "atraso" : "em-dia" };
      }),
      comunicados: []
    };
  });

  var STATE = window.GestaoStore.get(KEY, SEED);
  var atual = CONDOMINIOS[0].id;

  function condDe(id) { return CONDOMINIOS.filter(function (c) { return c.id === id; })[0]; }
  function fmt(v) { return "R$ " + Number(v).toLocaleString("pt-BR"); }
  function save() { window.GestaoStore.set(KEY, STATE); }

  function calc(id) {
    var c = condDe(id), st = STATE[id];
    var devido = 0, emAtraso = 0, emAcordo = 0;
    st.unidades.forEach(function (u) {
      if (u.estado === "atraso") { devido += u.atraso * c.taxa; emAtraso++; }
      if (u.estado === "acordo") emAcordo++;
    });
    var cadastradas = st.unidades.length;
    var adimplentes = cadastradas - emAtraso;
    var pct = cadastradas ? Math.round((adimplentes / cadastradas) * 100) : 100;
    return { devido: devido, emAtraso: emAtraso, emAcordo: emAcordo, pct: pct, receita: c.unidades * c.taxa };
  }

  function renderPick() {
    document.getElementById("condpick").innerHTML = CONDOMINIOS.map(function (c) {
      return '<button type="button" class="gx-condcard' + (c.id === atual ? " on" : "") + '" data-id="' + c.id + '">' +
        "<b>" + c.nome + "</b><span>" + c.bairro + " · " + c.unidades + " unidades · síndico: " + c.sindico + "</span></button>";
    }).join("");
    document.querySelectorAll(".gx-condcard").forEach(function (b) {
      b.addEventListener("click", function () { atual = b.getAttribute("data-id"); renderAll(); });
    });
  }

  function renderKpis() {
    var k = calc(atual);
    var cards = [
      { v: k.pct + "%", l: "Adimplência" },
      { v: fmt(k.devido), l: "Inadimplência atual" },
      { v: k.emAtraso, l: "Unidades em atraso" },
      { v: fmt(k.receita) + "/mês", l: "Receita do condomínio" }
    ];
    document.getElementById("kpis").innerHTML = cards.map(function (c) {
      return '<div class="gx-kpi"><b>' + c.v + "</b><span>" + c.l + "</span></div>";
    }).join("");
  }

  function renderUnidades() {
    var c = condDe(atual), st = STATE[atual];
    var rows = st.unidades.slice().sort(function (a, b) { return b.atraso - a.atraso; }).map(function (u) {
      var valor = u.atraso * c.taxa;
      var estadoTxt = u.estado === "em-dia" ? "Em dia" : u.estado === "acordo" ? "Em acordo" : (u.atraso + (u.atraso > 1 ? " meses" : " mês") + " · " + fmt(valor));
      var acoes = "";
      if (u.estado === "atraso") {
        acoes = '<button type="button" class="gx-mini" data-acao="acordo" data-u="' + u.unidade + '">Fazer acordo</button>' +
                '<button type="button" class="gx-mini gx-mini--dark" data-acao="pago" data-u="' + u.unidade + '">Registrar pagamento</button>';
      } else if (u.estado === "acordo") {
        acoes = '<button type="button" class="gx-mini gx-mini--dark" data-acao="pago" data-u="' + u.unidade + '">Quitar acordo</button>';
      } else {
        acoes = '<span class="gx-ok">✓ Quitado</span>';
      }
      return '<tr class="gx-r-' + u.estado + '">' +
        '<td class="gx-cod">' + u.unidade + "</td>" +
        '<td><b>' + u.morador + "</b></td>" +
        '<td><span class="gx-pill gx-' + u.estado + '">' + estadoTxt + "</span></td>" +
        '<td class="gx-acoes">' + acoes + "</td>" +
        "</tr>";
    }).join("");

    document.getElementById("unidades").innerHTML =
      '<div class="gx-tablewrap"><table class="gx-table">' +
        "<thead><tr><th>Unid.</th><th>Morador</th><th>Situação</th><th>Ações</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";

    document.querySelectorAll("#unidades [data-acao]").forEach(function (b) {
      b.addEventListener("click", function () {
        var u = st.unidades.filter(function (x) { return x.unidade === b.getAttribute("data-u"); })[0];
        if (!u) return;
        var acao = b.getAttribute("data-acao");
        if (acao === "acordo") { u.estado = "acordo"; }
        else if (acao === "pago") { u.estado = "em-dia"; u.atraso = 0; }
        save(); renderKpis(); renderUnidades();
      });
    });
  }

  function renderComunicados() {
    var st = STATE[atual];
    var lista = st.comunicados.length
      ? st.comunicados.map(function (c) {
          return '<div class="gx-com"><span class="gx-com-data">' + c.data + "</span><p>" + c.texto + "</p></div>";
        }).join("")
      : '<p class="gx-empty">Nenhum comunicado enviado ainda.</p>';
    document.getElementById("comlista").innerHTML = lista;
  }

  function initComform() {
    document.getElementById("comform").addEventListener("submit", function (e) {
      e.preventDefault();
      var ta = document.getElementById("comtxt");
      var txt = ta.value.trim();
      if (!txt) return;
      var d = new Date();
      var data = d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      STATE[atual].comunicados.unshift({ data: data, texto: txt });
      save(); ta.value = ""; renderComunicados();
    });
  }

  function renderAll() { renderPick(); renderKpis(); renderUnidades(); renderComunicados(); }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll(); initComform();
  });
})();
