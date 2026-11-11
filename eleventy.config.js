import { load as loadYaml } from "js-yaml";

export default function (eleventyConfig) {
  // Dane w YAML (odcinki, teksty stałe), te same pliki edytuje później Pages CMS.
  eleventyConfig.addDataExtension("yaml", (contents) => loadYaml(contents));

  eleventyConfig.addPassthroughCopy({ "src/img": "img", "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Ekran startowy podglądu powstaje tylko w buildzie PREVIEW=1.
  // Plik jest w .gitignore (zostaje poza repozytorium), więc w podglądzie Eleventy nie może czytać .gitignore.
  if (process.env.PREVIEW !== "1") eleventyConfig.ignores.add("src/preview-root.njk");
  else eleventyConfig.setUseGitIgnore(false);
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

  // Pierwsze zdanie tekstu (kropka albo hinduska danda "।").
  eleventyConfig.addFilter("firstSentence", (s) => {
    const m = /^.*?[.।](?=\s|$)/.exec(String(s));
    return m ? m[0] : String(s);
  });

  // Dane strukturalne (JSON-LD) z episodes.yaml, shows.yaml i tekstów i18n.
  // lang = kod języka strony albo pusty dla strony startowej (wtedy tylko Organization i WebSite).
  eleventyConfig.addFilter("jsonld", (lang, d) => {
    const json = JSON.stringify(jsonld(lang, d), null, 1);
    return json.replace(/</g, "\\u003c");
  });

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

// Język oryginału serii. Pozostałe wersje są tłumaczeniami (translationOfWork).
const ORIGINAL = "pl";
const AUTHOR = { "@type": "Person", name: "Jakub Leśniak" };
const NARRATOR = { "@type": "Person", name: "Ola Stalmach" };

// "20:35" -> "PT20M35S"
function isoDuration(d) {
  const [m, s] = String(d).split(":").map(Number);
  return "PT" + m + "M" + (s || 0) + "S";
}

function jsonld(lang, { site, i18n, shows, episodes }) {
  const u = site.url;
  const brands = site.langs.map((c) => i18n[c].brand);
  const org = {
    "@type": "Organization",
    "@id": u + "/#organization",
    name: site.name,
    alternateName: brands,
    url: u + "/",
    logo: { "@type": "ImageObject", url: u + "/img/logo-holaola-192.webp", width: 192, height: 192 },
    email: site.email,
    sameAs: site.langs.map((c) => "https://www.youtube.com/" + shows[c].youtube),
  };
  const website = {
    "@type": "WebSite",
    "@id": u + "/#website",
    url: u + "/",
    name: site.name,
    alternateName: brands,
    inLanguage: site.langs.map((c) => i18n[c].htmlLang),
    publisher: { "@id": u + "/#organization" },
  };
  const graph = [org, website];
  if (!lang) return { "@context": "https://schema.org", "@graph": graph };

  const t = i18n[lang];
  const show = shows[lang];
  const page = u + "/" + lang + "/";
  const image = { "@type": "ImageObject", url: u + "/img/og-kajo.jpg", width: 1200, height: 630 };
  const seriesRef = (c) => ({ "@type": "PodcastSeries", "@id": u + "/" + c + "/#series", name: i18n[c].series, inLanguage: i18n[c].htmlLang, url: u + "/" + c + "/" });
  const epRef = (ep, c) => ({ "@type": "PodcastEpisode", "@id": u + "/" + c + "/#ep" + ep.number, name: ep[c].title, inLanguage: i18n[c].htmlLang, url: u + "/" + c + "/#ep" + ep.number });

  graph.push({
    "@type": "WebPage",
    "@id": page + "#webpage",
    url: page,
    name: t.metaTitle,
    description: t.metaDescription,
    inLanguage: t.htmlLang,
    isPartOf: { "@id": u + "/#website" },
    primaryImageOfPage: image,
    mainEntity: { "@id": page + "#series" },
  });

  const series = {
    "@type": "PodcastSeries",
    "@id": page + "#series",
    name: t.series,
    alternateName: t.metaTitle.split(" | ")[0],
    description: t.lead,
    url: page,
    inLanguage: t.htmlLang,
    image: image.url,
    genre: "Kids & Family",
    isAccessibleForFree: true,
    author: AUTHOR,
    contributor: NARRATOR,
    publisher: { "@id": u + "/#organization" },
    sameAs: [
      "https://open.spotify.com/show/" + show.spotify,
      "https://podcasts.apple.com/us/podcast/id" + show.apple,
      "https://www.youtube.com/" + show.youtube,
    ],
  };
  if (lang === ORIGINAL) series.workTranslation = site.langs.filter((c) => c !== ORIGINAL).map(seriesRef);
  else series.translationOfWork = seriesRef(ORIGINAL);
  graph.push(series);

  for (const ep of episodes.filter((e) => e[lang])) {
    const v = ep[lang];
    const node = {
      "@type": "PodcastEpisode",
      "@id": page + "#ep" + ep.number,
      url: page + "#ep" + ep.number,
      name: v.title,
      episodeNumber: ep.number,
      description: v.summary,
      inLanguage: t.htmlLang,
      duration: isoDuration(v.duration),
    };
    if (v.published) node.datePublished = v.published;
    Object.assign(node, {
      image: u + v.cover,
      isAccessibleForFree: true,
      partOfSeries: { "@id": page + "#series" },
      sameAs: [
        "https://www.youtube.com/watch?v=" + v.youtube,
        "https://open.spotify.com/episode/" + v.spotify,
        "https://podcasts.apple.com/us/podcast/id" + show.apple + "?i=" + v.apple,
      ],
    });
    if (lang === ORIGINAL) {
      const tr = site.langs.filter((c) => c !== ORIGINAL && ep[c]).map((c) => epRef(ep, c));
      if (tr.length) node.workTranslation = tr;
    } else if (ep[ORIGINAL]) {
      node.translationOfWork = epRef(ep, ORIGINAL);
    }
    graph.push(node);
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
