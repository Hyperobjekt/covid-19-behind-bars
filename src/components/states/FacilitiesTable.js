import React from "react";
import { Table } from "../table";
import { Typography, withStyles } from "@material-ui/core";
import { titleTypography } from "../../gatsby-theme-hypercore/theme";
import { getLang } from "../../common/utils/i18n";
import { formatMetricValue } from "../../common/utils/formatters";
import useStatesStore from "./useStatesStore";
import { useActiveMetric, useFacilitiesData } from "../../common/hooks";
import shallow from "zustand/shallow";
import { GROUPS } from "../../common/constants";

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  title: {
    ...titleTypography,
    fontSize: theme.typography.pxToRem(38),
    maxWidth: "14em",
    marginTop: 0,
    "& span": {
      color: theme.palette.secondary.main,
    },
  },
  name: {
    width: "100%",
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  table: {
    "& .MuiTablePagination-input, & .MuiTablePagination-spacer + .MuiTablePagination-caption":
      {
        display: "none",
      },

    // take up entire width of "card"
    margin: theme.spacing(0, -3),
    width: `calc(100% + ${theme.spacing(6)})`,
    [theme.breakpoints.up("md")]: {
      margin: 0,
      width: "100%",
      "& tr .MuiTableCell-root:first-child,": {
        // so left side aligns with other elements
        paddingLeft: 0,
      },
    },
  },
});

const FacilitiesTable = ({ classes, filter, isFederal, ...props }) => {
  const setHoveredFacility = useStatesStore(
    (state) => state.setHoveredFacility
  );

  const all = useFacilitiesData();

  // currently selected metric
  const metric = useActiveMetric();

  // pull facilities group from the state page store
  const [facilitiesGroup, setFacilitiesGroup] = useStatesStore(
    (state) => [state.facilitiesGroup, state.setFacilitiesGroup],
    shallow
  );

  const [sortCol, setSortCol] = React.useState(facilitiesGroup);
  const [sortedByGroup, setSortedByGroup] = React.useState(true);
  const [sortDesc, setSortDesc] = React.useState(true);

  // get facilities for current state
  const facilities = filter ? all.filter(filter) : all;

  // handler for when table headers are clicked
  const handleFacilitiesGroupChange = React.useCallback(
    (col) => {
      const group = col.split(".")[0];
      const isGroup = group && GROUPS.indexOf(group) > -1;
      setSortedByGroup(isGroup);

      if (isGroup) {
        setSortCol(group);
        group === facilitiesGroup && setSortDesc(!sortDesc);
        group !== facilitiesGroup && setSortDesc(true); // default descending for groups
        group !== facilitiesGroup && setFacilitiesGroup(group);
      } else {
        col === sortCol && setSortDesc(!sortDesc);
        col !== sortCol && setSortDesc(false); // default ascending for non-group
        setSortCol(col);
      }
    },
    [facilitiesGroup, setFacilitiesGroup, sortDesc, sortCol]
  );

  const columns = React.useMemo(
    () => [
      {
        id: "name",
        Header: "Facility",
        accessor: "name",
        Cell: (prop) => {
          return (
            <>
              <Typography
                onMouseEnter={() => {
                  // console.log("Hovering in table: ", prop.cell.row.original)
                  setHoveredFacility(prop.cell.row.original);
                }}
                onMouseLeave={() => {
                  setHoveredFacility(null);
                }}
                className={classes.name}
                variant="body1"
                title={prop.value}
              >
                {prop.value}
              </Typography>
              {!isFederal && (
                <Typography variant="body2" color="textSecondary">
                  {getLang(prop.row.original.jurisdiction)}
                </Typography>
              )}
            </>
          );
        },
        style: {
          width: "50%",
          maxWidth: "12rem",
        },
      },
      {
        id: "residents." + metric,
        Header: getLang("residents"),
        accessor: "residents." + metric,
        Cell: (prop) => {
          return formatMetricValue(prop.value, metric);
        },
        style: {
          width: 136,
          maxWidth: 136,
          textAlign: "right",
        },
      },
      {
        id: "staff." + metric,
        Header: `${getLang("staff")}`,
        accessor: "staff." + metric,
        Cell: (prop) => {
          return formatMetricValue(prop.value, metric);
        },
        style: {
          width: 136,
          maxWidth: 136,
          textAlign: "right",
        },
      },
    ],
    [classes.name, metric, isFederal, setHoveredFacility]
  );

  const [pageIndex, setPageIndex] = React.useState(0);
  const changePageHandler = React.useCallback((idx) => {
    setPageIndex(idx);
  }, []);

  const options = React.useMemo(() => {
    const id = sortedByGroup ? facilitiesGroup + "." + metric : sortCol;
    return {
      initialState: {
        pageSize: 5,
        pageIndex,
        sortBy: [{ id, desc: sortDesc }],
      },
    };
  }, [metric, facilitiesGroup, sortCol, sortDesc, sortedByGroup, pageIndex]);

  return (
    <Table
      className={classes.table}
      columns={columns}
      options={options}
      onChangePage={changePageHandler}
      // fixes #45
      data={facilities}
      onSort={handleFacilitiesGroupChange}
    ></Table>
  );
};

FacilitiesTable.propTypes = {};

export default withStyles(styles)(FacilitiesTable);
