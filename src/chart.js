import Chart from 'chart.js/auto'; // Chart.js auto-registers all components in v3+

// Function to create a chart
export const createChart = (canvas, chartData, chartType = 'line') => {
  // Destroy any existing chart instance before creating a new one
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Format labels to handle multi-part names
  const formattedLabels = chartData.labels.map(label => {
    const nameParts = label.split(' ');  // Split name into parts
    const firstName = nameParts[0];  // First part is the first name
    const remainingName = nameParts.slice(1).join(' ');  // The rest of the name
    return `${firstName}\n${remainingName}`;  // Format as "FirstName\nRemainingName"
  });

  // Create a new chart instance
  canvas.chart = new Chart(canvas, {
    type: chartType, // Use the chartType passed to the function ('line' or 'bar')
    data: {
      labels: formattedLabels, // Use the formatted labels with multi-line support
      datasets: chartData.datasets, // Keep the existing datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            font: { size: 10 },
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,  // Allow rotation to fit multi-line labels
          },
          grid: {
            display: false,  // Optional: Hide grid lines for a cleaner look
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { position: 'top'},
      },
    },
  });
};

// Chart options can be reused in the Line/Bar component if necessary
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        font: { size: 10 },
        autoSkip: false,
        maxRotation: 90,
        minRotation: 90,  // Allow rotation to fit multi-line labels
      },
      grid: {
        display: false,  // Optional: Hide grid lines for a cleaner look
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { position: 'top' },
  },
};

export default chartOptions;
