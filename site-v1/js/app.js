/* ===========================================================
   Leopoldina Imóveis: lógica do site (JS puro)
   Dados em js/data.js (window.IMOVEIS)
   =========================================================== */
(function () {
  "use strict";

  var IMOVEIS = window.IMOVEIS || [];
  var WHATSAPP = "5511999999999"; // número fictício do demo
  var FAV_KEY = "leo_favoritos";

  /* ---------- ícones (SVG de linha, sem emoji) ---------- */
  var ICONS = {
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    bath: '<path d="M4 10V6a2 2 0 0 1 4 0"/><path d="M3 10h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M7 18l-1.5 2.5M17 18l1.5 2.5"/>',
    car: '<path d="M5 11l1.3-3.8A2 2 0 0 1 8.2 6h7.6a2 2 0 0 1 1.9 1.2L19 11"/><path d="M3 11h18v5h-2.5v-1.5h-11V16H3z"/><circle cx="7.5" cy="14" r=".8"/><circle cx="16.5" cy="14" r=".8"/>',
    area: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M9 4v3M4 9h3M21 15h-3M15 21v-3"/>',
    drop: '<path d="M12 3.5s5.5 6 5.5 10.5a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5z"/>',
    tag: '<path d="M4 4h7l9 9-7 7-9-9V4z"/><circle cx="8" cy="8" r="1.4"/>',
    key: '<circle cx="8" cy="8" r="4"/><path d="M11 11l9 9M17 17l2-2"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-3h4v3"/>',
    pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    phone: '<path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z"/>',
    whatsapp: '<path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.7-2.1-1-.9 1c-1.2-.5-2.1-1.4-2.6-2.6l1-.9-1-2.1z" fill="currentColor" stroke="none"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    chevronL: '<path d="M15 6l-6 6 6 6"/>',
    chevronR: '<path d="M9 6l6 6-6 6"/>'
  };
  function svg(name, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  function fillIcons(scope) {
    (scope || document).querySelectorAll("[data-icon]").forEach(function (e) {
      e.innerHTML = svg(e.getAttribute("data-icon"));
    });
  }

  /* ---------- helpers ---------- */
  function fmtPreco(v) { return "R$ " + v.toLocaleString("pt-BR"); }
  function precoLabel(im) {
    return im.finalidade === "locacao" ? fmtPreco(im.preco) + "<small>/mês</small>" : fmtPreco(im.preco);
  }
  function esc(s) { return String(s).replace(/"/g, "&quot;"); }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function qs(name) { return new URLSearchParams(window.location.search).get(name); }
  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function isFav(id) { return getFavs().indexOf(id) > -1; }
  function toggleFav(id) {
    var f = getFavs(), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(f)); } catch (e) {}
    return i === -1;
  }

  /* ---------- card de imóvel (com carrossel) ---------- */
  function cardHTML(im) {
    var fav = isFav(im.id);
    var fotos = im.fotos || [];
    var multi = fotos.length > 1;

    var slides = fotos.map(function (src) {
      return '<a class="card-slide" href="imovel.html?id=' + im.id + '">' +
        '<img loading="lazy" src="' + src + '" alt="' + esc(im.titulo) + '" onerror="this.style.opacity=.25"></a>';
    }).join("");

    var arrows = multi
      ? '<button class="card-arrow prev" type="button" aria-label="Foto anterior">' + svg("chevronL") + "</button>" +
        '<button class="card-arrow next" type="button" aria-label="Próxima foto">' + svg("chevronR") + "</button>"
      : "";
    var dots = multi
      ? '<div class="card-dots">' + fotos.map(function (_, i) { return '<i class="' + (i === 0 ? "on" : "") + '"></i>'; }).join("") + "</div>"
      : "";

    var specs = [];
    if (im.quartos) specs.push("<span>" + svg("bed") + im.quartos + "</span>");
    if (im.banheiros) specs.push("<span>" + svg("bath") + im.banheiros + "</span>");
    if (im.vagas) specs.push("<span>" + svg("car") + im.vagas + "</span>");
    specs.push("<span>" + svg("area") + im.area + " m²</span>");

    var badge = im.finalidade === "locacao" ? "Locação" : "Venda";

    return (
      '<article class="card">' +
        '<div class="card-media" data-count="' + fotos.length + '">' +
          '<span class="card-badge ' + im.finalidade + '">' + badge + "</span>" +
          '<button class="card-fav' + (fav ? " active" : "") + '" data-fav="' + im.id + '" type="button" aria-label="Favoritar">' + svg("heart") + "</button>" +
          '<div class="card-track">' + slides + "</div>" +
          arrows + dots +
        "</div>" +
        '<div class="card-body">' +
          '<div class="card-loc">' + im.bairro + " · " + im.tipo + "</div>" +
          '<h3 class="card-title"><a href="imovel.html?id=' + im.id + '">' + im.titulo + "</a></h3>" +
          '<div class="card-price">' + precoLabel(im) + "</div>" +
          '<div class="card-specs">' + specs.join("") + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* binds: favoritos + carrossel dos cards dentro de um container */
  function bindCards(scope) {
    scope = scope || document;

    scope.querySelectorAll("[data-fav]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var on = toggleFav(b.getAttribute("data-fav"));
        b.classList.toggle("active", on);
      });
    });

    scope.querySelectorAll(".card-media[data-count]").forEach(function (media) {
      var count = +media.getAttribute("data-count");
      if (count < 2) return;
      var track = media.querySelector(".card-track");
      var dots = media.querySelectorAll(".card-dots i");
      var idx = 0;
      function go(n) {
        idx = (n + count) % count;
        track.style.transform = "translateX(-" + (idx * 100) + "%)";
        dots.forEach(function (d, i) { d.classList.toggle("on", i === idx); });
      }
      var prev = media.querySelector(".prev"), next = media.querySelector(".next");
      if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); go(idx - 1); });
      if (next) next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); go(idx + 1); });

      var x0 = null;
      media.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      media.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
        x0 = null;
      });
    });
  }

  /* ---------- nav mobile ---------- */
  function initNav() {
    var t = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (t && nav) t.addEventListener("click", function () { nav.classList.toggle("open"); });
  }

  /* ---------- whatsapp float ---------- */
  function initWhatsApp() {
    if (document.querySelector(".wa-float")) return;
    var a = el('<a class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/' + WHATSAPP + '">' + svg("whatsapp") + "</a>");
    document.body.appendChild(a);
  }

  /* ---------- HOME ---------- */
  function initHome() {
    var wrap = document.getElementById("destaques");
    if (wrap) {
      var dest = IMOVEIS.filter(function (i) { return i.destaque; }).slice(0, 6);
      wrap.innerHTML = dest.map(cardHTML).join("");
      bindCards(wrap);
    }
    var form = document.getElementById("home-search");
    if (form) {
      var tabs = form.querySelectorAll(".tab");
      var finalidade = form.querySelector('[name="finalidade"]');
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (x) { x.classList.remove("active"); });
          tab.classList.add("active");
          finalidade.value = tab.getAttribute("data-val");
        });
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var cod = (form.querySelector('[name="codigo"]').value || "").trim().toUpperCase();
        if (cod) {
          var match = IMOVEIS.filter(function (i) { return i.id.toUpperCase() === cod; })[0];
          window.location.href = match ? "imovel.html?id=" + match.id : "imoveis.html";
          return;
        }
        var p = new URLSearchParams();
        ["finalidade", "tipo", "bairro"].forEach(function (n) {
          var v = form.querySelector('[name="' + n + '"]').value;
          if (v) p.set(n, v);
        });
        window.location.href = "imoveis.html?" + p.toString();
      });
    }
  }

  /* ---------- LISTAGEM ---------- */
  function initListagem() {
    var grid = document.getElementById("lista");
    if (!grid) return;

    var f = {
      finalidade: document.querySelector('[name="f-finalidade"]'),
      tipo: document.querySelector('[name="f-tipo"]'),
      bairro: document.querySelector('[name="f-bairro"]'),
      quartos: document.querySelector('[name="f-quartos"]'),
      preco: document.querySelector('[name="f-preco"]'),
      ordem: document.querySelector('[name="f-ordem"]')
    };

    if (qs("finalidade")) f.finalidade.value = qs("finalidade");
    if (qs("tipo")) f.tipo.value = qs("tipo");
    if (qs("bairro")) f.bairro.value = qs("bairro");

    function aplica() {
      var out = IMOVEIS.slice();
      if (f.finalidade.value) out = out.filter(function (i) { return i.finalidade === f.finalidade.value; });
      if (f.tipo.value) out = out.filter(function (i) { return i.tipo === f.tipo.value; });
      if (f.bairro.value) out = out.filter(function (i) { return i.bairro === f.bairro.value; });
      if (f.quartos.value) out = out.filter(function (i) { return i.quartos >= +f.quartos.value; });
      if (f.preco.value) out = out.filter(function (i) { return i.preco <= +f.preco.value; });
      switch (f.ordem.value) {
        case "menor": out.sort(function (a, b) { return a.preco - b.preco; }); break;
        case "maior": out.sort(function (a, b) { return b.preco - a.preco; }); break;
        case "area": out.sort(function (a, b) { return b.area - a.area; }); break;
      }
      render(out);
    }

    function render(list) {
      document.getElementById("count").innerHTML = "<b>" + list.length + "</b> imóveis encontrados";
      if (!list.length) {
        grid.classList.remove("grid-cards");
        grid.innerHTML = '<div class="empty"><b>Nenhum imóvel com esses filtros</b>Tente ampliar a busca ou limpar os filtros.</div>';
        return;
      }
      grid.classList.add("grid-cards");
      grid.innerHTML = list.map(cardHTML).join("");
      bindCards(grid);
    }

    Object.keys(f).forEach(function (k) {
      if (f[k]) f[k].addEventListener("change", aplica);
    });
    var clear = document.getElementById("limpar");
    if (clear) clear.addEventListener("click", function () {
      Object.keys(f).forEach(function (k) { if (f[k]) f[k].value = ""; });
      aplica();
    });

    aplica();
  }

  /* ---------- DETALHE ---------- */
  function initDetalhe() {
    var root = document.getElementById("imovel-detalhe");
    if (!root) return;
    var im = IMOVEIS.filter(function (i) { return i.id === qs("id"); })[0] || IMOVEIS[0];
    if (!im) { root.innerHTML = '<div class="empty"><b>Imóvel não encontrado</b></div>'; return; }

    document.title = im.titulo + " | Leopoldina Imóveis";

    var fotos = im.fotos.slice(0, 5);
    var galHTML;
    if (fotos.length === 1) {
      galHTML = '<div class="gallery single"><img class="main" src="' + fotos[0] + '" alt="' + esc(im.titulo) + '"></div>';
    } else {
      galHTML = '<div class="gallery"><img class="main" src="' + fotos[0] + '" alt="' + esc(im.titulo) + '">' +
        fotos.slice(1, 5).map(function (src) { return '<img class="thumb" src="' + src + '" alt="">'; }).join("") + "</div>";
    }

    var specs = [
      ["area", im.area + " m²", "Área útil"],
      im.quartos ? ["bed", im.quartos, im.quartos > 1 ? "Quartos" : "Quarto"] : null,
      im.suites ? ["drop", im.suites, im.suites > 1 ? "Suítes" : "Suíte"] : null,
      im.banheiros ? ["bath", im.banheiros, "Banheiros"] : null,
      im.vagas ? ["car", im.vagas, im.vagas > 1 ? "Vagas" : "Vaga"] : null
    ].filter(Boolean);

    var costRows = [["Valor", precoLabel(im)]];
    if (im.condominio) costRows.push(["Condomínio", fmtPreco(im.condominio) + "/mês"]);
    if (im.iptu) costRows.push(["IPTU", fmtPreco(im.iptu) + "/mês"]);

    var msg = encodeURIComponent("Olá! Tenho interesse no imóvel " + im.id + ": " + im.titulo);

    root.innerHTML =
      galHTML +
      '<div class="detail-grid">' +
        "<div>" +
          '<div class="detail-loc">' + im.endereco + "</div>" +
          "<h1>" + im.titulo + "</h1>" +
          '<div class="detail-price">' + precoLabel(im) + "</div>" +
          '<div class="specs-row">' +
            specs.map(function (s) { return '<div class="spec-pill">' + svg(s[0]) + "<b>" + s[1] + "</b><span>" + s[2] + "</span></div>"; }).join("") +
          "</div>" +
          "<h2>Sobre o imóvel</h2><p class=\"detail-desc\">" + im.descricao + "</p>" +
          "<h2>Características</h2><ul class=\"feature-list\">" +
            im.caracteristicas.map(function (c) { return "<li>" + c + "</li>"; }).join("") +
          "</ul>" +
          "<h2>Valores</h2><table class=\"cost-table\">" +
            costRows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("") +
          "</table>" +
        "</div>" +
        '<aside class="contact-card">' +
          "<h3>Falar com a corretora</h3>" +
          '<p class="sub">Resposta no mesmo dia útil.</p>' +
          '<a class="btn btn--primary btn--block" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + "?text=" + msg + '">Chamar no WhatsApp</a>' +
          '<div style="height:12px"></div>' +
          '<form class="form" data-fake-form>' +
            "<div><label>Nome</label><input required placeholder=\"Seu nome\"></div>" +
            "<div><label>Telefone</label><input required placeholder=\"(11) 90000-0000\"></div>" +
            "<div><label>Mensagem</label><textarea placeholder=\"Quero agendar uma visita\">Tenho interesse no imóvel " + im.id + ".</textarea></div>" +
            '<button class="btn btn--brand btn--block" type="submit">Solicitar contato</button>' +
          "</form>" +
          '<div class="code">Código do imóvel: ' + im.id + "</div>" +
        "</aside>" +
      "</div>";

    bindFakeForms(root);

    var rel = document.getElementById("relacionados");
    if (rel) {
      var similares = IMOVEIS.filter(function (i) { return i.bairro === im.bairro && i.id !== im.id; }).slice(0, 3);
      if (!similares.length) similares = IMOVEIS.filter(function (i) { return i.id !== im.id; }).slice(0, 3);
      rel.innerHTML = similares.map(cardHTML).join("");
      bindCards(rel);
    }
  }

  /* ---------- formulários fake (demo) ---------- */
  function bindFakeForms(scope) {
    (scope || document).querySelectorAll("[data-fake-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = el('<div class="form-success">Recebemos seu contato! Em um site real, a mensagem chegaria à corretora. Retornaremos em breve.</div>');
        form.reset();
        form.parentNode.insertBefore(msg, form);
        form.style.display = "none";
      });
    });
  }

  /* ---------- travas: sem zoom, sem seleção/cópia ---------- */
  function inField(t) { return t && t.closest && t.closest("input, textarea, select"); }

  function initLock() {
    // zoom via Ctrl + roda do mouse
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    // zoom via teclado (Ctrl/Cmd + +, -, =, 0)
    window.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].indexOf(e.key) > -1) e.preventDefault();
    });

    // zoom por gesto (Safari/trackpad)
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); });
    });

    // bloquear cópia, recorte, menu de contexto e seleção (exceto em campos)
    ["copy", "cut"].forEach(function (ev) {
      document.addEventListener(ev, function (e) { if (!inField(e.target)) e.preventDefault(); });
    });
    document.addEventListener("contextmenu", function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener("selectstart", function (e) { if (!inField(e.target)) e.preventDefault(); });
    document.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initLock();
    fillIcons(document);
    initNav();
    initWhatsApp();
    initHome();
    initListagem();
    initDetalhe();
    bindFakeForms(document);
  });
})();
