import React from "react";
import { Scatter } from "react-chartjs-2";

const ScatterPlotComponent = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: "Molecular Weight vs LogP",
        data: data.map((point) => ({ x: point.molecularWeight, y: point.logP })),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return <Scatter data={chartData} />;
};

export default ScatterPlotComponent;
