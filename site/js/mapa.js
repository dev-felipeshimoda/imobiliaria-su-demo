/* ===========================================================
   Mapa interativo de imóveis (Etapa 2).
   Pinos posicionados num plano estilizado; filtro + mapa de calor.
   =========================================================== */
(function () {
  "use strict";
  var IMOVEIS = window.IMOVEIS || [];
  var POS = window.MAPA_POS || {};
  var fFin = "", fBairro = "", heat = false, selecionado = null;

  function fmt(v, im) {
    var s = "R$ " + Number(v).toLocaleString("pt-BR");
    return im && im.finalidade === "locacao" ? s + "/mês" : s;
  }

  // tier de preço normalizado (0-1) por finalidade, para o calor
  function tier(im) {
    if (im.finalidade === "locacao") return Math.min(1, im.preco / 9000);
    return Math.min(1, im.preco / 3500000);
  }

  function visiveis() {
    return IMOVEIS.filter(function (im) {
      if (!POS[im.id]) return false;
      if (fFin && im.finalidade !== fFin) return false;
      if (fBairro && im.bairro !== fBairro) return false;
      return true;
    });
  }

  function renderMap() {
    var map = document.getElementById("map");
    map.classList.toggle("heat", heat);
    var list = visiveis();
    map.innerHTML =
      '<div class="gx-map-grid"></div>' +
      '<div class="gx-map-hood gx-map-hood--1">Alto da Lapa</div>' +
      '<div class="gx-map-hood gx-map-hood--2">Pompeia</div>' +
      '<div class="gx-map-hood gx-map-hood--3">Lapa</div>' +
      '<div class="gx-map-hood gx-map-hood--4">Vila Leopoldina</div>' +
      list.map(function (im) {
        var p = POS[im.id];
        var t = tier(im);
        var cls = "gx-pin gx-pin--" + im.finalidade + (selecionado === im.id ? " sel" : "");
        var style = "left:" + p.x + "%;top:" + p.y + "%;";
        if (heat) style += "--t:" + t + ";";
        var label = heat ? "" : '<span class="gx-pin-lbl">' + fmt(im.preco, im) + "</span>";
        return '<button type="button" class="' + cls + '" data-id="' + im.id + '" style="' + style + '">' +
          '<span class="gx-pin-dot"></span>' + label + "</button>";
      }).join("");

    map.querySelectorAll(".gx-pin").forEach(function (b) {
      b.addEventListener("click", function () {
        selecionado = b.getAttribute("data-id");
        renderMap(); renderInfo();
      });
    });
  }

  function renderInfo() {
    var box = document.getElementById("mapinfo");
    var im = IMOVEIS.filter(function (i) { return i.id === selecionado; })[0];
    if (!im) { box.innerHTML = '<div class="gx-mapinfo-empty">Toque em um ponto do mapa para ver o imóvel.</div>'; return; }
    var foto = (im.fotos && im.fotos[0]) || "";
    var specs = [];
    if (im.quartos) specs.push(im.quartos + " dorm");
    if (im.vagas) specs.push(im.vagas + " vaga" + (im.vagas > 1 ? "s" : ""));
    specs.push(im.area + " m²");
    box.innerHTML =
      '<div class="gx-mapcard">' +
        '<div class="gx-mapcard-img" style="background-image:url(' + foto + ')"></div>' +
        '<div class="gx-mapcard-body">' +
          '<span class="gx-mapcard-loc">' + im.bairro + " · " + im.tipo + "</span>" +
          "<h3>" + im.titulo + "</h3>" +
          '<div class="gx-mapcard-price">' + fmt(im.preco, im) + "</div>" +
          '<div class="gx-mapcard-specs">' + specs.join(" · ") + "</div>" +
          '<a class="btn btn--brand btn--block" href="imovel.html?id=' + im.id + '">Ver imóvel</a>' +
        "</div>" +
      "</div>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#f-finalidade .gx-seg-b").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("#f-finalidade .gx-seg-b").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        fFin = b.getAttribute("data-v");
        selecionado = null; renderMap(); renderInfo();
      });
    });
    document.getElementById("f-bairro").addEventListener("change", function () {
      fBairro = this.value; selecionado = null; renderMap(); renderInfo();
    });
    document.getElementById("f-heat").addEventListener("change", function () {
      heat = this.checked; renderMap();
    });
    renderMap(); renderInfo();
  });
})();
