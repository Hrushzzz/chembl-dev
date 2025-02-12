import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartComponent = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No data available for bar chart.</p>;
  }

  // Ensuring data values are valid and non-negative
  const formattedData = data.map((item) => ({
    label: item.label || "Unknown",
    value: Math.max(0, item.value || 0),
  }));

  const chartData = {
    labels: formattedData.map((item) => item.label),
    datasets: [
      {
        label: "Molecular Weight Distribution",
        data: formattedData.map((item) => item.value),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Molecular Weight Distribution",
        font: { size: 16 },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Count: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Molecular Weight Ranges",
          font: { size: 14 },
        },
        beginAtZero: true,
        suggestedMin: 0,
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
          font: { size: 14 },
        },
        beginAtZero: true,
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartComponent;
