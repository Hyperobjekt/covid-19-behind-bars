import { format as d3Format } from "d3-format";

export const KEYS = {
  jurisdiction: "jurisdiction",
  state: "state",
  cases: "confirmed",
  deaths: "deaths",
  active: "active",
  tested: "tested",
  population: "population",
};

export const GROUPS = ["residents", "staff"];

export const JURISDICTIONS = ["state", "federal", "county", "immigration"];
// fixes #157: don't sum over county jails
export const SUMMABLE_JURISDICTIONS = ["state", "federal", "immigration"];

export const METRICS = {
  residents: [
    "confirmed",
    "deaths",
    "active",
    "tested",
    "confirmed_rate",
    "deaths_rate",
    "active_rate",
    "tested_rate",
  ],
  immigration: [
    "confirmed",
    "deaths",
    "active",
    "confirmed_rate",
    "deaths_rate",
    "active_rate",
  ],
  staff: ["confirmed", "deaths", "active", "tested"],
};

export const METRIC_FORMATTERS = {
  confirmed: d3Format(",d"),
  deaths: d3Format(",d"),
  active: d3Format(",d"),
  tested: d3Format(",d"),
  confirmed_rate: d3Format(".0%"),
  deaths_rate: d3Format(".0%"),
  active_rate: d3Format(".0%"),
  tested_rate: d3Format(".0%"),
  count_legend: d3Format(".2s"),
  rate_legend: d3Format(".0%"),
  rate_legend_small: d3Format(".1%"), // legend gets 1 decimal for values <1

  home_table_rate: d3Format(".0%"), // TODO: use col id instead to select proper metric formatter
};

export const JURISDICTION_COLORS = [
  "#D7790F",
  "#7FB89A",
  "#77AAC7",
  "#96738F",
  "#555526",
];
// export const JURISDICTION_COLORS = ["#CA7F26", "#6BA084", "#758EAC", "#555526"]

export const JURISDICTION_GRADIENTS = [
  "url(#g1)",
  "url(#g2)",
  "url(#g3)",
  "url(#g4)",
  "url(#g5)",
];

export const TIME_SERIES_COLORS = [
  "#D7790F",
  "#82CAA4",
  "#4C6788",
  "#84816F",
  "#71A9C9",
  "#AE91A8",
  "#DED6DC",
  "#B4C551",
  "#7E55D4",
  "#A21916",
  "#BC73AE",
  "#567EBA",
  "#FFD540",
  "#CF5833",
];
