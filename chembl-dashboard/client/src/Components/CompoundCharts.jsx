import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Container, Typography } from "@mui/material";
import BarChartComponent from "./Charts/BarChartComponent";
import PieChartComponent from "./Charts/PieChartComponent";
import HistogramComponent from "./Charts/HistogramComponent";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CompoundCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log("📡 Fetching chart data...");

        const response = await axios.post("http://localhost:5000/api/chart-data", {
          molecularWeightRange: [100, 500],
          logPRange: [-5, 5],
          clinicalPhase: 3,
          hbd: 2,
          hba: 5,
          moleculeType: "Small molecule",
          psaRange: [20, 150],
        });

        console.log("📊 Raw API Response:", response.data);

        if (!response.data || response.data.length === 0) {
          setError("⚠️ No data available for charts.");
        } else {
          setChartData(transformDataForCharts(response.data));
        }
      } catch (err) {
        console.error("❌ Error fetching chart data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Transform API Data to Chart.js Format
  const transformDataForCharts = (data) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    return {
      labels: data.map((item) => item.molecule_type), // X-axis labels
      datasets: [
        {
          label: "Molecule Type Distribution",
          data: data.map((item) => item.count), // Y-axis values
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

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
      <Typography variant="h4">Compound Charts</Typography>
      <BarChartComponent data={chartData} />
      <PieChartComponent data={chartData} />
      <HistogramComponent data={chartData} />
    </Container>
  );
};

export default CompoundCharts;
