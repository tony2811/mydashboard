import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import RankingList from './RankingList'; // Import the RankingList component
import './chartStyles.css'; // Import chart styles
import './App.css'; // Import ranking list styles

const CSVChart = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({
    xColumn: 'full_name',  // Set default to 'full_name'
    yColumn: 'final_score' // Set 'final_score' as default for yColumn
  });

  const toTitleCase = (str) => {
    return str
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: `Physician name vs ${toTitleCase(selectedColumns.yColumn)}`,
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true
    }]
  });
  const [rankedData, setRankedData] = useState([]);
  const [chartType, setChartType] = useState('line');

  // Load the CSV file from the public folder automatically
  useEffect(() => {
    // Automatically fetch and parse the CSV file
    fetch('/merged.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (result) => {
            const cleanedData = result.data.filter(row => row.some(cell => cell !== "" && cell !== undefined && cell !== null));
            setCsvData(cleanedData);
            setSelectedColumns({ xColumn: 'full_name', yColumn: 'final_score' }); // Set 'final_score' as default on load
          },
          header: false
        });
      })
      .catch(error => console.error('Error loading the CSV file:', error));
  }, []);  // Empty dependency array to load once on mount

  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    setSelectedColumns(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const updateChartData = () => {
    if (csvData.length === 0 || selectedColumns.yColumn === 'none') {
      return;
    }
  
    const xColumnIndex = csvData[0].indexOf('full_name');  // Find the index of 'full_name'
    const yColumnIndex = csvData[0].indexOf(selectedColumns.yColumn);  // Find the correct index for the selected yColumn
  
    const xData = csvData.slice(1).map(row => row[xColumnIndex]);
    const yData = csvData.slice(1).map(row => {
      const value = row[yColumnIndex];
      return isNaN(value) ? 0 : parseFloat(value);
    });
  
    const sortedData = xData.map((label, index) => ({
      label,
      value: yData[index],
    })).sort((a, b) => b.value - a.value);
  
    const sortedLabels = sortedData.map(item => item.label);
    const sortedValues = sortedData.map(item => item.value);
  
    // Format labels to handle multi-part names
    const formattedLabels = sortedLabels.map(label => {
      const nameParts = label.split(' ');  // Split name into parts
      const firstName = nameParts[0];  // First part is the first name
      const remainingName = nameParts.slice(1).join(' ');  // The rest of the name
      return `${firstName}\n${remainingName}`;  // Format as "FirstName\nRemainingName"
    });
  
    setChartData({
      labels: formattedLabels,  // Use the formatted labels
      datasets: [{
        label: `${selectedColumns.xColumn} vs ${selectedColumns.yColumn}`, // Use the selected column names for label
        data: sortedValues,
        borderColor: '#0073CF',
        borderWidth: 2,
        fill: chartType === 'line' ? true : true,
        backgroundColor: chartType === 'bar' ? '#A2CFFE' : chartType === 'line' ? '#A2CFFE': 'transparent',
      }]
    });
  
    setRankedData(sortedData); // Set ranked data for the ranking list
  };

  useEffect(() => {
    updateChartData();
  }, [selectedColumns, chartType]);

  const getChartTitle = () => {
    const yColumnLabel = selectedColumns.yColumn !== 'none' ? toTitleCase(csvData[0][selectedColumns.yColumn]) : "Select a Parameter";
    return `Physician Name vs ${yColumnLabel}`; // Title only includes the parameter selected
  };

  return (
    <div className="main-container">
      {csvData.length > 0 && (
        <div className="parameter-container">
          <div>
            <label>Select Parameter:</label>
            <select name="yColumn" onChange={handleColumnChange} value={selectedColumns.yColumn}>
              {csvData[0].map((col, index) => (
                // Exclude 'full_name' from the dropdown, but include other columns
                col !== 'full_name' && (
                  <option key={index} value={col}> {/* Use the column name itself for value */}
                    {toTitleCase(col)} {/* Convert column names to Title Case */}
                  </option>
                )
              ))}
            </select>
          </div>

          <div>
            <label>Select Chart Type:</label>
            <select onChange={handleChartTypeChange} value={chartType}>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>
      )}

      <div className="content-container">
        <RankingList rankedData={rankedData} /> {/* Render the RankingList on the left */}
        <div className="chart-container">
          <h2>{getChartTitle}</h2>
          <div className="chart-canvas">
            {chartType === 'line' ? (
              <Line data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    beginAtZero: true,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                    ticks: {
                      font: { size: 10 },
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                    },
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: { display:false },
                },
              }} />
            ) : (
              <Bar data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    beginAtZero: true,
                    barPercentage: 0.8,
                    categoryPercentage: 0.8,
                    ticks: {
                      font: { size: 12 },
                      autoSkip: false,
                      maxRotation: 90,
                      minRotation: 90,
                    },
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: { display: false},
                },
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVChart;
