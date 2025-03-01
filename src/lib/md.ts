import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export const parseUrlToMarkdown = async (url: string) => {
  const resp = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      Referer: "https://www.google.com/",
    },
  });

  console.log("Status", resp.status);

  const html = await resp.text();

  const DOMParser = new JSDOM().window.DOMParser;

  const document = new DOMParser().parseFromString(html, "text/html");

  const article = new Readability(document).parse();
  if (!article) {
    throw new Error("No article found");
  }

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(article.content);

  return markdown;
};
