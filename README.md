# holaolastories.com

Strona serii Pingwinek Kajo / Kayo the Penguin / Kaio el Pingüino / कायो पेंगुइन w czterech językach.
Statyczna strona (Eleventy), hostowana na GitHub Pages. Bez skryptów i fontów z innych serwerów.

## Gdzie co jest

| Co | Plik |
|---|---|
| Odcinki (tytuły, zdania fabuły, czasy, linki YouTube, Spotify, Apple, okładki) | `src/_data/episodes.yaml` |
| Kanały i pokazy w każdym języku | `src/_data/shows.yaml` |
| Teksty stałe w każdym języku | `src/_data/i18n/pl.yaml`, `en.yaml`, `es.yaml`, `hi.yaml` |
| Ustawienia (języki, adres, noindex do startu) | `src/_data/site.js` |
| Szablon strony językowej | `src/lang.njk`, karta odcinka w `src/_includes/links.njk` |
| Strona startowa (przenosi do języka) | `src/index.njk` |
| Wygląd | `src/assets/css/site.css`, fonty w `src/assets/fonts` |
| Okładki i grafiki (kopie WebP, oryginały zostają u Jakuba) | `src/img` |

Nowy odcinek: dopisać wpis w `episodes.yaml` (tylko języki, w których odcinek wyszedł) i okładki
`src/img/covers/s01eNN_<język>.webp` (720 x 720). Brak języka w wpisie = odcinek nie pokazuje się w tej wersji.

## Polecenia

```
npm ci
npm run build     # strona do _site
npm run preview   # wersja do prywatnego podglądu w _preview (linki z index.html)
npm run serve     # podgląd lokalny
```

Adresy: `/pl/`, `/en/`, `/es/`, `/hi/`, kotwice odcinków `#ep1` do `#epN` takie same w każdym języku.
Do startu na holaolastories.com strony mają `noindex`. Przełącznik jest w `.github/workflows/pages.yml`
(`NOINDEX: "1"`, na start zmienić na `"0"`; lokalnie `NOINDEX=0 npm run build`).
Własna domena: wpisuje się ją w Settings > Pages > Custom domain. Przy publikacji przez GitHub Actions plik `CNAME`
nie jest potrzebny (GitHub go ignoruje). `404.html`, `sitemap.xml` i `robots.txt` powstają przy budowaniu.

Fonty: Baloo 2, Montserrat, Noto Sans Devanagari (SIL Open Font License 1.1, pliki licencji w `src/assets/fonts`).

## Prawa

Wszelkie prawa do tekstów, grafik, postaci i kodu zastrzeżone, szczegóły w pliku `LICENSE`.
Fonty mają własną licencję (SIL OFL 1.1).
