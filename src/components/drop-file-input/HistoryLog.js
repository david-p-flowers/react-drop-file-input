// HistoryLog.js
import React from 'react';

const HistoryLog = ({ uploadedClips }) => {
  return (
    <div className="history-log">
      <h3>Upload History</h3>
      <ul>
        {uploadedClips.map((clip, index) => (
          <li key={index}>{clip.clipTitle}</li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryLog;
