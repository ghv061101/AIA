import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status, progress = 0 }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          icon: 'CheckCircle',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'in-progress':
        return {
          label: `In Progress (${progress}/6)`,
          icon: 'Clock',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        };
      case 'paused':
        return {
          label: 'Paused',
          icon: 'Pause',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'not-started':
        return {
          label: 'Not Started',
          icon: 'Circle',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          label: 'Unknown',
          icon: 'HelpCircle',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.bgColor} ${config?.textColor}`}>
      <Icon name={config?.icon} size={14} className={`mr-2 ${config?.iconColor}`} />
      {config?.label}
    </div>
  );
};

export default StatusBadge;