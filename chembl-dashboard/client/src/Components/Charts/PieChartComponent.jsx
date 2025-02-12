import React from "react";
import { Pie } from "react-chartjs-2";

  const PieChartComponent = ({ data }) => {
  if (!data || data.labels.length === 0) {
    return <p>No data available for pie chart.</p>;
  }

  return <Pie data={data} />;
};

export default PieChartComponent;
