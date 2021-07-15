import React from "react";
import FacilitiesTable from "../FacilitiesTable";
import MetricSelectionTitle from "../../controls/MetricSelectionTitle";
import useStatesStore from "../useStatesStore";
import StepWrapper from "./../StepWrapper";

const Facilities = ({ id, lang, isFederal, ...props }) => {
  const stateName = useStatesStore((state) => state.stateName);

  // set appropriate filter for facilities
  const filter = isFederal
    ? (f) => f.jurisdiction === "federal" && f.name !== "Statewide"
    : (f) => f.state === stateName && f.name !== "Statewide";
  return (
    <div {...props}>
      <StepWrapper>
        <MetricSelectionTitle title={lang.title} />
        <FacilitiesTable lang={lang} isFederal={isFederal} filter={filter} />
      </StepWrapper>
    </div>
  );
};

Facilities.propTypes = {};

export default Facilities;
