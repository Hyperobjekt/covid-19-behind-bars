import React, { memo, useCallback, useMemo } from "react"
import MarkerLayer from "./MarkerLayer"
import { useOptionsStore, useMappableFacilities } from "../../../common/hooks"
import shallow from "zustand/shallow"
import { typeSelector, getDataMetricSelector } from "../../../common/utils"

const FacilitiesMarkerLayer = memo(
  ({ filter, group = "residents", ...props }) => {
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
    const facilities = useMappableFacilities()

    const mapFacilities = useMemo(
      () => (filter ? facilities.filter(filter) : facilities),
      [filter, facilities]
    )

    const isDots = props.type && props.type === "dots"
    const size = isDots ? 3.5 : [0, 200]
    const colors = isDots ? categoryColors : categoryGradients
    const dataSelector = useCallback(getDataMetricSelector(metric, group), [
      metric,
      group,
    ])
    return (
      <MarkerLayer
        markers={mapFacilities}
        size={size}
        width={7}
        color={colors}
        stroke={categoryColors}
        groups={categories}
        groupSelector={typeSelector}
        sizeSelector={dataSelector}
        {...props}
      />
    )
  }
)

export default FacilitiesMarkerLayer
