import ogs from "open-graph-scraper-lite";

export const getOpenGraphData = async (url: string) => {
  const html = await fetch(url);
  const htmlText = await html.text();

  const options = {
    html: htmlText,
  };

  const openGraphData = await ogs(options);

  return openGraphData;
};
