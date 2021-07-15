import React from "react";
import { useVaccineData } from "../../common/hooks";
import { Block } from "@hyperobjekt/material-ui-website";
import { getSlug, isNumber } from "../../common/utils/selectors";
import { Link } from "gatsby-theme-material-ui";
import { DefaultTable } from "../table";
import { Typography, withStyles } from "@material-ui/core";
import { formatMetricValue } from "../../common/utils/formatters";
import FlagIcon from "../../../content/assets/flag-icon.svg";
import IconWithTooltip from "../IconWithTooltip";
import NotesModal from "../NotesModal";

const alphaStateSort = (a, b) => {
  // Total row goes first
  if (a.original.isTotal) return 1;
  if (b.original.isTotal) return -1;

  // non-state rows (federal, ice) go above states
  if (a.original.isState !== b.original.isState) {
    return a.original.isState ? -1 : 1;
  }

  return a.original.jurisdiction > b.original.jurisdiction ? -1 : 1;
};

const rateSorter = (a, b, columnId) => {
  if (a.original.isTotal) return 1;
  if (b.original.isTotal) return -1;

  const [group, metric] = columnId.split("-");
  const [aVal, bVal] = [a, b].map((v) => v.original[group][metric]);
  if (isNumber(aVal) && !isNumber(bVal)) return 1;
  if (!isNumber(aVal) && isNumber(bVal)) return -1;
  if (!isNumber(aVal) && !isNumber(bVal)) return 0;
  return aVal - bVal;
};

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,

    "& .notes-modal": {
      margin: theme.spacing(3, 0, 2),
    },
  },
  wrapper: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  content: {
    maxWidth: "32rem",
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(5),
    },
  },
  body: {
    margin: theme.spacing(2, 0),
  },
  jurisdictionLink: {
    "&.MuiLink-root.MuiTypography-root": {
      color: theme.palette.text.secondary,
    },
  },
  tableWrapper: {
    flex: 1,
    maxWidth: theme.spacing(69),
  },
  table: {
    "& tr:hover $jurisdictionLink": {
      textDecoration: "underline",
      textDecorationThickness: "1px",
      cursor: "pointer",
      "&:hover": {
        textDecorationColor: theme.palette.secondary.main,
      },
    },
    "& .icon-with-tooltip": {
      display: "inline-block",
    },
    "& .icon-wrapper": {
      margin: theme.spacing(0, 0, 0, 1),
      padding: 0,
    },
  },
});

// const intFormatter = format(",d");

const perFormatter = (v) => formatMetricValue(v, "home_table_rate");
// const countFormatter = (value) =>
//   !isNumber(value) ? "--" : intFormatter(value);

const VaccineTable = ({
  title,
  subtitle,
  columnHeaders,
  note,
  flagNote,
  classes,
  ...props
}) => {
  // data for table
  const data = useVaccineData();

  // column configuration for the table
  const columns = React.useMemo(
    () => [
      {
        id: "jurisdiction",
        Header: columnHeaders["jurisdiction"],
        accessor: "jurisdiction",
        sortType: alphaStateSort,
        Cell: (prop) => {
          const { jurisdiction, isState, isFederal, isIce } = prop.row.original;
          let slug = null;
          if (jurisdiction && isState) {
            slug = `/states/${getSlug(jurisdiction)}`;
          } else if (isFederal) {
            slug = `/federal`;
          } else if (isIce) {
            slug = `/ice`;
          }
          const jurisdictionElement = slug ? (
            <Link to={slug} className={classes.jurisdictionLink}>
              {jurisdiction}
            </Link>
          ) : (
            jurisdiction
          );

          const ent = isFederal ? "federal" : jurisdiction.toLowerCase();
          const flagNoteDetails = flagNote.find(({ entity }) => entity === ent);

          const flagNoteElement = flagNoteDetails ? (
            <IconWithTooltip
              iconText={null}
              title={null}
              icon={FlagIcon}
              notes={[flagNoteDetails.text]}
            />
          ) : null;

          return (
            <Typography variant="body2" color="textSecondary">
              {jurisdictionElement}
              {flagNoteElement}
            </Typography>
          );
        },
        style: {
          width: "15rem",
        },
      },
      {
        id: "residents-percentInitiated",
        Header: columnHeaders["residents_rate"],
        accessor: "residents.percentInitiated",
        sortType: rateSorter,
        Cell: (prop) => perFormatter(prop.value),
        style: {
          minWidth: "11.5rem",
          textAlign: "right",
        },
      },
      {
        id: "staff-percentInitiated",
        Header: columnHeaders["staff_rate"],
        accessor: "staff.percentInitiated",
        sortType: rateSorter,
        Cell: (prop) => perFormatter(prop.value),
        style: {
          minWidth: "9rem",
          textAlign: "right",
        },
      },
    ],
    [classes.jurisdictionLink, columnHeaders, flagNote]
  );

  return (
    <Block className={classes.root} {...props}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <Typography variant="h3">{title}</Typography>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: subtitle }}
            className={classes.body}
          />
          <NotesModal disableNumbering notes={note} />
        </div>
        <div className={classes.tableWrapper}>
          <DefaultTable
            className={classes.table}
            data={data}
            columns={columns}
            startDesc={true}
            initialSortColumn={"jurisdiction"}
            disableFilter={true}
            // topLevelHeaders={topLevelHeaders}
          />
        </div>
      </div>
    </Block>
  );
};

export default withStyles(styles)(VaccineTable);
