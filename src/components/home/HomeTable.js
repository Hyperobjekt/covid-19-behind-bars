import React from "react";
import { Table } from "../table";
import { Typography, withStyles, Tooltip } from "@material-ui/core";
import { useFacilitiesData, useOptionsStore } from "../../common/hooks";
import { Block } from "@hyperobjekt/material-ui-website";
import slugify from "slugify";
import { getColorForJurisdiction } from "../../common/utils/selectors";
import shallow from "zustand/shallow";
import { getLang } from "../../common/utils/i18n";
import JurisdictionToggles from "../controls/JurisdictionToggles";
import DotMarker from "../markers/DotMarker";
import MetricSelectionTitle from "../controls/MetricSelectionTitle";

import clsx from "clsx";
import { Link } from "gatsby-theme-material-ui";
import NotesModal from "../NotesModal";
import { countFormatter, rateFormatter, rateSorter } from "../table/utils";
const MAX_FACILITY_LENGTH = 24;

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  toggleContainer: {
    margin: theme.spacing(2, 0, 1, -0.75),
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(0, 0, 0, -0.75),
    },
  },
  name: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 600,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    width: "100%",
  },
  state: {
    "&.MuiLink-root.MuiTypography-root": {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
    },
  },
  table: {
    "& tr:hover $state": {
      textDecoration: "underline",
      textDecorationThickness: "1px",
      cursor: "pointer",
      "&:hover": {
        textDecorationColor: theme.palette.secondary.main,
      },
    },
  },
  notes: {
    listStyle: "none",
    margin: theme.spacing(2, "auto"),
    maxWidth: "24rem",
    "& li": {
      maxWidth: "24rem",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "space-around",
      maxWidth: "none",
      "& li + li": {
        marginTop: 0,
      },
    },
  },
});

const HomeTable = ({
  title,
  note,
  classes,
  categories,
  selectedRegion,
  isImmigration,
  ...props
}) => {
  // pull active metric from the store, with setter
  const [metric, setMetric] = useOptionsStore(
    (state) => [state.metric, state.setMetric],
    shallow
  );

  // data for table
  const data = useFacilitiesData(categories, selectedRegion);

  // styles for number columns in table
  const numberColStyle = React.useMemo(
    () => ({
      width: "10%",
      minWidth: "7rem",
      textAlign: "right",
    }),

    []
  );

  // column configuration for the table
  const columns = React.useMemo(() => {
    const facilityCol = {
      Header: "Facility",
      id: "name",
      accessor: "name",
      Cell: (prop) => {
        const { state, jurisdiction, name } = prop.row.original;
        let entity = state;
        let link = `/states/${slugify(state, { lower: true })}`;

        if (name.toLowerCase().startsWith("all ice")) {
          entity = "ICE Detention";
          link = "/ice";
        } else if (name.toLowerCase().startsWith("all bop")) {
          entity = "Federal Bureau of Prisons";
          link = "/federal";
        }
        const facility = (
          <Typography
            title={prop.value}
            className={classes.name}
            variant="body1"
          >
            {prop.value.length > MAX_FACILITY_LENGTH
              ? prop.value.substring(0, MAX_FACILITY_LENGTH) + "..."
              : prop.value}
          </Typography>
        );
        const rowName =
          prop.value.length > MAX_FACILITY_LENGTH ? (
            <Tooltip title={prop.value} arrow placement="top">
              {facility}
            </Tooltip>
          ) : (
            facility
          );
        return (
          <>
            {rowName}
            <Typography variant="body2" color="textSecondary">
              <Link to={link} className={classes.state}>
                {entity}
              </Link>
              <DotMarker
                radius={4}
                fill={getColorForJurisdiction(jurisdiction)}
              />
            </Typography>
          </>
        );
      },
      style: {
        maxWidth: "10.5rem",
      },
    };

    const colMetrics = isImmigration
      ? [
          "confirmed",
          "confirmed_rate",
          "active",
          "active_rate",
          "deaths",
          "deaths_rate",
        ]
      : [
          "confirmed",
          "confirmed_rate",
          "active",
          "active_rate",
          "deaths",
          "deaths_rate",
          "tested",
          "tested_rate",
        ];

    const cols = colMetrics.map((colMetric) => {
      const col = {
        id: colMetric,
        Header: getLang(colMetric),
        accessor: `residents.${colMetric}`,
        Cell: (prop) => countFormatter(prop.value),
        style: numberColStyle,
      };

      const isRate = colMetric.indexOf("_rate") > 0;
      if (isRate) {
        col.sortType = rateSorter;
        col.Cell = (prop) => rateFormatter(prop.value);
      }

      return col;
    });

    return [facilityCol, ...cols];
  }, [classes.name, classes.state, isImmigration, numberColStyle]);

  const [sortCol, setSortCol] = React.useState(metric);
  const [sortedByMetric, setSortedByMetric] = React.useState(true);
  const [sortDesc, setSortDesc] = React.useState(true);

  // memoized table options
  const options = React.useMemo(
    () => ({
      initialState: {
        pageSize: 5,
        sortBy: [{ id: sortCol, desc: sortDesc }],
      },
    }),
    [sortDesc, sortCol]
  );

  // handler for when table headers are clicked
  const handleSortChange = React.useCallback(
    (sortBy) => {
      const isMetric = sortBy !== "name";
      setSortedByMetric(isMetric);
      setSortCol(sortBy);
      if (!isMetric) {
        setSortDesc(!sortDesc);
        return;
      }
      const newMetric = sortBy;
      metric !== newMetric && setMetric(newMetric);
      setSortDesc(true);
    },
    [metric, setMetric, sortDesc]
  );

  // if user selects metric via dropdown, update sort col
  React.useEffect(() => {
    setSortCol(metric);
    setSortedByMetric(true);
  }, [metric]);

  // otherwise column won't update if table sorted by name and active metric is (re)selected
  const handleSelection = (metric) => {
    setSortedByMetric(true);
    setSortCol(metric);
  };

  return (
    <Block className={clsx(classes.root, "home-table")} {...props}>
      <MetricSelectionTitle
        title={sortedByMetric ? title : "Facilities by ${metric}"}
        isImmigration={isImmigration}
        handleSelection={handleSelection}
        forceSelectedOption={!sortedByMetric && sortCol}
      />
      <Table
        className={classes.table}
        data={data.filter((d) => d.name !== "Statewide")}
        columns={columns}
        options={options}
        // sortColumn={sortCol}
        // sortDesc={sortedByMetric}
        onSort={handleSortChange}
      >
        <JurisdictionToggles
          marker="dot"
          horizontal="md"
          classes={{ root: classes.toggleContainer }}
        />
      </Table>
      {note && note.length > 0 && <NotesModal notes={note} />}
    </Block>
  );
};

export default withStyles(styles)(HomeTable);
