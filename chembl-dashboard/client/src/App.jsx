import "./App.css";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import { Routes, Route } from "react-router-dom";
import CompoundTable from "./Components/CompoundTable";
import ChartComponent from "./Components/ChartComponent";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/search" element={<CompoundTable />} />
        <Route path="/charts" element={<ChartComponent />} />
      </Routes>
    </>
  );
}

export default App;
