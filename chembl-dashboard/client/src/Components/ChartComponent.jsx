import React, { useEffect, useState } from "react";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import axios from "axios";
import { Box, Paper, Typography } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, ArcElement);

function ChartComponent({ compounds }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (compounds.length > 0) {
      generateChartData(compounds);
    }
  }, [compounds]);

  const generateChartData = (data) => {
    const labels = data.map((compound) => compound.chembl_id);
    const molecularWeights = data.map((compound) => compound.full_mwt);
    const alogpValues = data.map((compound) => compound.alogp);

    setChartData({
      bar: {
        labels,
        datasets: [
          {
            label: "Molecular Weight",
            data: molecularWeights,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      pie: {
        labels,
        datasets: [
          {
            label: "LogP Distribution",
            data: alogpValues,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      scatter: {
        datasets: [
          {
            label: "MW vs LogP",
            data: data.map((compound) => ({
              x: compound.full_mwt,
              y: compound.alogp,
            })),
            backgroundColor: "rgba(153, 102, 255, 1)",
          },
        ],
      },
    });
  };

  if (!chartData) return <Typography>Loading charts...</Typography>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={4} mt={4}>
      <Paper sx={{ padding: 2, width: "80%" }}>
        <Typography variant="h6" textAlign="center">Molecular Weight Distribution</Typography>
        <Bar data={chartData.bar} />
      </Paper>
      <Paper sx={{ padding: 2, width: "50%" }}>
        <Typography variant="h6" textAlign="center">LogP Distribution</Typography>
        <Pie data={chartData.pie} />
      </Paper>
      <Paper sx={{ padding: 2, width: "80%" }}>
        <Typography variant="h6" textAlign="center">Molecular Weight vs LogP</Typography>
        <Scatter data={chartData.scatter} />
      </Paper>
    </Box>
  );
}

export default ChartComponent;
