/* ===========================================================
   Marketing e conteúdo (Etapa 3).
   Monta legenda + hashtags + preview de post a partir do imóvel.
   =========================================================== */
(function () {
  "use strict";
  var IMOVEIS = window.IMOVEIS || [];

  function fmt(v, im) {
    var s = "R$ " + Number(v).toLocaleString("pt-BR");
    return im && im.finalidade === "locacao" ? s + "/mês" : s;
  }

  function specs(im) {
    var p = [];
    if (im.quartos) p.push(im.quartos + (im.quartos > 1 ? " dorms" : " dorm"));
    if (im.suites) p.push(im.suites + (im.suites > 1 ? " suítes" : " suíte"));
    if (im.vagas) p.push(im.vagas + (im.vagas > 1 ? " vagas" : " vaga"));
    p.push(im.area + "m²");
    return p;
  }

  function slug(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]/g, "");
  }

  function hashtags(im) {
    var tags = ["imovel", "imoveissp", slug(im.bairro), im.finalidade === "locacao" ? "aluguel" : "comprarimovel",
      slug(im.tipo), "zonaoeste", "saopaulo", "leopoldinaimoveis"];
    return tags.filter(function (t, i, a) { return a.indexOf(t) === i; }).map(function (t) { return "#" + t; }).join(" ");
  }

  function legenda(im, tom) {
    var op = im.finalidade === "locacao" ? "para alugar" : "à venda";
    var sp = specs(im).join(" · ");
    var preco = fmt(im.preco, im);
    var car = (im.caracteristicas || []).slice(0, 3).join(", ");
    var corpo;
    if (tom === "sofisticado") {
      corpo = "Sofisticação no coração da " + im.bairro + ". " + im.titulo + ". " +
        sp + ". " + (car ? "Detalhes que fazem a diferença: " + car + ". " : "") +
        "Um endereço para poucos, " + op + " por " + preco + ".";
    } else if (tom === "descontraido") {
      corpo = "Bora morar na " + im.bairro + "? 🙌 " + im.titulo + ". " +
        sp + ". " + (car ? car + ". " : "") +
        op.charAt(0).toUpperCase() + op.slice(1) + " por " + preco + ". Chama no direct!";
    } else {
      corpo = "OPORTUNIDADE na " + im.bairro + "! " + im.titulo + ". " +
        sp + ". " + (car ? car + ". " : "") +
        op.charAt(0).toUpperCase() + op.slice(1) + " por " + preco + ". Agende sua visita pelo WhatsApp.";
    }
    return corpo + "\n\nCód. " + im.id + "\n\n" + hashtags(im);
  }

  function render(im, tom) {
    var foto = (im.fotos && im.fotos[0]) || "";
    var leg = legenda(im, tom);
    var out = document.getElementById("mk-out");
    out.innerHTML =
      '<div class="mk-grid">' +
        '<div class="mk-post">' +
          '<div class="mk-post-top"><span class="mk-ava"></span><b>leopoldina.imoveis</b></div>' +
          '<div class="mk-post-img" style="background-image:url(' + foto + ')">' +
            '<span class="mk-post-badge">' + (im.finalidade === "locacao" ? "Locação" : "Venda") + "</span>" +
            '<div class="mk-post-cap"><b>' + fmt(im.preco, im) + "</b><span>" + im.bairro + " · " + specs(im).join(" · ") + "</span></div>" +
          "</div>" +
          '<div class="mk-post-actions"><span>♥</span><span>💬</span><span>➤</span></div>' +
        "</div>" +
        '<div class="mk-caption">' +
          "<label>Legenda gerada</label>" +
          '<textarea id="mk-leg" rows="10">' + leg + "</textarea>" +
          '<button class="btn btn--brand btn--block" id="mk-copy" type="button">Copiar legenda</button>' +
          '<div class="mk-fake-actions"><span>Publicar no Instagram</span><span>TikTok</span><span>Anúncio</span></div>' +
        "</div>" +
      "</div>";

    document.getElementById("mk-copy").addEventListener("click", function () {
      var ta = document.getElementById("mk-leg");
      ta.select();
      try {
        if (navigator.clipboard) navigator.clipboard.writeText(ta.value);
        else document.execCommand("copy");
        this.textContent = "Copiado!";
        var b = this;
        setTimeout(function () { b.textContent = "Copiar legenda"; }, 1600);
      } catch (e) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sel = document.getElementById("mk-imovel");
    sel.innerHTML = IMOVEIS.map(function (im) {
      return '<option value="' + im.id + '">' + im.id + " · " + im.titulo.slice(0, 40) + "</option>";
    }).join("");
    document.getElementById("mk-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var im = IMOVEIS.filter(function (i) { return i.id === sel.value; })[0];
      if (im) render(im, document.getElementById("mk-tom").value);
    });
  });
})();
