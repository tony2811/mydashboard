import React, { useState, useEffect } from 'react';
import './physicianFilterStyles.css';

// Function to convert text to Title Case (capitalize first letter of each word and replace underscores with spaces)
const toTitleCase = (str) => {
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase() // Convert the string to lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

const PhysicianFilter = () => {
  const [physicianData, setPhysicianData] = useState([]);
  const [selectedPhysicians, setSelectedPhysicians] = useState([]); // Store multiple selected physicians
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track if the dropdown is open

  useEffect(() => {
    // Fetch data from public/merged.csv
    const fetchPhysicianData = async () => {
      const response = await fetch('/merged.csv');
      const data = await response.text();
      parseCSV(data);
    };

    const parseCSV = (data) => {
      const rows = data.split('\n');
      const headers = rows[0].split(','); // Assuming first row is headers
      const filteredData = rows.slice(1).map(row => {
        const columns = row.split(',');
        const physician = {};
        headers.forEach((header, idx) => {
          physician[header] = columns[idx];
        });
        return physician;
      });

      setPhysicianData(filteredData);
    };

    fetchPhysicianData();
  }, []);

  const handlePhysicianChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPhysicians((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter(physician => physician !== value);
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Check if physicianData is not empty before trying to access the first element
  const parameterNames = physicianData.length > 0 && selectedPhysicians.length > 0
    ? Object.keys(physicianData[0]).filter(key => key !== 'full_name')
    : [];

  return (
    <div>
      <div className="filter-container">
        <label htmlFor="physician-select"></label>
        <div id="physician-select" className="dropdown-container">
          <div className="dropdown-header" onClick={toggleDropdown}>
            {selectedPhysicians.length > 0
              ? `${selectedPhysicians.length} Physicians Selected`
              : 'Select Physicians'}
          </div>
          {dropdownOpen && (
            <div className="checkbox-container">
              <ul>
                {physicianData.map((physician, idx) => (
                  <li key={idx} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`physician-${idx}`}
                      value={physician.full_name}
                      onChange={handlePhysicianChange}
                      checked={selectedPhysicians.includes(physician.full_name)}
                    />
                    <label htmlFor={`physician-${idx}`}>{physician.full_name}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Display the table even if no physicians are selected */}
      <div className="physician-list-container">
        <table className="physician-table">
          <thead>
            <tr>
              <th>Parameter</th>
              {selectedPhysicians.length > 0
                ? selectedPhysicians.map((selectedName, idx) => (
                    <th key={idx}>{selectedName}</th>
                  ))
                : <th>No Physicians Selected</th>}
            </tr>
          </thead>
          <tbody>
            {parameterNames.length > 0 ? (
              parameterNames.map((parameter, idx) => (
                <tr key={idx}>
                  <td>{toTitleCase(parameter)}</td>
                  {selectedPhysicians.map((selectedName, idx) => {
                    const selectedData = physicianData.find((physician) => physician.full_name === selectedName);
                    return (
                      <td key={idx}>{selectedData ? selectedData[parameter] : '-'}</td>
                    );
                  })}
                </tr>
              ))
            ) : (
              // Display empty rows with placeholder data when no physicians are selected
              Object.keys(physicianData[0] || {}).filter(key => key !== 'full_name').map((parameter, idx) => (
                <tr key={idx}>
                  <td>{toTitleCase(parameter)}</td>
                  <td>-</td> {/* Placeholder for when no physician is selected */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhysicianFilter;
