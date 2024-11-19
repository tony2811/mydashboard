import React, { useState } from "react";
import CSVChart from "./CSVChart"; // Import the CSVChart component
import Header from './Header';
import KOLStackedBarChart from "./PubCategoryChart";
import PhysicianFilter from './PhysicianFilter.js';
import LineChart from "./linechart";
import PieChart from "./PieChart.js";
import QuarterFilter from "./QuarterData.js";

// KPI Component to display individual KPIs
const KPI = ({ label, value }) => (
  <div className="kpi">
    <h3>{label}</h3>
    <p>{value}</p>
  </div>
);

function App() {
  // Static KPIs with default names and values
  const [kpis] = useState([
    { label: "Physicians Count", value: 124 },
    { label: "Journal Countries", value: 32 },
    { label: "Publication Types", value: 46 },
    { label: "Average Co-Author", value: 11 },
    { label: "Clinical Trials", value: 20 },
    { label: "Total Followers", value: 130638 },
  ]);

  return (
    <div className="App">
      <Header />

      {/* KPI Section */}
      <div className="kpi-container">
        {kpis.map((kpi, index) => (
          <KPI key={index} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      {/* Content Section with Physician Filter and KOL Stacked Bar Chart side by side */}
      <div className="content">
        <CSVChart /> 
        <div className="side-by-side-container">
          <PhysicianFilter /> {/* Display Physician Filter directly */}
          <KOLStackedBarChart /> {/* Display KOL Stacked Bar Chart directly */}
        </div>
        <div>
        <LineChart />
        </div>
        <div>
        <PieChart />
        <QuarterFilter />
        </div>
      </div>
    </div>
  );
}

export default App;
