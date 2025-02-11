import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartComponent = ({ data }) => {
  if (!data || data.labels.length === 0) {
    return <p>No data available for bar chart.</p>;
  }

  return <Bar data={data} />;
};

export default BarChartComponent;
