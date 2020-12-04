import React from "react"
import clsx from "clsx"
import { Marker } from "react-simple-maps"
import Spike from "../../markers/spike"
import Dot from "../../markers/dot"

import { withStyles } from "@material-ui/core"
import { extent } from "d3-array"
import { getScalerFunction, getValue, getColorFunction } from "../selectors"

export const styles = {
  highlight: {
    strokeWidth: 2,
  },
  text: {
    textAnchor: "middle",
  },
  spike: {},
}

// TODO: make dots more configurable
const MarkerLayer = ({
  markers,
  type = "spikes",
  size: sizeValue = 10,
  sizeExtent: overrideSizeExtent,
  color: colorValue = "#666",
  label: labelValue = false,
  stroke: strokeValue = "#666",
  highlight: highlightValue = false,
  width: widthValue = 7,
  widthExtent: overrideWidthExtent,
  groups,
  classes,
  className,
  sizeSelector,
  groupSelector,
  widthSelector,
  children,
  ...props
}) => {
  // spike length calculation
  const sizeExtent = overrideSizeExtent || extent(markers, sizeSelector)
  const getMarkerSize = getScalerFunction(sizeValue, sizeExtent, sizeSelector)
  const getCircleOpacity = getScalerFunction(
    [0, 0.1, 1],
    [0, 1, sizeExtent[1]],
    sizeSelector
  )

  // spike width calculation
  const widthExtent = overrideWidthExtent || extent(markers, widthSelector)
  const getSpikeWidth = getScalerFunction(
    widthValue,
    widthExtent,
    widthSelector
  )

  // create fill color function (or value)
  const getColor = getColorFunction(colorValue, groups, groupSelector)

  // create stroke function (or value)
  const getStroke = getColorFunction(strokeValue, groups, groupSelector)

  return (
    <g className={clsx("spike-layer", classes.root, className)} {...props}>
      {markers.map((marker, i) => {
        const size = getValue(getMarkerSize, marker)
        const width = getValue(getSpikeWidth, marker)
        const color = getValue(getColor, marker)
        const stroke = getValue(getStroke, marker)
        const label = getValue(labelValue, marker)
        const highlight = getValue(highlightValue, marker)
        const coords = marker.coords
        return (
          <Marker
            key={marker.id}
            coordinates={coords}
            className={classes.marker}
          >
            {type === "dots" && (
              <Dot
                radius={size}
                stroke={stroke}
                fill={color}
                fillOpacity={getValue(getCircleOpacity, marker)}
              />
            )}
            {type === "spikes" && (
              <Spike
                fill={color}
                stroke={stroke}
                length={size}
                width={width}
                className={clsx(classes.spike, {
                  [classes.highlight]: highlight,
                })}
              />
            )}
            {label && <text className={classes.text}>{label}</text>}
          </Marker>
        )
      })}
      {children}
    </g>
  )
}

MarkerLayer.propTypes = {}

export default withStyles(styles)(MarkerLayer)
