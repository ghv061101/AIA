import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import StatusBadge from './StatusBadge';
import ScoreBadge from './ScoreBadge';

const CandidateTable = ({ candidates, onViewProfile, onViewChat }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (candidate) => {
    navigate(`/candidate-detail/${candidate?.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Candidate</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((candidate, index) => (
              <tr 
                key={candidate?.id} 
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-card-foreground truncate">
                        {candidate?.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {candidate?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={candidate?.status} />
                </td>
                <td className="py-3 px-4">
                  <ScoreBadge score={candidate?.finalScore} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-card-foreground">
                    {candidate?.completionTime ? `${candidate?.completionTime}m` : '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(candidate?.interviewDate)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(candidate)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(candidate)}
                      iconName="User"
                      iconPosition="left"
                    >
                      Profile
                    </Button>
                    {candidate?.status === 'in-progress' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewChat(candidate)}
                        iconName="MessageSquare"
                        iconPosition="left"
                      >
                        Chat
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;