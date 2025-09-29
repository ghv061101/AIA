import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusBadge from './StatusBadge';
import ScoreBadge from './ScoreBadge';

const CandidateProfileModal = ({ candidate, isOpen, onClose }) => {
  if (!isOpen || !candidate) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">Candidate Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="p-6">
          {/* Candidate Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-foreground">
                  {candidate?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-card-foreground">{candidate?.name}</h3>
                <p className="text-muted-foreground">{candidate?.email}</p>
                <p className="text-muted-foreground">{candidate?.phone}</p>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end space-y-2">
              <StatusBadge status={candidate?.status} progress={candidate?.currentQuestion} />
              {candidate?.finalScore !== null && <ScoreBadge score={candidate?.finalScore} />}
            </div>
          </div>

          {/* Interview Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Interview Date</span>
              </div>
              <p className="text-sm text-card-foreground">{formatDate(candidate?.interviewDate)}</p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Duration</span>
              </div>
              <p className="text-sm text-card-foreground">{formatDuration(candidate?.completionTime)}</p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Questions Completed</span>
              </div>
              <p className="text-sm text-card-foreground">{candidate?.currentQuestion}/6</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <Icon name="Brain" size={20} className="mr-2" />
              AI Assessment Summary
            </h4>
            <div className="bg-muted rounded-lg p-6">
              <p className="text-card-foreground leading-relaxed">{candidate?.summary}</p>
            </div>
          </div>

          {/* Question Breakdown */}
          {candidate?.questionScores && candidate?.questionScores?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2" />
                Question-wise Performance
              </h4>
              <div className="space-y-4">
                {candidate?.questionScores?.map((question, index) => (
                  <div key={index} className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-card-foreground">
                        Question {index + 1} ({question?.difficulty})
                      </span>
                      <span className="text-sm font-bold text-card-foreground">
                        {question?.score}%
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${question?.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{question?.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Assessment */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
              <Icon name="Code" size={20} className="mr-2" />
              Technical Skills
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {candidate?.skills && candidate?.skills?.map((skill, index) => (
                <div key={index} className="bg-muted rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-card-foreground">{skill?.name}</span>
                    <span className="text-sm text-muted-foreground">{skill?.level}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1">
                    <div 
                      className="bg-secondary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${skill?.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button
              variant="default"
              iconName="MessageSquare"
              iconPosition="left"
              fullWidth
            >
              View Complete Chat History
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Export Profile
            </Button>
            <Button
              variant="outline"
              iconName="Mail"
              iconPosition="left"
              fullWidth
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;