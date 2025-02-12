import React, { useState } from "react";
import Navbar from "./Navbar";
import CompoundTable from "./CompoundTable";

const Dashboard = () => {
  const [compounds, setCompounds] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <Navbar onSearch={setCompounds} />
      <CompoundTable compounds={compounds} />
    </div>
  );
};

export default Dashboard;
