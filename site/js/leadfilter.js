/* ===========================================================
   Filtro de leads (Etapa 1+).
   Antes de mandar o contato pra corretora, o site faz a triagem:
   pergunta orçamento e perfil, classifica em quente/morno/frio
   e só encaminha quem está dentro do alvo. Quem está fora não
   toma o tempo do atendimento. (Ponto levantado pelo Yago.)
   =========================================================== */
(function () {
  "use strict";
  var WHATSAPP = "5511999999999";

  function fmt(v) { return "R$ " + Number(v).toLocaleString("pt-BR"); }

  function classifica(orc, alvo) {
    // alvo = preço do imóvel (quando há). Sem alvo, usa faixas absolutas.
    if (alvo) {
      if (orc >= alvo * 0.85) return "quente";
      if (orc >= alvo * 0.45) return "morno";
      return "frio";
    }
    if (orc >= 800000) return "quente";
    if (orc >= 250000) return "morno";
    return "frio";
  }

  var TXT = {
    quente: {
      tag: "Lead qualificado",
      msg: "Seu perfil bate com o imóvel. A corretora recebe seu contato agora e responde no mesmo dia útil.",
      cls: "quente", wa: true
    },
    morno: {
      tag: "Contato recebido",
      msg: "Recebemos seu contato. Vamos te enviar opções que cabem no seu orçamento e seguimos a conversa pelo WhatsApp.",
      cls: "morno", wa: true
    },
    frio: {
      tag: "Fora do perfil deste imóvel",
      msg: "Pelo orçamento informado, este imóvel não encaixa, mas temos outras opções. Em um site real, esse contato seria direcionado para imóveis na sua faixa, sem ocupar o atendimento de venda. É assim que o filtro economiza o tempo da equipe.",
      cls: "frio", wa: false
    }
  };

  function resultHTML(perfil, nome, alvo) {
    var t = TXT[perfil];
    var wa = "";
    if (t.wa) {
      var msg = encodeURIComponent("Olá! Sou " + (nome || "um interessado") + " e quero falar sobre um imóvel.");
      wa = '<a class="btn btn--brand btn--block" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + "?text=" + msg + '">Continuar no WhatsApp</a>';
    } else {
      wa = '<a class="btn btn--ghost btn--block" href="imoveis.html">Ver imóveis na minha faixa</a>';
    }
    return '<div class="lead-result lead-' + t.cls + '">' +
      '<span class="lead-badge">' + t.tag + "</span>" +
      "<p>" + t.msg + "</p>" + wa +
      '<p class="lead-foot">Triagem automática do site · demonstração</p>' +
      "</div>";
  }

  function bind(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var orcEl = form.querySelector('[name="orcamento"]');
      var nomeEl = form.querySelector('[name="nome"]');
      var orc = orcEl ? +orcEl.value : 0;
      var alvo = +(form.getAttribute("data-imovel-preco") || 0);
      var perfil = classifica(orc, alvo);
      var box = document.createElement("div");
      box.innerHTML = resultHTML(perfil, nomeEl ? nomeEl.value : "", alvo);
      form.parentNode.insertBefore(box.firstChild, form);
      form.style.display = "none";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lead-form]").forEach(bind);
  });
})();
