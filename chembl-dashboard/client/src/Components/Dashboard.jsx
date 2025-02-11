import React, { useState } from "react";
import CompoundTable from "./CompoundTable";
import ChartComponent from "./ChartComponent";
import Navbar from "./Navbar";
import { Container, Typography } from "@mui/material";

function Dashboard() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <>
      <Navbar onSearch={setSearchResults} />
      <Container>
        <Typography variant="h4" align="center" mt={4}>ChEMBL Compound Dashboard</Typography>
        
        {searchResults.length > 0 ? (
          <>
            <CompoundTable compounds={searchResults} />
            <ChartComponent compounds={searchResults} />
          </>
        ) : (
          <Typography variant="h6" align="center" mt={4}>
            No search results. Use the search bar to find compounds.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
