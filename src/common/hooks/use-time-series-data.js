import { csv } from "d3-fetch";
import { useCallback, useMemo } from "react";
import shallow from "zustand/shallow";
import useTimeSeriesStore from "../../components/FacilitiesTimeSeries/useTimeSeriesStore";
import { getSlug } from "../utils/selectors";

// TODO: confirm staff metrics
const groupMetrics = {
  residents: ["confirmed", "deaths", "active", "tested"],
  staff: ["confirmed", "deaths", "active", "tested"],
};

const parseTimeSeries = (timeSeries = {}) => {
  const result = {
    id: timeSeries.id,
    name: timeSeries.name,
    state: timeSeries.state,
  };

  ["residents", "staff"].forEach((grp) => {
    const metrics = groupMetrics[grp];

    metrics.forEach((metric) => {
      const accessor = grp + "_" + metric;
      const rateAccessor = accessor + "_rate";

      [accessor, rateAccessor].forEach((acc) => {
        const dataString = timeSeries[acc];

        result[acc] = !dataString
          ? []
          : dataString.split(";").map((keyValStr) => {
              const [date, value] = keyValStr.split("|");
              return { date, value };
            });
      });
    });
  });

  return result;
};

export default function useTimeSeriesData() {
  const [selectedFacilities, loadedStateDataMap, loadedStates, setLoaded] =
    useTimeSeriesStore(
      (state) => [
        state.selectedFacilities,
        state.loadedStateDataMap,
        state.loadedStates,
        state.setLoaded,
      ],
      shallow
    );

  /** Returns data for selectedFacilities, and loads the data if unavailable */
  return useMemo(() => {

    const loadStateData = (state) => {
      if (loadedStateDataMap[state]) return;
      csv(`./data/${getSlug(state)}.csv`, parseTimeSeries)
        .then((d) => {
          const newStateDataMap = {
            ...loadedStateDataMap,
            [state]: d,
          };
          // console.log(`DATA LOADED FOR ${state}`);
          setLoaded(state, newStateDataMap);
        })
        .catch((err) => {
          console.error(`
  Failed to load ${state} time series data due to: ${"err"}.
  Make sure you have run 'yarn prebuild' to generate time series CSV data in static/data.
          `);
        });
      };

      // map selected facilities to the parsed data in `loadedStateMap`
      return selectedFacilities
        .map(({ state, name, id }) => {
          // check for loaded data
          if (!loadedStateDataMap[state]) {
            loadStateData(state);
            return null; // null value while data is loading
          }
          return loadedStateDataMap[state].find((fac) => fac.id === id);
        })
        .filter(Boolean); // remove null values that are loading
      
    }, [selectedFacilities, loadedStateDataMap, setLoaded]);
  }
  