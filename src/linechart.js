// Import required libraries
import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import Papa from 'papaparse'; // CSV parser library
import './linechart.css'; // Custom CSS for line chart

const LineChart = () => {
  useEffect(() => {
    // Fetch and parse the CSV data
    fetch('year_linechart.csv') // Change this path as per the actual location of your CSV
      .then((response) => response.text())
      .then((csvData) => {
        // Use PapaParse to parse CSV
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            // Filter data for years >= 1990
            const filteredData = results.data.filter(
              (row) => parseInt(row.Publication_date, 10) >= 1990
            );

            // Prepare the data for the line chart
            const labels = [];
            const pubCount = [];
            const physicians = [];

            filteredData.forEach((row) => {
              labels.push(row.Publication_date);
              pubCount.push(parseInt(row.pub_count, 10));
              physicians.push(row.physician_name);
            });

            // Create the line chart
            const ctx = document.getElementById('lineChartCanvas').getContext('2d');
            const lineChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels, // X-axis: Publication Date
                datasets: [
                  {
                    label: 'Publication Count',
                    data: pubCount, // Y-axis: Publication Count
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    fill: true,
                    pointBackgroundColor: '#4e73df',
                    pointRadius: 5,
                    pointHitRadius: 10, // Increase sensitivity for better click handling
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'point', // Respond only to direct clicks on points
                  axis: 'x',
                  intersect: true,
                },
                plugins: {
                  title: {
                      display: true, // Enable the title
                      text: 'Publication Trends by Year', // Set your title text
                      font: {
                          size: 18, // Font size for the title
                          weight: 'bold',
                        },
                      color: '#333', // Title color
                      padding: {
                          top: 10,
                          bottom: 20, // Space around the title
                        },
                      },
                  tooltip: {
                    callbacks: {
                      title: function (tooltipItems) {
                        const year = tooltipItems[0].label; // Year (Publication Date)
                        const physicianName =
                          physicians[tooltipItems[0].dataIndex]; // Get physician name
                        return `Year: ${year}\nPhysician: ${physicianName}`;
                      },
                    },
                  },
                  legend: {display: false}
                },
                onClick: function (event) {
                  const points = lineChart.getElementsAtEventForMode(
                    event,
                    'point',
                    { intersect: true },
                    false
                  );
                },
              },
            });
          },
        });
      })
      .catch((error) => console.error('Error fetching CSV data:', error));
  }, []);

  // Function to display physician info
  function displayPhysicianInfo(year, physician) {
    const infoBox = document.getElementById('physicianInfo');
    infoBox.innerHTML = `<strong>Physician for ${year}:</strong> ${physician}`;
  }

  return (
    <div className="chart-container-line">
      <canvas id="lineChartCanvas"></canvas>
      <div className="physician-info" id="physicianInfo"></div>
    </div>
  );
};

export default LineChart;
