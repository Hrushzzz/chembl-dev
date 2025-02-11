import React from "react";
import { Pie } from "react-chartjs-2";

// const PieChartComponent = ({ data }) => {
//   const chartData = {
//     labels: data.labels, // Molecule types
//     datasets: [
//       {
//         data: data.values, // Count per type
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
//       },
//     ],
//   };
//   return <Pie data={chartData} />;
// };

  const PieChartComponent = ({ data }) => {
  if (!data || data.labels.length === 0) {
    return <p>No data available for pie chart.</p>;
  }

  return <Pie data={data} />;
};



export default PieChartComponent;


