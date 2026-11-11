// HolaOla Stories: jedyny skrypt strony. Bez zapytań do innych serwerów.
(function () {
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Karta odcinka najbliżej nagłówka (ta, którą gość właśnie ogląda). Brak, gdy na ekranie nie ma żadnej karty.
  function currentEpisode() {
    var top = document.querySelector(".top");
    var line = top ? top.getBoundingClientRect().bottom : 0;
    var best = null, bestDist = Infinity;
    document.querySelectorAll("article.ep[id]").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom <= line + 48 || r.top >= window.innerHeight) return;
      var dist = Math.abs(r.top - line);
      if (dist < bestDist) { best = el; bestDist = dist; }
    });
    return best;
  }

  // Przełącznik języka: zapamiętuje wybór (dla strony startowej) i przenosi do tego samego odcinka.
  document.querySelectorAll("[data-lang-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("hoLang", a.getAttribute("data-lang-link")); } catch (e) {}
      var ep = currentEpisode();
      var base = a.getAttribute("href").split("#")[0];
      a.setAttribute("href", ep ? base + "#" + ep.id : base);
    });
  });

  // Wejście z linku na konkretny odcinek (#ep3): rozwiń wersje w innych językach.
  // Gdy takiego odcinka na stronie nie ma (#ep9), krótki komunikat nad listą odcinków.
  var missing = document.getElementById("ep-missing");
  function openTarget() {
    var m = /^#ep(\d+)$/.exec(location.hash);
    var el = m && document.getElementById("ep" + m[1]);
    var d = el && el.querySelector("details");
    if (d) d.open = true;
    if (!missing) return;
    if (m && !el) {
      missing.textContent = missing.getAttribute("data-text").replace("{n}", m[1]);
      missing.hidden = false;
      missing.scrollIntoView();
    } else {
      missing.hidden = true;
    }
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);

  // Przycisk "Posłuchaj" w otwarciu: płynne przewinięcie do odcinka 1 (tylko ten przycisk).
  // Wejścia z linków (#ep3) przewijają od razu, bez animacji.
  document.querySelectorAll(".hero a[href^='#ep']").forEach(function (a) {
    a.addEventListener("click", function () {
      if (reduced) return;
      var html = document.documentElement;
      html.style.scrollBehavior = "smooth";
      setTimeout(function () { html.style.scrollBehavior = ""; }, 1000);
    });
  });

  // Kopiowanie adresu e-mail.
  var btn = document.getElementById("copy-mail");
  if (btn) {
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = btn.getAttribute("data-done");
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      var fallback = function () {
        var r = document.createRange();
        r.selectNodeContents(document.getElementById("mail"));
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      };
      try {
        navigator.clipboard.writeText(text).then(done, fallback);
      } catch (e) { fallback(); }
    });
  }
})();
