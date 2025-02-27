import ogs from "open-graph-scraper-lite";

export const getOpenGraphData = async (url: string) => {
  const html = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
  });
  const htmlText = await html.text();

  const options = {
    html: htmlText,
  };

  const openGraphData = await ogs(options);

  return openGraphData;
};
