import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import Table from "./Table";
import Modal from "../modal/Modal";

const ModalRowContent = ({ data }) => {
  if (!data || !data.cells) return null;
  const listItems = data.cells.filter((cell, i) => i !== 0);
  return (
    <Grid container>
      {listItems.map((d) => {
        return (
          <Box
            clone
            border={1}
            borderColor="grey.300"
            borderTop={0}
            borderLeft={0}
            borderRight={0}
            py={1}
          >
            <Grid container key={d.column.Header}>
              <Grid item xs={4}>
                <Typography className="w-700 sans-serif body-sm">
                  {d.column.Header}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="sans-serif body-sm">
                  {d.value}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Grid>
  );
};

const DefaultTable = ({
  initialSortColumn,
  columns,
  startDesc = false,
  preventReverseSort = false,
  rowModal = false,
  ...props
}) => {
  const firstCol = columns[0].accessor;
  const [sortCol, setSortCol] = React.useState(initialSortColumn || firstCol);
  const [sortDesc, setSortDesc] = React.useState(startDesc);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [showModal, setShowModal] = React.useState(false);
  const [activeRow, setActiveRow] = React.useState(null);

  const options = React.useMemo(() => {
    return {
      sortDesc,
      initialState: {
        pageIndex,
        pageSize,
        sortBy: [{ id: sortCol, desc: sortDesc }],
      },
    };
  }, [sortCol, sortDesc, pageIndex, pageSize]);

  const handleSortChange = React.useCallback(
    (sortBy) => {
      if (sortBy === sortCol) {
        if (!preventReverseSort) {
          setSortDesc(!sortDesc);
        }
      } else {
        setSortCol(sortBy);
      }
    },
    [sortCol, sortDesc, preventReverseSort]
  );

  const changePageHandler = React.useCallback((idx) => {
    setPageIndex(idx);
  }, []);
  const changeRowsPerPageHandler = React.useCallback((pages) => {
    setPageSize(pages);
  }, []);

  const handleShowModal = (row) => {
    rowModal && setActiveRow(row);
    rowModal && row && setShowModal(true);
  };

  return (
    <>
      <Table
        columns={columns}
        options={options}
        sortColumn={sortCol}
        sortDesc={sortDesc}
        onSort={handleSortChange}
        onChangePage={changePageHandler}
        onChangeRowsPerPage={changeRowsPerPageHandler}
        onRowClick={rowModal && handleShowModal}
        {...props}
      ></Table>
      {rowModal && (
        <Modal
          title={activeRow && activeRow.cells[0].value}
          content={<ModalRowContent data={activeRow} />}
          DialogProps={{
            open: showModal,
            onClose: () => setShowModal(false),
          }}
        />
      )}
    </>
  );
};

DefaultTable.propTypes = {};

export default DefaultTable;
