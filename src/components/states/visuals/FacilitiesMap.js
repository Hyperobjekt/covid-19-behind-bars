import React, { useMemo } from "react";
import shallow from "zustand/shallow";
import { MapGradients, MapLegend, StateMap } from "../../maps";
import FacilitiesMarkerLayer from "../../maps/MarkerLayer/FacilitiesMarkerLayer";
import { animated } from "react-spring";
import useStatesStore from "../useStatesStore";
import { useActiveMetric, useMappableFacilities } from "../../../common/hooks";
import { Typography, withStyles } from "@material-ui/core";
import Stack from "../../Stack";
import { getLang } from "../../../common/utils/i18n";
import FacilitiesMapTooltip from "./FacilitiesMapTooltip";

const styles = (theme) => ({
  contentContainer: {
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
      flexDirection: "row",
      position: "absolute",
      bottom: theme.spacing(3),
      left: theme.spacing(1),
      right: 0,
    },
  },
  legend: {
    margin: 0,
  },
  description: {
    maxWidth: "12.5rem",
    marginTop: "1rem",
    fontSize: theme.typography.pxToRem(12),
    opacity: 0.75,
  },
});

const FacilitiesMap = ({ classes, ...props }) => {
  // current step that is scrolled in view
  const [currentStep, stateName, facilitiesGroup, content] = useStatesStore(
    (state) => [
      state.currentStep,
      state.stateName,
      state.facilitiesGroup,
      state.content,
    ],
    shallow
  );

  // currently selected metric
  const metric = useActiveMetric();

  // pull data for mappable facilities
  const data = useMappableFacilities();

  // memoize facilities for the state
  const facilities = useMemo(
    () => data.filter((f) => f.state === stateName),
    [data, stateName]
  );

  // map group based on step
  const mapGroup = (() => {
    if (currentStep === "staff") return "staff";
    if (currentStep === "facilities") return facilitiesGroup;
    return "residents";
  })();

  /* eslint-disable no-template-curly-in-string */
  const mapDescription = content.map.description
    .replace("${metric}", getLang(metric).toLowerCase())
    .replace("${group}", getLang(mapGroup).toLowerCase())
    .replace("${count}", facilities.length);
  /* eslint-enable no-template-curly-in-string */

  return (
    <animated.div {...props}>
      <StateMap height={800} width={700} stateName={stateName}>
        <MapGradients />
        <FacilitiesMarkerLayer
          facilities={facilities}
          group={mapGroup}
          metric={metric}
        />
      </StateMap>
      <FacilitiesMapTooltip group={mapGroup} metric={metric} />
      <Stack className={classes.contentContainer} horizontal="md" spacing={3}>
        <MapLegend className={classes.legend} data={facilities} />
        <Typography className={classes.description} variant="body2">
          {mapDescription}
        </Typography>
      </Stack>
    </animated.div>
  );
};

FacilitiesMap.propTypes = {};

export default withStyles(styles)(FacilitiesMap);
