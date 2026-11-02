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
  // Do startu na holaolastories.com strona nie jest indeksowana.
  noindex: process.env.NOINDEX !== "0",
  preview,
  indexFile: preview ? "index.html" : "",
};
