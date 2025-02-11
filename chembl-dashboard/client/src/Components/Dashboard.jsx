// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import CompoundTable from "./CompoundTable";

// const Dashboard = () => {
//   const [compounds, setCompounds] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (query) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:5000/api/search?query=${query}`);
//       const data = await response.json();
//       if (response.ok) {
//         setCompounds(data);
//       } else {
//         alert(data.message || "No results found");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <Navbar onSearch={setCompounds} />
//       {loading ? <p>Loading...</p> : <CompoundTable compounds={compounds} />}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import Navbar from "./Navbar";
import CompoundTable from "./CompoundTable";

const Dashboard = () => {
  const [compounds, setCompounds] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <Navbar onSearch={setCompounds} /> {/* ✅ Pass setCompounds */}
      <CompoundTable compounds={compounds} /> {/* ✅ Pass compounds */}
    </div>
  );
};

export default Dashboard;
