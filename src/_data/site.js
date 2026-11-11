// Ustawienia całej strony.
// PREVIEW=1 buduje wersję do prywatnego podglądu: linki z jawnym index.html
// i strona startowa bez automatycznego przenoszenia.
const preview = process.env.PREVIEW === "1";

export default {
  url: "https://holaolastories.com",
  name: "HolaOla Stories",
  email: "hello@holaolastories.com",
  year: 2026,
  // Kolejność języków w przełączniku i na stronie startowej.
  langs: ["pl", "en", "es", "hi"],
  defaultLang: "en",
  // noindex tylko przy NOINDEX="1". Domyślnie (także bez zmiennej) strona jest indeksowana.
  noindex: process.env.NOINDEX === "1",
  // Dzień budowania (RRRR-MM-DD), do lastmod w mapie strony.
  built: new Date().toISOString().slice(0, 10),
  preview,
  indexFile: preview ? "index.html" : "",
};
