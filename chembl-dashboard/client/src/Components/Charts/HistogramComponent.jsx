import React from "react";
import { Bar } from "react-chartjs-2";

const HistogramComponent = ({ data }) => {
  if (!data || data.labels.length === 0) {
    return <p>No data available for histogram.</p>;
  }

  return <Bar data={data} />;
};

export default HistogramComponent;
