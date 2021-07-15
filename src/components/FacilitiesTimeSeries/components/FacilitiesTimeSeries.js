import React from "react";
import { getLang } from "../../../common/utils/i18n";
import { Block } from "@hyperobjekt/material-ui-website";
import FacilitySelect from "./FacilitySelect";
import TimeSeriesChart from "./TimeSeriesChart";
import MetricSelect from "./MetricSelect";
import GroupSelect from "./GroupSelect";
import clsx from "clsx";
import { fade, makeStyles, Typography } from "@material-ui/core";
import { serifTypography } from "../../../gatsby-theme-hypercore/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 0,
    "& > .MuiButtonBase-root": {
      ...serifTypography,
      fontWeight: 700,
      fontSize: theme.typography.pxToRem(26),
      color: theme.palette.secondary.main,
      textTransform: "lowercase",
      border: `2px dotted transparent`,
      borderBottomColor: fade(theme.palette.text.secondary, 0.333),
      borderRadius: 5,
      position: "relative",
      top: "-0.15rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(23),
      lineHeight: theme.typography.pxToRem(30),
    },
  },
}));

const FacilitiesTimeSeries = ({ title, ...props }) => {
  const classes = useStyles();

  const selectArr = [
    <MetricSelect />,
    <GroupSelect />,
    <FacilitySelect defaultFacilities={["2336", "45", "92"]} />,
  ];
  const titleArr = title
    .split(/\${metric}|\${locations}|\${group}/)
    .slice(0, 3);

  return (
    <Block>
      <Typography className={clsx(classes.root)} variant="h3" {...props}>
        {titleArr.map((t, i) => (
          <React.Fragment key={i}>
            {t}
            {selectArr[i]}
          </React.Fragment>
        ))}
      </Typography>
      <TimeSeriesChart />
    </Block>
  );
};

export default FacilitiesTimeSeries;
