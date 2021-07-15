const {
  getInt,
  getFloat,
  fixCasing,
  formatState,
  groupObjectData,
} = require("./utils.js");

/**
 * Parses a facility object
 * @param {*} facility
 */
const parseFacility = (facility = {}) => {
  const source = groupObjectData(facility);

  const residentKeys = [
    "confirmed",
    "deaths",
    "active",
    "population",
    "released",
    "recovered",
    "tadmin",
  ];
  const residentRates = ["confirmed", "deaths", "active", "tested"];
  const staffKeys = ["confirmed", "deaths", "active"];

  const result = {};

  result.name = fixCasing(source.name);
  result.jurisdiction = source["jurisdiction"];
  result.city = source["city"];
  result.state = formatState(source["state"]);
  result.date = Date.parse(source["date"]);

  // parse coordinates
  const Latitude = getFloat(source["latitude"]);
  const Longitude = getFloat(source["longitude"]);
  result.coords = [Longitude, Latitude];

  // NOTE should now always be true
  const useAltPopCol = source.population && source.population.feb20;

  // parse residents data
  result.residents = residentKeys.reduce((obj, key) => {
    if (key === "tadmin") {
      obj["tested"] = getInt(source.residents[key]);
      return obj;
    } else if (key === "population" && useAltPopCol) {
      obj["population"] = getInt(source.population.feb20);
      return obj;
    } else {
      obj[key] = getInt(source.residents[key]);
      return obj;
    }
  }, {});

  // add field office id
  result.iceFieldOffice = source.ice["field.office"] || null;

  // add rates
  residentRates.forEach((rateType) => {
    result.residents[rateType + "_rate"] = result.residents.population
      ? result.residents[rateType] / result.residents.population
      : null;
  });

  // parse staff data
  result.staff = staffKeys.reduce((obj, key) => {
    obj[key] = getInt(source.staff[key]);
    return obj;
  }, {});

  return result;
};

/**
 * Parses a vaccine object
 * @param {*} vaccine
 */
const parseVaccine = (vaccine = {}) => {
  const source = groupObjectData(vaccine);

  const residentKeys = ["initiated", "population"];
  // to change name from spreadsheet on import
  const residentKeyMap = { population: "population" };
  const staffKeys = ["initiated", "population"];

  const result = {};

  const jurisMap = {
    federal: "Federal Bureau of Prisons",
    ice: "ICE Detention",
  };

  const nonStateMap = {
    federal: true,
    ice: true,
  };

  result.jurisdiction = jurisMap[source.state.toLowerCase()] || source.state;
  result.isState = !nonStateMap[source.state.toLowerCase()];
  result.isIce = source.state.toLowerCase() === "ice";
  result.isFederal = source.state.toLowerCase() === "federal";

  // parse staff data
  result.staff = staffKeys.reduce((obj, key) => {
    obj[key] = getInt(source.staff[key]);
    return obj;
  }, {});

  // parse residents data
  result.residents = residentKeys.reduce((obj, key) => {
    const ourKey = residentKeyMap[key] || key;
    obj[ourKey] = getInt(source.residents[key]);
    return obj;
  }, {});

  return result;
};

const parseIntComma = (value) => getInt(value.replace(/,/g, ""));
const parseFloatComma = (value) => getFloat(value.replace(/,/g, ""));

const getParser = (type) => {
  // if it's already a parsing function, return it
  if (typeof type === "function") return type;
  switch (type) {
    case "int":
      return parseIntComma;
    case "float":
      return parseFloatComma;
    case "string":
      return (a) => a.trim();
    default:
      // do nothing by default
      return (a) => a;
  }
};

// checks if b is exact match to a
const exactMatch = (a, b) => a.toLowerCase() === b.toLowerCase() && a;

// checks if b is contained within a
const roughMatch = (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) > -1 && a;

// checks if the regex matches the key
const regexMatch = (a, b) => {
  const regex = new RegExp(b);
  const matches = a.match(regex);
  return !!matches && a;
};

const getSourceValue = (row, colName, checkMatch = exactMatch) => {
  const keys = Object.keys(row);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const matchKey = checkMatch(key, colName, row);
    if (matchKey) return row[matchKey];
  }
  console.warn("no match for column: ", colName);
  console.debug("column names are: ", keys.join("\n"));
};

const parseMap = (row, colMap) => {
  const result = {};
  Object.keys(colMap).forEach((colName) => {
    const [sourceCol, parser, selector] = colMap[colName];
    const valueParser = getParser(parser);
    const rawValue = getSourceValue(row, sourceCol, selector);
    let parsedValue = valueParser(rawValue);
    if ((parser === "int" || parser === "float") && isNaN(parsedValue))
      parsedValue = null;

    if (colName === "state") {
      parsedValue = formatState(parsedValue);
    }
    result[colName] = parsedValue;
  });
  return result;
};

module.exports = {
  parseFacility,
  parseVaccine,
  parseMap,
  exactMatch,
  roughMatch,
  regexMatch,
};
