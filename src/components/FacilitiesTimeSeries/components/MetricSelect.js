import React from "react";
import { makeStyles } from "@material-ui/core";
// import useFacilitiesMetadata from "../../../common/hooks/use-facilities-metadata";
import useTimeSeriesStore from "../useTimeSeriesStore";
import GenericSelection from "../../controls/GenericSelection";
import shallow from "zustand/shallow";
import { GROUPS, METRICS } from "../../../common/constants";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const MetricSelect = ({ ...props }) => {
  const classes = useStyles();

  const [setSelectedMetric, selectedMetric, selectedGroup] = useTimeSeriesStore(
    (state) => [
      state.setSelectedMetric,
      state.selectedMetric,
      state.selectedGroup,
    ],
    shallow
  );

  // TODO: which options should be available for staff?
  const options = METRICS[GROUPS[0]];

  return (
    <GenericSelection
      options={options}
      selectedOption={selectedMetric}
      handleSelect={setSelectedMetric}
    />
  );
};

export default MetricSelect;
