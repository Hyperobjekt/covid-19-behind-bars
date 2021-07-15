import create from "zustand";
import { METRICS, GROUPS } from "../../common/constants";

// grab first group (residents)
const group = GROUPS[0];
const metric = METRICS[group][0];

const useTimeSeriesStore = create((set, get) => ({
  selectedMetric: metric,
  setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
  selectedGroup: group,
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  selectedFacilities: [],
  setSelectedFacilities: (selectedFacilities) => set({ selectedFacilities }),

  loadedStates: [],
  loadedStateDataMap: {},
  // loadedStates is simply the keys of loadedStateDataMap, useful to ensure an easy diff
  setLoaded: (state, loadedStateDataMap) =>
    set({
      loadedStates: [...get().loadedStates, state],
      loadedStateDataMap,
    }),
}));

export default useTimeSeriesStore;
