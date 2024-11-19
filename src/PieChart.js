import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Papa from 'papaparse';
import './PieChart.css';

const PieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV data when the component mounts
    fetch('/publi_type_count.csv')
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

    return parsed.data.map((row) => ({
      JournalType: row.index,
      TypeCount: parseFloat(row.count), // Default to 0 if value is invalid
    }));
  };

  // Blue-themed color palette
  const colors = [
    // Red Shades
    '#C53030', // Dark Red
    '#E53E3E',
    '#FC8181', // Light Red
    '#F56565', // Soft Red
    
    // Yellow Shades
    '#D69E2E', // Dark Yellow
    '#F6E05E', // Light Yellow
    '#ECC94B', // Bright Yellow
    '#FAF089', // Soft Yellow
  
    // Green Shades
    '#22543D', // Dark Green
    '#48BB78', // Medium Green
    '#68D391', // Light Green
    '#9AE6B4', // Soft Green
  
    // Blue Shades
    '#2B6CB0', // Dark Blue
    '#3182CE', // Medium Blue
    '#63B3ED', // Light Blue
    '#A3D9FF', // Soft Blue
    
    // Purple Shades
    '#6B46C1', // Dark Purple
    '#9F7AEA', // Medium Purple
    '#B794F4', // Light Purple
    '#D6BCFA', // Soft Purple
    
    // Additional Unique Colors:
    '#DD6B20', // Dark Orange
    '#FBD38D', // Light Orange
    '#9B2C2C', // Dark Red-Orange
    '#FEB2B2', // Soft Red-Orange
  
    '#48C78E', // Teal Green
    '#B2F5EA', // Soft Teal Green
    '#2C5282', // Dark Teal Blue
    '#63D0D5', // Light Teal Blue
    
    '#D53F8C', // Dark Pink
    '#FBB9D4', // Light Pink
    '#C05621', // Brown
    '#F6E05E', // Light Yellow-Green
    
    '#B2F5EA', // Soft Cyan
    '#43B3E8', // Sky Blue
    '#9F7AEA', // Lavender Purple
    '#F56565', // Soft Red
    
    '#805AD5', // Medium Violet
    '#E9D8FD', // Light Lavender
    '#D53F8C', // Dark Rose
    '#F6AD55', // Soft Peach

    '#008080',
    '#FF8C00',
    '#4B0082',
    '#DC143C',
    '#DAA520',
    '#556B2F'
  ];
  
  
  const chartData = {
    labels: data.map((item) => item.JournalType),
    datasets: [
      {
        data: data.map((item) => item.TypeCount),
        backgroundColor: colors.slice(0, data.length),
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} publications`,
        },
      },
    },
  };

  return (
    <div className="chart-container1">
      <h3>Distribution of Journal Types</h3>
      <div className="canvas-wrapper-pie">
        <Pie data={chartData} options={options} />
      </div>
      <div className="custom-legend">
        {data.map((item, index) => (
          <div className="legend-item" key={index}>
            <span
              className="legend-color"
              style={{ backgroundColor: colors[index] }}
            ></span>
            {item.JournalType}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
