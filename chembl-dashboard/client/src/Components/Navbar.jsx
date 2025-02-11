import React, { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/molecule.png";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  padding: theme.spacing(1, 1, 1, 2),
  paddingRight: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  [theme.breakpoints.up("sm")]: {
    width: "20ch",
    "&:focus": {
      width: "25ch",
    },
  },
}));

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) return;

    try {
      console.log("Fetching data for:", searchQuery);
      const response = await axios.get(`http://localhost:5000/api/search`, {
        params: { query: searchQuery },
      });

      console.log("Received data:", response.data);
      onSearch(response.data); // Update state in Dashboard
    } catch (error) {
      console.error("Error fetching search results:", error.response?.data || error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchSearchResults();
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4CAF50" }}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ width: "50px", marginRight: "10px" }} />
          </Link>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}>
            chEMBL Dashboard
          </Typography>
        </Box>

        <Search>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchIconWrapper>
            <IconButton onClick={fetchSearchResults}>
              <SearchIcon sx={{ color: "white" }} />
            </IconButton>
          </SearchIconWrapper>
        </Search>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
