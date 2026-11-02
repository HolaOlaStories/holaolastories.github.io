import { load as loadYaml } from "js-yaml";

export default function (eleventyConfig) {
  // Dane w YAML (odcinki, teksty stałe), te same pliki edytuje później Pages CMS.
  eleventyConfig.addDataExtension("yaml", (contents) => loadYaml(contents));

  eleventyConfig.addPassthroughCopy({ "src/img": "img", "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Ekran startowy podglądu powstaje tylko w buildzie PREVIEW=1.
  if (process.env.PREVIEW !== "1") eleventyConfig.ignores.add("src/preview-root.njk");
  // 404 i mapa strony tylko w prawdziwej stronie, nie w prywatnym podglądzie.
  if (process.env.PREVIEW === "1") { eleventyConfig.ignores.add("src/404.njk"); eleventyConfig.ignores.add("src/sitemap.njk"); }

  // "21:13" -> 21
  eleventyConfig.addFilter("minutes", (d) => {
    const [m, s] = String(d).split(":").map(Number);
    return Math.round((m * 60 + (s || 0)) / 60);
  });

  // Języki, w których odcinek istnieje, poza językiem strony.
  eleventyConfig.addFilter("otherLangs", (ep, lang, langs) => langs.filter((c) => c !== lang && ep[c]));

  // Odcinki dostępne w danym języku.
  eleventyConfig.addFilter("inLang", (episodes, lang) => episodes.filter((e) => e[lang]));

  // Ścieżki względne działają tak samo na holaolastories.com,
  // pod adresem testowym github.io/<repo>/ i w prywatnym podglądzie.
  eleventyConfig.addFilter("rel", (p, root) => (root || "") + String(p).replace(/^\//, ""));

  return {
    dir: {
      input: "src",
      output: process.env.PREVIEW === "1" ? "_preview" : "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
