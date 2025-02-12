import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Container, Typography, Grid } from "@mui/material";
import BarChartComponent from "./Charts/BarChartComponent";
import PieChartComponent from "./Charts/PieChartComponent";
import HistogramComponent from "./Charts/HistogramComponent";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, Tooltip, Legend);

const CompoundCharts = () => {
  const [chartData, setChartData] = useState({
    barChartData: null,
    pieChartData: null,
    histogramData: null,
    scatterPlotData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log("Fetching chart data...");

        const response = await axios.post("http://localhost:5000/api/chart-data", {
          molecularWeightRange: [100, 500],
          logPRange: [-5, 5],
          clinicalPhase: 3,
          hbd: 2,
          hba: 5,
          moleculeType: "Small molecule",
          psaRange: [20, 150],
        });

        console.log("Raw API Response:", response.data);

        if (!response.data || Object.keys(response.data).length === 0) {
          setError("No data available for charts.");
        } else {
          setChartData({
            barChartData: transformBarChartData(response.data.barChartData),
            pieChartData: transformPieChartData(response.data.pieChartData),
            histogramData: transformHistogramData(response.data.histogramData),
            scatterPlotData: transformScatterData(response.data.scatterPlotData),
          });
        }
      } catch (err) {
        console.error("Error fetching chart data::: ", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Transforming API Data to Chart.js Format
  const transformBarChartData = (data) => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Molecular Weight Distribution",
        data: data.map((item) => item.value),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  const transformPieChartData = (data) => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Molecule Type Distribution",
        data: data.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  });

  const transformHistogramData = (data) => ({
    labels: data,
    datasets: [
      {
        label: "LogP Distribution",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const transformScatterData = (data) => ({
    datasets: [
      {
        label: "Molecular Weight vs. LogP",
        data: data.map((item) => ({ x: item.x, y: item.y })),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        pointRadius: 5,
      },
    ],
  });

  if (loading) {
    return (
      <Container>
        <Typography variant="h5">Loading charts...</Typography>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Compound Charts
      </Typography>

      {/* First row of charts */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <div style={{ width: "100%", height: "300px" }}>
            <BarChartComponent data={chartData.barChartData} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <div style={{ width: "100%", height: "300px" }}>
            <PieChartComponent data={chartData.pieChartData} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <div style={{ width: "100%", height: "300px" }}>
            <HistogramComponent data={chartData.histogramData} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompoundCharts;
