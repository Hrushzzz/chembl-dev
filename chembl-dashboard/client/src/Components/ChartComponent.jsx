import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";

function ChartComponent({ data }) {
  useEffect(() => {
    console.log("ChartComponent received data:", data); 
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No chart data available.
      </Typography>
    );
  }

  const compoundNames = data.map((compound) => compound.pref_name || "Unknown");
  const molecularWeights = data.map((compound) => compound.full_mwt || 0);

  const chartData = {
    labels: compoundNames,
    datasets: [
      {
        label: "Molecular Weight",
        data: molecularWeights,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h6" align="center">Molecular Weight Distribution</Typography>
        <div style={{ height: "400px" }}>
          <Bar data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartComponent;
