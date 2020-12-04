import React from "react"
import { Table } from "../table"
import { format } from "d3-format"
import { Typography, withStyles } from "@material-ui/core"
import { useMappableFacilities, useOptionsStore } from "../../common/hooks"
import { Block } from "gatsby-theme-hyperobjekt-core"
import {
  sansSerifyTypography,
  titleTypography,
} from "../../gatsby-theme-hyperobjekt-core/theme"
import ResponsiveContainer from "../responsive-container"
import { isNumber } from "../../common/utils/selectors"
import shallow from "zustand/shallow"
import { getLang } from "../../common/utils/i18n"

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
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 600,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: 224,
    [theme.breakpoints.up(1440)]: {
      maxWidth: 320,
    },
  },
  table: {
    "& .MuiTableCell-root": {
      ...sansSerifyTypography,
    },
    "& .MuiTypography-root": {
      ...sansSerifyTypography,
    },
    "& .MuiTableCell-head": {
      position: "relative",
      ...sansSerifyTypography,
      fontWeight: 700,
      lineHeight: 1.2,
      overflow: "hidden",
    },
    "& .MuiTableCell-head .MuiTableSortLabel-root": {
      position: "absolute",
      right: 0,
      transform: `translateX(4px)`,
      top: 0,
      bottom: 0,
    },
    "& .MuiTableSortLabel-icon": {
      fontSize: 12,
    },
    "& .MuiTablePagination-spacer": {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
  },
})

const intFormatter = format(",d")
const perFormatter = format(".0%")

const countFormatter = (value) =>
  !isNumber(value) ? "--" : intFormatter(value)

const rateFormatter = (value) => (!isNumber(value) ? "--" : perFormatter(value))

const HomeTable = ({ classes, ...props }) => {
  const [metric, setMetric] = useOptionsStore(
    (state) => [state.metric, state.setMetric],
    shallow
  )
  const data = useMappableFacilities()
  const columns = React.useMemo(
    () => [
      {
        Header: "Facility",
        accessor: "name",
        Cell: (prop) => {
          return (
            <>
              <Typography className={classes.name} variant="body1">
                {prop.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {prop.row.original.state}
              </Typography>
            </>
          )
        },
        style: {
          minWidth: 224,
        },
      },
      {
        id: "confirmed",
        Header: getLang("confirmed"),
        accessor: "residents.confirmed",
        Cell: (prop) => countFormatter(prop.value),
        style: {
          width: 136,
          maxWidth: 136,
          textAlign: "right",
        },
      },
      {
        id: "confirmed_rate",
        Header: getLang("confirmed_rate"),
        accessor: "residents.confirmed_rate",
        Cell: (prop) => rateFormatter(prop.value),
        style: {
          width: 158,
          maxWidth: 158,
          textAlign: "right",
        },
      },
      {
        id: "active",
        Header: getLang("active"),
        accessor: "residents.active",
        Cell: (prop) => countFormatter(prop.value),
        style: {
          width: 136,
          maxWidth: 136,
          textAlign: "right",
        },
      },
      {
        id: "active_rate",
        Header: getLang("active_rate"),
        accessor: "residents.active_rate",
        Cell: (prop) => rateFormatter(prop.value),
        style: {
          width: 156,
          maxWidth: 156,
          textAlign: "right",
        },
      },
      {
        id: "deaths",
        Header: getLang("deaths"),
        accessor: "residents.deaths",
        Cell: (prop) => countFormatter(prop.value),
        style: {
          width: 120,
          maxWidth: 120,
          textAlign: "right",
        },
      },
      {
        id: "deaths_rate",
        Header: getLang("deaths_rate"),
        accessor: "residents.deaths_rate",
        Cell: (prop) => rateFormatter(prop.value),
        style: {
          width: 156,
          maxWidth: 156,
          textAlign: "right",
        },
      },
    ],
    [classes.name]
  )
  const options = React.useMemo(
    () => ({
      initialState: {
        pageSize: 5,
        sortBy: [{ id: metric, desc: true }],
      },
    }),
    []
  )
  return (
    <Block type="fullWidth" className={classes.root}>
      <ResponsiveContainer>
        <Typography className={classes.title} variant="h3">
          Facilities with the <span>highest</span> {getLang(metric)}
        </Typography>
        <Table
          className={classes.table}
          data={data}
          columns={columns}
          options={options}
        ></Table>
      </ResponsiveContainer>
    </Block>
  )
}

HomeTable.propTypes = {}

export default withStyles(styles)(HomeTable)
