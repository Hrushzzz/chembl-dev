import React, { useState } from "react";
import { TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, Chip } from "@mui/material";
import axios from "axios";

const moleculeTypes = ["Small molecule", "Biologic", "Oligonucleotide", "Antibody"];
const maxPhases = [0, 1, 2, 3, 4];

const SearchFilterComponent = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    min_mwt: "",
    max_mwt: "",
    min_alogp: "",
    max_alogp: "",
    min_hbd: "",
    max_hbd: "",
    min_hba: "",
    max_hba: "",
    min_psa: "",
    max_psa: "",
    min_rtb: "",
    max_rtb: "",
    min_tpsa: "",
    max_tpsa: "",
    max_phase: [],
    molecule_type: [],
  });

  const handleMultiSelectChange = (event, key) => {
    setFilters({ ...filters, [key]: event.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/search", {
        params: { query: searchQuery, ...filters },
      });
      onSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          label="Search by ChEMBL ID or Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Grid>

      {/* Numeric Filters */}
      {["min_mwt", "max_mwt", "min_alogp", "max_alogp", "min_hbd", "max_hbd"].map((key) => (
        <Grid item xs={6} md={2} key={key}>
          <TextField
            label={key.replace("_", " ").toUpperCase()}
            variant="outlined"
            fullWidth
            type="number"
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
          />
        </Grid>
      ))}

      {/* Multi-Select: Molecule Type */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Molecule Type</InputLabel>
          <Select
            multiple
            value={filters.molecule_type}
            onChange={(e) => handleMultiSelectChange(e, "molecule_type")}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
              </div>
            )}
          >
            {moleculeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Multi-Select: Max Phase */}
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel>Max Phase</InputLabel>
          <Select
            multiple
            value={filters.max_phase}
            onChange={(e) => handleMultiSelectChange(e, "max_phase")}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip key={value} label={`Phase ${value}`} style={{ margin: 2 }} />
                ))}
              </div>
            )}
          >
            {maxPhases.map((phase) => (
              <MenuItem key={phase} value={phase}>
                Phase {phase}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Search Button */}
      <Grid item xs={12} md={2}>
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchFilterComponent;
