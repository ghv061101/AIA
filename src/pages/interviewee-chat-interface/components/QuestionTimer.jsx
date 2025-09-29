import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuestionTimer = ({ 
  timeLimit, 
  isActive = false, 
  onTimeUp, 
  difficulty = 'Easy',
  questionNumber = 1 
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsWarning(false);
  }, [timeLimit]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Warning when 25% time left or less than 10 seconds
        const warningThreshold = Math.min(timeLimit * 0.25, 10);
        setIsWarning(newTime <= warningThreshold);
        
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, timeLimit, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10 border-success/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'hard':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const progressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-sm text-muted-foreground">
            Question {questionNumber}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon 
            name="Clock" 
            size={16} 
            className={isWarning ? 'text-destructive' : 'text-muted-foreground'} 
          />
          <span className={`text-lg font-mono font-semibold ${
            isWarning ? 'text-destructive' : 'text-foreground'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            isWarning ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {isWarning && (
        <div className="flex items-center space-x-2 mt-2 text-destructive text-sm">
          <Icon name="AlertTriangle" size={14} />
          <span>Time running out!</span>
        </div>
      )}
    </div>
  );
};

export default QuestionTimer;