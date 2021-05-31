import React from "react"
import { withStyles } from "@material-ui/core"
import Table from "./Table"

const styles = (theme) => ({
  table: {
    // margin: theme.spacing(0, -3),
    // width: `calc(100% + ${theme.spacing(6)})`,
    // "& .MuiTablePagination-input, & .MuiTablePagination-spacer + .MuiTablePagination-caption": {
    //   display: "none",
    // },
  },
})

const DefaultTable = ({
  initialSortColumn,
  columns,
  startDesc = false,
  preventReverseSort = false,
  ...props
}) => {
  const firstCol = columns[0].accessor
  const [sortCol, setSortCol] = React.useState(initialSortColumn || firstCol)
  const [sortDesc, setSortDesc] = React.useState(startDesc)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)

  const options = React.useMemo(() => {
    return {
      sortDesc,
      initialState: {
        pageIndex,
        pageSize,
        sortBy: [{ id: sortCol, desc: sortDesc }],
      },
    }
  }, [sortCol, sortDesc, pageIndex, pageSize])

  const handleSortChange = React.useCallback(
    (sortBy) => {
      if (sortBy === sortCol) {
        if (!preventReverseSort) {
          setSortDesc(!sortDesc)
        }
      } else {
        setSortCol(sortBy)
      }
    },
    [sortCol, sortDesc]
  )

  const changePageHandler = React.useCallback((idx) => {
    setPageIndex(idx)
  }, [])
  const changeRowsPerPageHandler = React.useCallback((pages) => {
    setPageSize(pages)
  }, [])

  return (
    <Table
      columns={columns}
      options={options}
      sortColumn={sortCol}
      sortDesc={sortDesc}
      onSort={handleSortChange}
      onChangePage={changePageHandler}
      onChangeRowsPerPage={changeRowsPerPageHandler}
      {...props}
    ></Table>
  )
}

DefaultTable.propTypes = {}

export default withStyles(styles)(DefaultTable)
