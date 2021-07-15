import { JURISDICTIONS, JURISDICTION_COLORS, KEYS, METRICS } from "../constants"
import STATE_CENTERS from "../data/us_state_centers.json"

export const getUniqueValues = (nodes, selector) => {
  return nodes
    .map(selector)
    .reduce(
      (vals, curr) => (vals.indexOf(curr) > -1 ? vals : [...vals, curr]),
      []
    )
}

// selector for spike length
export const getDataMetricSelector = (metric, group = "residents") => {
  return (d) => d[group][metric]
}

// selector for spike color
export const typeSelector = (d) => d.jurisdiction

// selectory for spike width
export const widthSelector = (d) => d.residents.population

/**
 * Gets a comparator function for the given data selector
 */
export const getComparator = (dataSelector) => (a, b) => {
  const aVal = dataSelector(a)
  const bVal = dataSelector(b)
  if (!isNumber(aVal)) return -1
  if (!isNumber(bVal)) return 1
  if (aVal < bVal) return -1
  if (aVal > bVal) return 1
  return 0
}

/**
 * Gets the top values in the data set using a given data selector function
 * @param {*} data
 * @param {*} dataSelector
 * @param {*} top
 */
export const getTopValues = (data, dataSelector, top = 5) => {
  if (!data) return []
  const compare = getComparator(dataSelector)
  return data.sort(compare).reverse().slice(0, top)
}

/**
 * Returns a 2 letter state code, given the state name
 * @param {*} stateName
 */
export const getStateCodeByName = (stateName) => {
  const toLower = (v) => v.toLowerCase()
  return Object.keys(STATE_CENTERS).find(
    (key) =>
      toLower(STATE_CENTERS[key].State) === toLower(stateName) ||
      toLower(STATE_CENTERS[key].StateCode) === toLower(stateName)
  )
}

/**
 * Returns the state center data, given a state name or state code
 * @param {*} stateId
 */
export const getStateCenter = (stateId) => {
  const code = getStateCodeByName(stateId)
  if (code) return STATE_CENTERS[code]
  throw new Error(`State not found for provided code: ${code}`)
}

export const isNumber = (val) => {
  return (Boolean(val) || val === 0) && !isNaN(val) && val !== -999
}

export const getData = (data, ...keyTree) => {
  let d = data
  for (let i = 0; i < keyTree.length; i++) {
    const key = KEYS[keyTree[i]] || keyTree[i]
    if (d[key] || d[key] === 0) {
      if (i === keyTree.length - 1) {
        // last key in the tree, return the data
        return d[key]
      } else {
        // not at the end of the key tree yet, update data and loop again
        d = d[key]
      }
    } else {
      // no value for given key tree
      return null
    }
  }
}

/**
 * Returns the sum, avg, and the number of items with valid values for a given accessor
 * @param {object} data
 * @param {function} accessor
 * @returns {Array} [sum, avg, count]
 */
export const getSumAvgCount = (data, accessor) => {
  let count = 0
  const sum = data.reduce((value, current) => {
    const val =
      typeof accessor === "string" ? current[accessor] : accessor(current)
    if (isNumber(val)) {
      value += val
      count += 1
    }
    return value
  }, 0)
  const avg = sum / count
  return [count === 0 ? null : sum, isNumber(avg) ? avg : null, count]
}

/**
 * Groups the provided data by jurisdiction
 * @param {*} data
 */
export const getDataByJurisdiction = (data) => {
  // create object with data bt jurisdiction
  const jurData = JURISDICTIONS.reduce((obj, curr, i) => {
    obj[curr] = data.filter((d) => getData(d, "jurisdiction") === curr)
    return obj
  }, {})
  // get data groups (residents, staff)
  const groups = Object.keys(METRICS)
  // get group metrics by jurisdiction
  return groups.reduce((d, group) => {
    d[group] = METRICS[group].reduce((obj, metric) => {
      // add data for each jurisdiction
      JURISDICTIONS.forEach((j) => {
        const key = [j, metric].join("_")
        obj[key] = getSumAvgCount(jurData[j], (jd) =>
          getData(jd, group, metric)
        )
      })
      // add totals
      const key = ["total", metric].join("_")
      obj[key] = getSumAvgCount(data, (sd) => getData(sd, group, metric))
      return obj
    }, {})
    return d
  }, {})
}

export const getColorForJurisdiction = (jurisdiction) => {
  const index = JURISDICTIONS.findIndex((j) => j === jurisdiction)
  if (index > -1) return JURISDICTION_COLORS[index]
  throw new Error("no color for provided jurisdiction: " + jurisdiction)
}

// keep in line with slugify in utils.js
export const getSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}
