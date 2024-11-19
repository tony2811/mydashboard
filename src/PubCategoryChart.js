import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Papa from 'papaparse';
import './secondChartStyles.css';

const KOLStackedBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV data when the component mounts
    fetch('/merged.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = parseCSVData(csvText);
        setData(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching or parsing CSV:', error);
      });
  }, []);

  // Function to parse and structure the CSV data
  const parseCSVData = (csvText) => {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Transform each row of the data into a usable format
    const publicationData = parsed.data.map((row) => {
      return {
        fullName: row.full_name,
        publications2009_2014: parseInt(row['2009-2014_publications'], 10) || 0,
        publications2014_2019: parseInt(row['2014-2019_publications'], 10) || 0,
        publications2019Present: parseInt(row['2019-present_publications'], 10) || 0,
      };
    });

    // Sort the data: First by 2019-present publications, and if tied, by 2014-2019 publications
    publicationData.sort((a, b) => {
      if (b.publications2019Present !== a.publications2019Present) {
        return b.publications2019Present - a.publications2019Present; // Descending order
      }
      return b.publications2014_2019 - a.publications2014_2019; // If tied, then sort by 2014-2019 publications
    });

    return publicationData;
  };

  // Chart data structure
  const chartData = {
    labels: data.map((item) => item.fullName), // KOL names on X-axis
    datasets: [
      {
        label: '2009-2014 Publications',
        data: data.map((item) => item.publications2009_2014),
        backgroundColor: 'rgb(173, 216, 230)',
        stack: 'stack1', // Stack group for this dataset
      },
      {
        label: '2014-2019 Publications',
        data: data.map((item) => item.publications2014_2019),
        backgroundColor: 'rgb(70, 130, 180)',
        stack: 'stack2', // Stack group for this dataset
      },
      {
        label: '2019-Present Publications',
        data: data.map((item) => item.publications2019Present),
        backgroundColor: 'rgb(0, 0, 139)',
        stack: 'stack3', // Stack group for this dataset
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        ticks: {
            font: { size: 12 },
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
        },
      },
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
            font: { size: 12 },
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top', align: 'start'
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} publications`,
        },
      },
    },
  };

  return (
    <div className="second-chart-container">
      <h3>Physician Publications by Category</h3>
      <div className="canvas-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default KOLStackedBarChart;
