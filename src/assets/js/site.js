// HolaOla Stories: jedyny skrypt strony. Bez zapytań do innych serwerów.
(function () {
  // Przełącznik języka: zapamiętuje wybór (dla strony startowej) i zachowuje kotwicę odcinka.
  document.querySelectorAll("[data-lang-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("hoLang", a.getAttribute("data-lang-link")); } catch (e) {}
      if (/^#ep\d+$/.test(location.hash)) {
        a.setAttribute("href", a.getAttribute("href").split("#")[0] + location.hash);
      }
    });
  });

  // Wejście z maila na konkretny odcinek (#ep3): rozwiń wersje w innych językach.
  function openTarget() {
    var m = /^#ep(\d+)$/.exec(location.hash);
    var el = m && document.getElementById("ep" + m[1]);
    var d = el && el.querySelector("details");
    if (d) d.open = true;
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);

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
