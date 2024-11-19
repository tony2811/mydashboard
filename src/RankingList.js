import React from 'react';
import './RankingStyles.css'; // Import ranking list styles (Make sure to update path to match your project structure)

const RankingList = ({ rankedData }) => {
  return (
    <div className="ranking-list-container">
      <div className="ranking-title">Ranking List</div> {/* Use the updated title class */}
      {rankedData.length > 0 ? (
        <div>
          <ol className="ranking-list">
            {rankedData.map((item, index) => (
              <li key={index} className="ranking-list-item">
                <span className="ranking-position">{index + 1}.</span> {/* Corrected rank class */}
                <span className="ranking-name">{item.label}</span> {/* Corrected name class */}
                <span className="ranking-score">{item.value}</span> {/* Corrected score class */}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="ranking-item empty">No data available</div>
      )}
    </div>
  );
};

export default RankingList;