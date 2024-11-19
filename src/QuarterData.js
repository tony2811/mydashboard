import React, { useState, useEffect } from 'react';
import './physicianFilterStyles.css';

const toTitleCase = (str) => {
  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const QuarterFilter = () => {
  const [physicianData, setPhysicianData] = useState([]);
  const [selectedPhysicians, setSelectedPhysicians] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchPhysicianData = async () => {
      const response = await fetch('/pub_quarter.csv');
      const data = await response.text();
      parseCSV(data);
    };

    const parseCSV = (data) => {
      const rows = data.split('\n');
      const headers = rows[0].split(',');
      const filteredData = rows.slice(1).map((row) => {
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
    setSelectedPhysicians((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((physician) => physician !== value)
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const parameterNames =
    physicianData.length > 0 && selectedPhysicians.length > 0
      ? Object.keys(physicianData[0]).filter((key) => key !== 'FullName')
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
                      value={physician.FullName}
                      onChange={handlePhysicianChange}
                      checked={selectedPhysicians.includes(physician.FullName)}
                    />
                    <label htmlFor={`physician-${idx}`}>{physician.FullName}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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
                    const selectedData = physicianData.find(
                      (physician) => physician.FullName === selectedName
                    );
                    return (
                      <td key={idx}>{selectedData ? selectedData[parameter] : '-'}</td>
                    );
                  })}
                </tr>
              ))
            ) : (
              Object.keys(physicianData[0] || {})
                .filter((key) => key !== 'FullName')
                .map((parameter, idx) => (
                  <tr key={idx}>
                    <td>{toTitleCase(parameter)}</td>
                    <td>-</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuarterFilter;
