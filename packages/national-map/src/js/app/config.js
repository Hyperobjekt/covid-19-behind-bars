export const PROPERTY_MAP = {
  Name: "name",
  City: "city",
  "County.FIPS": "county",
  "Facility.Type": "facility",
  Latitude: "lat",
  Longitude: "lon",
  State: "state",
  "Residents.Confirmed": "res_confirmed",
  "Residents.Tested": "res_tested",
  "Residents.Deaths": "res_deaths",
  "Residents.Recovered": "res_recovered",
  "Residents.Negative": "res_negative",
  "Residents.Pending": "res_pending",
  "Residents.Population": "res_population",
  "Residents.Quarantine": "res_quarantine",
  "Staff.Confirmed": "stf_confirmed",
  "Staff.Tested": "stf_tested",
  "Staff.Deaths": "stf_deaths",
  "Staff.Recovered": "stf_recovered",
  "Staff.Negative": "stf_negative",
  "Staff.Pending": "stf_pending",
  "Staff.Population": "stf_population",
  "Staff.Quarantine": "stf_quarantine",
};

export const STATE_LEVEL_TOTALS = [
  "res_confirmed",
  "res_tested",
  "res_deaths",
  "res_recovered",
  "res_negative",
  "res_pending",
  "res_population",
  "res_quarantine",
  "stf_confirmed",
  "stf_tested",
  "stf_deaths",
  "stf_recovered",
  "stf_negative",
  "stf_pending",
  "stf_population",
  "stf_quarantine",
];

// {{TERM}} is unavailable for 12 facilities
export const UNAVAILABLE_LANG = {
  res_confirmed: "Confirmed cases among residents",
  res_tested: "Number of tested residents",
  res_deaths: "Number of COVID-19 related deaths among residents",
  res_recovered: "Number of residents recovered",
  res_negative: "Number of negative test results among residents",
  res_pending: "Number of pending tests among residents",
  res_population: "Resident population",
  res_quarantine: "Number of residents in quarantine",
  stf_confirmed: "Confirmed cases among staff",
  stf_tested: "Number of tested staff",
  stf_deaths: "Number of COVID-19 related deaths among staff",
  stf_recovered: "Number of staff recovered",
  stf_negative: "Number of negative test results among staff",
  stf_pending: "Number of pending tests among staff",
  stf_population: "Staff population",
  stf_quarantine: "Number of staff in quarantine",
};

export const UPPER_CASE = [
  "fci",
  "usp",
  "ccw",
  "cw",
  "cc",
  "ci",
  "cf",
  "col",
  "atc",
  "mcc",
  "pdc",
  "mci",
  "smcc",
  "mdc",
  "crv",
  "iwp",
  "sbwc",
  "fmc",
  "li",
];

export const VALUE_RANGES = {
  res_confirmed: [1, 1000],
};
