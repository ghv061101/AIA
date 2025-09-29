import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const WelcomeBackModal = ({ 
  isOpen, 
  onResume, 
  onStartNew, 
  sessionData 
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressText = () => {
    if (!sessionData) return 'Previous session';
    
    const { phase, currentQuestion, totalQuestions } = sessionData;
    
    switch (phase) {
      case 'upload':
        return 'Resume upload in progress';
      case 'info':
        return 'Information collection in progress';
      case 'interview':
        return `Question ${currentQuestion} of ${totalQuestions}`;
      default:
        return 'Previous session';
    }
  };

  // Enhanced with AI-powered session insights
  const getSessionInsights = () => {
    if (!sessionData?.interviewAnswers?.length) return null;
    
    const answeredQuestions = sessionData?.interviewAnswers?.length;
    const averageTime = sessionData?.interviewAnswers?.reduce((sum, answer) => sum + (answer?.timeUsed || 0), 0) / answeredQuestions;
    
    return {
      questionsAnswered: answeredQuestions,
      averageTime: Math.round(averageTime),
      lastDifficulty: sessionData?.interviewAnswers?.[answeredQuestions - 1]?.difficulty || 'Easy'
    };
  };

  const insights = getSessionInsights();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-md mx-4 animate-slide-in">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="RotateCcw" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Welcome Back!
              </h2>
              <p className="text-sm text-muted-foreground">
                We found your previous session
              </p>
            </div>
          </div>
          
          {sessionData && (
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {getProgressText()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(sessionData?.lastActivity)}
                </span>
              </div>
              
              {/* Enhanced progress visualization */}
              {sessionData?.phase === 'interview' && (
                <div className="space-y-2">
                  <div className="w-full bg-background rounded-full h-2 mt-2">
                    <div 
                      className="h-2 bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(sessionData?.currentQuestion / sessionData?.totalQuestions) * 100}%` 
                      }}
                    />
                  </div>
                  
                  {/* AI-powered insights */}
                  {insights && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span>Answered: {insights?.questionsAnswered}</span>
                      <span>Avg: {Math.floor(insights?.averageTime / 60)}:{(insights?.averageTime % 60)?.toString()?.padStart(2, '0')}</span>
                      <span>Last: {insights?.lastDifficulty}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              variant="default"
              onClick={onResume}
              fullWidth
              iconName="Play"
              iconPosition="left"
            >
              Resume Interview
            </Button>
            
            <Button
              variant="outline"
              onClick={onStartNew}
              fullWidth
              iconName="RefreshCw"
              iconPosition="left"
            >
              Start New Interview
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium">Note:</p>
                <p className="text-muted-foreground">
                  Starting a new interview will permanently delete your previous progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;