import React, { memo, useCallback } from "react"
import MarkerLayer from "./MarkerLayer"
import { useOptionsStore } from "../../../common/hooks"
import shallow from "zustand/shallow"
import {
  typeSelector,
  getDataMetricSelector,
  getComparator,
} from "../../../common/utils"

const FacilitiesMarkerLayer = memo(
  ({ facilities, group = "residents", ...props }) => {
    const [
      metric,
      categories,
      categoryColors,
      categoryGradients,
    ] = useOptionsStore(
      (state) => [
        state.metric,
        state.categories,
        state.categoryColors,
        state.categoryGradients,
      ],
      shallow
    )

    const isDots = props.type && props.type === "dots"
    const size = isDots ? 3.5 : [0, 200]
    const colors = isDots ? categoryColors : categoryGradients
    const dataSelector = useCallback(getDataMetricSelector(metric, group), [
      metric,
      group,
    ])

    // fixes #75c - put smaller spikes on "top" so they're accessible
    const sortedFacilities = facilities
      .sort(getComparator(dataSelector))
      .reverse()
    return (
      <>
        <MarkerLayer
          markers={sortedFacilities}
          size={size}
          width={7}
          color={colors}
          stroke={categoryColors}
          groups={categories}
          groupSelector={typeSelector}
          sizeSelector={dataSelector}
          {...props}
        />
      </>
    )
  }
)

export default FacilitiesMarkerLayer
