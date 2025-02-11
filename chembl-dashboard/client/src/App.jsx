import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import ChartComponent from "./Components/ChartComponent";
import CompoundDetail from "./Components/CompoundDetail";
import CompoundCharts from "./Components/CompoundCharts";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/charts" element={<ChartComponent />} />
        <Route path="/compound/:chemblId" element={<CompoundDetail />} /> 
        <Route path="/compound-charts" element={<CompoundCharts />} />
      </Routes>
    </>
  );
}

export default App;
