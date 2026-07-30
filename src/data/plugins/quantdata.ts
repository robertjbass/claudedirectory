import { Plugin } from "@/lib/types";

export const quantdataPlugin: Plugin = {
  slug: "quantdata",
  title: "Quant Data",
  description:
    "Market-statistics skills that report backtested probabilities with their baselines, sample sizes and p-values: five-class day-type probabilities for the session in progress, Weis volume-price wave events with pre-registered win rates (cib_long 51.8% over a 49.3% baseline, n=13,867), options max pain from open interest alone, and estimated dealer gamma exposure. Publishes where the methods fail — crypto, gold, chart patterns — and refuses to present output as trading advice.",
  tags: ["market-data", "finance", "options", "statistics", "skills"],
  author: {
    name: "Celine Yu",
    url: "https://quantdata.uk",
  },
  repoUrl: "https://github.com/celineycn/quantdata-plugin",
  installCommand:
    "/plugin marketplace add celineycn/quantdata-plugin && /plugin install quantdata@quantdata",
};
