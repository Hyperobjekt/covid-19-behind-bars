if (typeof fetch !== "function") {
  global.fetch = require("node-fetch");
}
const { groups } = require("d3-array");
const { csvFormat } = require("d3-dsv");
const {
  getData,
  writeFile,
  fixCasing,
  getInt,
  slugify,
  validStateNames,
} = require("./utils.js");

/**
 * FACILITY DATA (CASES / DEATHS / ACTIVE, ETC)
 */
const timeSeriesCsv = `http://104.131.72.50:3838/scraper_data/summary_data/scraped_time_series.csv`;

async function loadTimeSeries() {
  const d = await getData(timeSeriesCsv);

  const groupKeys = {
    Residents: ["Confirmed", "Deaths", "Active", "Tested"],
    Staff: ["Confirmed", "Deaths", "Active"],
  };

  const byFacility = groups(d, (r) => r["Facility.ID"]);
  const allFacilities = [];

  const shapedData = byFacility.map((facData) => {
    const id = facData[0];
    const facRows = facData[1];
    const sampleRow = facRows[0];
    const state = validStateNames.includes(sampleRow["State"])
      ? sampleRow["State"]
      : "*other";

    const facility = {
      id,
      state,
      name: fixCasing(sampleRow["Name"]),
    };

    ["Residents", "Staff"].forEach((grp) => {
      const keys = groupKeys[grp];
      const popAccessor = grp + ".Population";

      keys.forEach((key) => {
        const accessor = grp + "." + key;

        const newKey = (grp + "_" + key).toLowerCase();
        facility[newKey] = "";

        const newRateKey = newKey + "_rate";
        facility[newRateKey] = "";

        let nullValues = "";
        let nullRateValues = "";

        facRows.forEach((row) => {
          const date = row["Date"];
          const value = getInt(row[accessor]);
          const valueString = date + "|" + value + ";";

          // ignore populations of 0
          const population = getInt(row[popAccessor]) || NaN;
          
          if (Number.isInteger(value)) {
            facility[newKey] += nullValues + valueString;
            nullValues = "";

            if (Number.isInteger(population) || facility[newRateKey]) {
              const rate = value / population;
              facility[newRateKey] += nullRateValues + date + "|" + rate + ";";
              nullRateValues = "";
            }
          } else if (facility[newKey]) {
            // record non-values only if some value is already recorded and others are coming
            // (so gaps between data are shown, but not large leading/trailing gaps)
            nullValues += valueString;

            if (Number.isInteger(population) || facility[newRateKey]) {
              const rate = value / population;
              nullRateValues += date + "|" + rate + ";";
            }
          }
        });
      });
    });

    allFacilities.push({
      id: facility.id,
      name: facility.name,
      state: facility.state,
    });

    return facility;
  });

  const shapedByState = groups(shapedData, (r) => r.state);

  for (let i = 0; i < shapedByState.length; i++) {
    const stateData = shapedByState[i];
    const stateName = stateData[0];
    const stateRows = stateData[1];

    await writeFile(
      csvFormat(stateRows),
      `./static/data/${slugify(stateName)}.csv`
    );
  }

  // sorts primarily by State, secondarily by Name
  const sortedFacilities = allFacilities.sort((a, b) => {
    const stateA = a.state.toLowerCase();
    const stateB = b.state.toLowerCase();
    if (stateA > stateB) return 1;
    if (stateA < stateB) return -1;

    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA > nameB ? 1 : -1;
  });

  await writeFile(
    csvFormat(sortedFacilities),
    "./static/data/allFacilities.csv"
  );
}

loadTimeSeries();
