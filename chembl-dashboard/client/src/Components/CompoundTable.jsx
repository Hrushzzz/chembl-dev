import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from "@mui/material";

const CompoundTable = ({ compounds }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("chembl_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedCompounds = compounds.slice().sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  return (
    <Paper sx={{ marginTop: "20px", padding: "10px" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["chembl_id", "pref_name", "max_phase", "full_mwt", "alogp", "hbd", "hba", "psa", "rtb", "tpsa"].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel active={orderBy === column} direction={order} onClick={() => handleRequestSort(column)}>
                    {column.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCompounds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.chembl_id}</TableCell>
                <TableCell>{row.pref_name || "N/A"}</TableCell>
                <TableCell>{row.max_phase}</TableCell>
                <TableCell>{row.full_mwt}</TableCell>
                <TableCell>{row.alogp}</TableCell>
                <TableCell>{row.hbd}</TableCell>
                <TableCell>{row.hba}</TableCell>
                <TableCell>{row.psa}</TableCell>
                <TableCell>{row.rtb}</TableCell>
                <TableCell>{row.tpsa}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={compounds.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CompoundTable;
