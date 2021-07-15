import React, { useContext } from "react";
import { Annotation, AnnotationLabel, DataContext } from "@visx/xychart";

const accessors = {
  xAccessor: (d) => new Date(`${d.date}T00:00:00`),
  yAccessor: (d) => Number(d.value),
};

function getLabelYValues(linesData, getYPosition, height) {
  return linesData.reduce((labelYValues, currSeries) => {
    const { lastDatum, id } = currSeries;
    const currMinY = Math.min(...labelYValues.map((v) => v.y)) || height;
    return [
      ...labelYValues,
      {
        id,
        y:
          lastDatum !== null
            ? Math.min(getYPosition(lastDatum), currMinY - 14)
            : 0,
      },
    ];
  }, []);
}

const TimeSeriesAnnotations = ({ linesData, facilitiesById }) => {
  const { width, height, margin, yScale } = useContext(DataContext);
  const getYPosition = (d) => yScale(accessors.yAccessor(d));
  const sortedLineData = linesData
    .slice(0)
    .sort((l, r) => getYPosition(r.lastDatum) - getYPosition(l.lastDatum));
  if (!yScale) return null;
  const seriesLabelYs = getLabelYValues(sortedLineData, getYPosition, height);

  return sortedLineData.map((lineData, i) => (
    <TimeSeriesAnnotation
      lineData={lineData}
      width={width}
      margin={margin}
      facility={facilitiesById[lineData.id]}
      y={seriesLabelYs[i].y}
      key={i}
    />
  ));
};

const TimeSeriesAnnotation = ({ lineData, facility, width, margin, y }) => {
  const { id, lastDatum } = lineData;
  const { truncatedLabel, color } = facility;

  return (
    lastDatum && (
      <Annotation dataKey={id} datum={lastDatum} dx={0} dy={0}>
        <AnnotationLabel
          title={truncatedLabel}
          titleProps={{
            textAnchor: "start",
            style: {
              fontSize: "11px",
              fontWeight: 300,
            },
          }}
          showAnchorLine={false}
          showBackground={false}
          horizontalAnchor="start"
          verticalAnchor="middle"
          width={margin.right}
          y={y - 2}
          x={width - margin.right + 15}
        />
        <AnnotationLabel
          title={"⬤"}
          y={y - 2}
          x={width - margin.right - 5}
          titleProps={{ color }}
          showAnchorLine={false}
          showBackground={false}
          fontColor={color}
          horizontalAnchor="start"
          verticalAnchor="middle"
        />
      </Annotation>
    )
  );
};

export default TimeSeriesAnnotations;
