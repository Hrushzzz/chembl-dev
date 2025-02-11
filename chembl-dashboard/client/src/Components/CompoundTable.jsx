import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function CompoundTable({ compounds }) {
  const [compoundData, setCompoundData] = useState(compounds || []);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setCompoundData(compounds);
    }
  }, [searchQuery, compounds]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/compounds?query=${query}`
      );
      setCompoundData(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>ChEMBL ID</b></TableCell>
            <TableCell><b>Compound Name</b></TableCell>
            <TableCell><b>Max Phase</b></TableCell>
            <TableCell><b>Molecular Weight</b></TableCell>
            <TableCell><b>LogP</b></TableCell>
            <TableCell><b>HBD</b></TableCell>
            <TableCell><b>HBA</b></TableCell>
            <TableCell><b>PSA</b></TableCell>
            <TableCell><b>TPSA</b></TableCell>
            <TableCell><b>Structure</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compoundData.map((compound) => (
            <TableRow key={compound.chembl_id}>
              <TableCell>{compound.chembl_id}</TableCell>
              <TableCell>{compound.pref_name || "N/A"}</TableCell>
              <TableCell>{compound.max_phase}</TableCell>
              <TableCell>{compound.full_mwt?.toFixed(2)}</TableCell>
              <TableCell>{compound.alogp?.toFixed(2)}</TableCell>
              <TableCell>{compound.hbd}</TableCell>
              <TableCell>{compound.hba}</TableCell>
              <TableCell>{compound.psa}</TableCell>
              <TableCell>{compound.tpsa}</TableCell>
              <TableCell>
                {compound.canonical_smiles ? (
                  <img
                    src={`https://www.ebi.ac.uk/chembl/api/data/image/${compound.chembl_id}`}
                    alt="Molecular Structure"
                    width="50"
                    height="50"
                  />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CompoundTable;
