// import React from "react";
// import { Bar } from "react-chartjs-2";

// const HistogramComponent = ({ data }) => {
//   const chartData = {
//     labels: data.labels, // LogP ranges
//     datasets: [
//       {
//         label: "LogP Distribution",
//         data: data.values, // Number of compounds in each LogP range
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//       },
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// export default HistogramComponent;


import React from "react";
import { Bar } from "react-chartjs-2";

const HistogramComponent = ({ data }) => {
  if (!data || data.labels.length === 0) {
    return <p>No data available for histogram.</p>;
  }

  return <Bar data={data} />;
};

export default HistogramComponent;
