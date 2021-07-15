import React, { useEffect } from "react";
import clsx from "clsx";
import MaUTable from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableToolbar from "./TableToolbar";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { withStyles } from "@material-ui/core";
import { sansSerifyTypography } from "../../gatsby-theme-hypercore/theme";

const styles = (theme) => ({
  table: {
    "& .MuiTableCell-root": {
      ...sansSerifyTypography,
    },
    "& .MuiTableBody-root .MuiTableRow-root:hover": {
      background: theme.palette.background.default,
    },
    "& .MuiTableRow-root.row--action:hover": {
      background: "rgba(0,0,0,0.02)",
      "& .MuiTableCell-body.tableCell--active": {
        background: "rgba(0,0,0,0)",
      },
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
      padding: 0,
      "&.tableCell--active": {
        boxShadow: `inset 0 -4px ${theme.palette.secondary.main}`,
        background: theme.palette.background.default,
      },
    },
    // right align columns
    "& .MuiTableCell-head .MuiTableSortLabel-root": {
      width: "100%",
      height: "100%",
      textAlign: "right",
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "row-reverse",
    },
    // left align first column
    "& .MuiTableCell-head:first-child .MuiTableSortLabel-root": {
      flexDirection: "row",
    },
    "& .MuiTableSortLabel-icon": {
      fontSize: 16,
      fill: theme.palette.secondary.main,
    },
    // align first column left, all others right
    "& .MuiTableCell-body": {
      textAlign: "right",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "7rem",
      whiteSpace: "nowrap",
      "&:first-child": {
        textAlign: "left",
        maxWidth: "14.5rem",
      },
    },
    "& .MuiTableCell-body.tableCell--active": {
      background: theme.palette.background.default,
    },
    "& .MuiTablePagination-spacer": {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
    // darker underline on links in tables
    "& .MuiLink-underlineHover": {
      textDecorationColor: `rgba(85, 85, 38, 0.3)`,
    },
  },
  toolbar: {},
});

const Table = ({
  columns,
  data,
  skipPageReset = false,
  onSort,
  onRowClick,
  onChangePage,
  onChangeRowsPerPage,
  sortColumn,
  sortDesc = true,
  topLevelHeaders = [],
  options,
  classes,
  className,
  children,
  disableFilter,
  disableFooter,
  ...props
}) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    rows,
    setGlobalFilter,
    toggleSortBy,
    state: { pageIndex, pageSize, globalFilter, sortBy },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      ...options,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (sortColumn) {
      const { id, desc } = sortBy[0];
      if (id !== sortColumn || desc !== sortDesc) {
        toggleSortBy(sortColumn, sortDesc);
      }
    }
  }, [sortColumn, toggleSortBy, sortBy, sortDesc]);

  const [filtered, setFiltered] = React.useState(globalFilter);

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
    if (onChangePage) {
      onChangePage(newPage);
    }

    // globalFilter value resets on page change
    setGlobalFilter(filtered);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(Number(event.target.value));
    }
  };

  const handleSetGlobalFilter = (value) => {
    // eg true if user is deleting letters from search term
    const lessRestrictiveFilter =
      !value || (filtered && filtered.includes(value));

    if (!lessRestrictiveFilter) {
      // so we don't stay on a page that no longer exists
      gotoPage(0);
      if (onChangePage) {
        onChangePage(0);
      }
    }

    setGlobalFilter(value);
    setFiltered(value);
  };

  // keep globalFilter in sync with filtered
  // (eg preserves filter state if element is scrolled off-screen)
  useEffect(() => {
    if (globalFilter !== filtered) {
      setGlobalFilter(filtered);
    }
  }, [globalFilter, filtered]);

  return (
    <>
      {!disableFilter && (
        <TableToolbar
          className={classes.toolbar}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={handleSetGlobalFilter}
          globalFilter={globalFilter}
        >
          {children}
        </TableToolbar>
      )}
      <TableContainer className={clsx(classes.table, className)} {...props}>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {!!topLevelHeaders.length && (
              <TableRow>
                {topLevelHeaders.map(({ colSpan, align, text }, i) => (
                  <TableCell key={i} align={align} colSpan={colSpan}>
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            )}
            {headerGroups.map((headerGroup) => {
              return (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    const sortProps = column.getSortByToggleProps();
                    return (
                      <TableCell
                        {...column.getHeaderProps({
                          onClick: () => onSort && onSort(column.id),
                          className: clsx(column.className, {
                            "tableCell--active": column.isSorted,
                          }),
                          style: { ...column.style, ...sortProps.style },
                        })}
                        variant="head"
                      >
                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={
                            !column.isSorted || column.isSortedDesc
                              ? "desc"
                              : "asc"
                          }
                        >
                          {column.render("Header")}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps({
                    onClick: (event) => onRowClick && onRowClick(row, event),
                    style: { cursor: onRowClick ? "pointer" : undefined },
                    className: onRowClick && "row--action",
                  })}
                >
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps([
                          {
                            className: clsx(cell.column.className, {
                              "tableCell--active": cell.column.isSorted,
                            }),
                            style: cell.column.style,
                          },
                        ])}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>

          {!disableFooter && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    { label: "All", value: data.length },
                  ]}
                  colSpan={columns.length}
                  count={rows.length}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </MaUTable>
      </TableContainer>
    </>
  );
};

Table.defaultProps = {
  options: {},
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool,
};

export default withStyles(styles)(Table);
