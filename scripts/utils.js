const fs = require("fs");
const { csv: fetchCsv } = require("d3-fetch");

// keep in line with getSlug in selectors.js
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

exports.slugify = slugify;

exports.validStateNames = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
exports.validStatePages = this.validStateNames.map(slugify);

exports.writeFile = function (data, outputFile) {
  const filePieces = outputFile.split("/");
  const outputFileName = filePieces.pop();
  const outputFileDir = filePieces.join("/");
  // make dir if needed
  return fs.promises
    .mkdir(outputFileDir, { recursive: true })
    .then(() => {
      // write file
      return new Promise((resolve, reject) => {
        fs.writeFile(outputFile, data, (err) => {
          if (err) return reject(err);
          console.info("wrote transformed data to: " + outputFile);
          return resolve(outputFile);
        });
      });
    })
    .catch((error) => {
      console.error("caught exception : ", error.message);
      return error;
    });
};


/**
 * Abbreviations that should be forced to uppercase
 */
const UPPER_CASE = [
  "asp",
  "atc",
  "bop",
  "ca",
  "cc",
  "ccw",
  "cf",
  "ci",
  "cim",
  "ciw",
  "cmc",
  "cmf",
  "col",
  "crc",
  "crv",
  "cs",
  "cvsp",
  "cw",
  "dvi",
  "fci",
  "fdc",
  "fmc",
  "fsp",
  "gdcp",
  "ice",
  "ii",
  "imcc",
  "iwp",
  "li",
  "llc",
  "mcc",
  "mci",
  "mdc",
  "nbci",
  "nwfrc",
  "pdc",
  "prc",
  "rcc",
  "rci",
  "sbwc",
  "sfrc",
  "smcc",
  "smu",
  "sq",
  "svsp",
  "usp",
  "wci",
];

/**
 * All ways DC is represented in source data (in lower case)
 */
const DC_VARIANTS = ["dc", "district of columbia", "district of col"];

/**
 * Helper function to get integer value, or -999 when not a number
 * @param {*} value
 * @returns
 */
exports.getInt = (value) => {
  const intValue = parseInt(value);
  return isNaN(intValue) ? null : intValue;
};

exports.getFloat = (value) => {
  const floatValue = parseFloat(value);
  return isNaN(floatValue) ? null : floatValue;
};

/**
 * Fixes casing on strings THAT ARE ALL UPPERCASE
 * so that They Have Title Casing
 * @param {string} str
 */
exports.fixCasing = function (str) {
  if (!str) return "Unknown";
  const result = str
    .toLowerCase()
    .replace(/\b\w/g, (v) => v.toString(v).toUpperCase())
    .split(" ")
    .map((v) =>
      UPPER_CASE.indexOf(v.toLowerCase()) > -1 ? v.toUpperCase() : v
    )
    .join(" ");
  return result;
}

/**
 * Fixes for inconsistent state naming
 * @param {string} str
 */
exports.formatState = function (str) {
  return DC_VARIANTS.includes(str.toLowerCase()) ? "District of Columbia" : str;
}

exports.getData = async function (url, parser, options = {}) {
  let data = await fetchCsv(url, parser);
  // remove descriptive rows following the top identifier row
  if (options.dropRows) {
    data = data.slice(options.dropRows);
  }
  return data;
};

/**
 * Splits any keys with a "." into a nested object
 * @param {*} data
 */
exports.groupObjectData = (data) =>
  Object.keys(data).reduce((obj, key) => {
    if (key.indexOf(".") > -1) {
      const [group, ...rest] = key.split(".");
      const first = group.toLowerCase();
      const second = rest.map((r) => r.toLowerCase()).join(".");
      if (!obj.hasOwnProperty(first)) obj[first] = {};
      obj[first][second] = data[key];
    } else {
      obj[key.toLowerCase()] = data[key];
    }
    return obj;
  }, {});