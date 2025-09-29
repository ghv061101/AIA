import React from 'react';

const ScoreBadge = ({ score }) => {
  const getScoreConfig = (score) => {
    if (score >= 80) {
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        label: 'Excellent'
      };
    } else if (score >= 60) {
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        label: 'Good'
      };
    } else if (score >= 40) {
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        label: 'Average'
      };
    } else {
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        label: 'Needs Improvement'
      };
    }
  };

  const config = getScoreConfig(score);

  return (
    <div className="flex flex-col items-center">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${config?.bgColor} ${config?.textColor} mb-1`}>
        {score}%
      </div>
      <span className={`text-xs font-medium ${config?.textColor}`}>
        {config?.label}
      </span>
    </div>
  );
};

export default ScoreBadge;