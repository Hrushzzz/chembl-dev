// import "./App.css";
// import Navbar from "./Components/Navbar";
// import Dashboard from "./Components/Dashboard";
// import { Routes, Route } from "react-router-dom";
// import CompoundTable from "./Components/CompoundTable";
// import ChartComponent from "./Components/ChartComponent";

// function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* <Route path="/" element={<Dashboard />} /> */}
//         <Route path="/search" element={<CompoundTable />} />
//         <Route path="/charts" element={<ChartComponent />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ChartComponent from "./Components/ChartComponent";
import CompoundDetail from "./Components/CompoundDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/charts" element={<ChartComponent />} />
        <Route path="/compound/:chemblId" element={<CompoundDetail />} /> 
      </Routes>
    </>
  );
}

export default App;
