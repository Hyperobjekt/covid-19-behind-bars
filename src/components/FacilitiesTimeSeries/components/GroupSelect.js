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

const GroupSelect = ({ ...props }) => {
  const classes = useStyles();

  const [setSelectedGroup, selectedGroup] = useTimeSeriesStore(
    (state) => [state.setSelectedGroup, state.selectedGroup],
    shallow
  );

  return (
    <>
      <GenericSelection
        options={GROUPS}
        selectedOption={selectedGroup}
        handleSelect={setSelectedGroup}
      />
      <br />
    </>
  );
};

export default GroupSelect;
