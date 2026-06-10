/* ===========================================================
   Análise de renda via Open Finance (Etapa 3) — simulada.
   A renda é derivada do CPF (determinística) e comparada à
   parcela do imóvel para dizer se cabe no orçamento.
   =========================================================== */
(function () {
  "use strict";
  var IMOVEIS = window.IMOVEIS || [];

  function fmt(v) { return "R$ " + Number(Math.round(v)).toLocaleString("pt-BR"); }
  function soDig(s) { return (s || "").replace(/\D/g, ""); }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return h;
  }

  // renda mensal determinística a partir do CPF: faixa 6k a 38k
  function rendaDoCpf(cpf) {
    var d = soDig(cpf) || "0";
    var base = 6000 + (hash(d) % 32000);
    return Math.round(base / 100) * 100;
  }

  // bancos "conectados" derivados do CPF, para dar cara de Open Finance
  var BANCOS = ["Banco do Brasil", "Itaú", "Nubank", "Bradesco", "Caixa", "Santander", "Inter"];
  function contas(cpf, renda) {
    var d = soDig(cpf) || "0";
    var n = 2 + (hash(d) % 2); // 2 ou 3 instituições
    var out = [];
    var resto = renda;
    for (var i = 0; i < n; i++) {
      var banco = BANCOS[(hash(d + i) % BANCOS.length)];
      var parte = i === n - 1 ? resto : Math.round((renda * (0.3 + (hash(d + "x" + i) % 40) / 100)));
      if (parte > resto) parte = resto;
      resto -= parte;
      out.push({ banco: banco, valor: Math.max(parte, 0) });
    }
    return out;
  }

  function parcela(im, op) {
    if (op === "aluguel" || im.finalidade === "locacao") {
      return im.preco + (im.condominio || 0);
    }
    // financiamento: 20% entrada, 360 meses, juros ~0,9% a.m. (Price)
    var fin = im.preco * 0.8;
    var j = 0.009, n = 360;
    return fin * (j * Math.pow(1 + j, n)) / (Math.pow(1 + j, n) - 1);
  }

  function veredito(comp) {
    if (comp <= 0.30) return { cls: "quente", tag: "Aprovado", txt: "A parcela compromete menos de 30% da renda. Cliente apto a seguir." };
    if (comp <= 0.40) return { cls: "morno", tag: "Atenção", txt: "Comprometimento entre 30% e 40%. Possível, mas avalie entrada maior ou prazo." };
    return { cls: "frio", tag: "Reprovado", txt: "A parcela passa de 40% da renda. Indique um imóvel em faixa menor." };
  }

  function preencheImoveis() {
    var sel = document.getElementById("imovel");
    sel.innerHTML = IMOVEIS.map(function (im) {
      var p = im.finalidade === "locacao" ? fmt(im.preco) + "/mês" : fmt(im.preco);
      return '<option value="' + im.id + '">' + im.id + " · " + im.bairro + " · " + p + "</option>";
    }).join("");
  }

  function analisar() {
    var cpf = document.getElementById("cpf").value;
    var imId = document.getElementById("imovel").value;
    var op = document.getElementById("op").value;
    var im = IMOVEIS.filter(function (i) { return i.id === imId; })[0];
    if (!im) return;

    var box = document.getElementById("resultado");
    box.innerHTML = '<div class="gx-spin"></div><p class="gx-modal-center">Consultando instituições financeiras…</p>';

    setTimeout(function () {
      var renda = rendaDoCpf(cpf);
      var cs = contas(cpf, renda);
      var par = parcela(im, op);
      var comp = par / renda;
      var v = veredito(comp);
      var pct = Math.round(comp * 100);

      box.innerHTML =
        '<div class="gx-of-head"><span class="gx-of-tag">Open Finance</span>' +
          "<span>" + cs.length + " instituições conectadas</span></div>" +
        '<div class="gx-of-banks">' + cs.map(function (c) {
          return '<div class="gx-of-bank"><span>' + c.banco + "</span><b>" + fmt(c.valor) + "</b></div>";
        }).join("") + "</div>" +
        '<div class="gx-of-rows">' +
          '<div class="gx-of-row"><span>Renda mensal estimada</span><b>' + fmt(renda) + "</b></div>" +
          '<div class="gx-of-row"><span>' + (op === "aluguel" || im.finalidade === "locacao" ? "Aluguel + condomínio" : "Parcela estimada do financiamento") + '</span><b>' + fmt(par) + "</b></div>" +
          '<div class="gx-of-row"><span>Comprometimento da renda</span><b>' + pct + "%</b></div>" +
        "</div>" +
        '<div class="gx-bar"><div class="gx-bar-fill gx-' + v.cls + '" style="width:' + Math.min(pct, 100) + '%"></div>' +
          '<i class="gx-bar-mark" style="left:30%"></i><i class="gx-bar-mark" style="left:40%"></i></div>' +
        '<div class="lead-result lead-' + v.cls + '" style="margin-top:18px">' +
          '<span class="lead-badge">' + v.tag + "</span><p>" + v.txt + "</p>" +
          '<p class="lead-foot">Análise simulada · CPF informado: ' + (soDig(cpf) ? "•••" + soDig(cpf).slice(-2) : "-") + "</p>" +
        "</div>";
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    preencheImoveis();
    document.getElementById("renda-form").addEventListener("submit", function (e) {
      e.preventDefault(); analisar();
    });
  });
})();
