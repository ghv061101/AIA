import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps, phase }) => {
  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'upload':
        return 'bg-accent';
      case 'info':
        return 'bg-warning';
      case 'interview':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'upload':
        return 'Resume Upload';
      case 'info':
        return 'Information Collection';
      case 'interview':
        return 'Technical Interview';
      case 'completed':
        return 'Interview Completed';
      default:
        return 'Getting Started';
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase)}`} />
          <span className="text-sm font-medium text-card-foreground">
            {getPhaseText(phase)}
          </span>
        </div>
        
        {phase === 'interview' && (
          <span className="text-sm text-muted-foreground">
            Question {currentStep} of {totalSteps}
          </span>
        )}
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getPhaseColor(phase)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;