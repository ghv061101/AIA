import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MetricsPanel from './components/MetricsPanel';
import FilterControls from './components/FilterControls';
import CandidateTable from './components/CandidateTable';
import CandidateProfileModal from './components/CandidateProfileModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InterviewerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [realCandidates, setRealCandidates] = useState([]);

  // Load candidates from localStorage
  useEffect(() => {
    loadRealCandidates();
  }, []);

  const loadRealCandidates = () => {
    const allUsers = Object.keys(localStorage)
      .filter(key => key.startsWith('user_interviews_'))
      .map(key => {
        const userId = key.replace('user_interviews_', '');
        const interviews = JSON.parse(localStorage.getItem(key) || '[]');
        return interviews.map(interview => ({
          ...interview,
          userId,
          id: `${userId}-${interview.sessionId}`, // ensure unique key
        }));
      })
      .flat();

    const detailedCandidates = allUsers.map(interview => {
      const resultsKey = `interview_results_${interview.userId}_${interview.sessionId}`;
      const results = JSON.parse(localStorage.getItem(resultsKey) || '{}');

      return {
        id: interview.id, // already unique
        name: results.candidateInfo?.name || 'Unknown Candidate',
        email: results.candidateInfo?.email || 'No email',
        phone: results.candidateInfo?.phone || 'No phone',
        status: 'completed',
        finalScore: results.overallScore || 0,
        completionTime:
          Math.round((new Date(results.completedAt) - new Date(interview.completedAt)) / 60000) || 45,
        interviewDate: results.completedAt || interview.completedAt,
        currentQuestion: 6,
        summary: results.summary || 'No summary available',
        questionScores:
          results.interviewAnswers?.map(answer => ({
            difficulty: answer.difficulty,
            score: answer.aiEvaluation?.score || 0,
            feedback: answer.aiEvaluation?.feedback || 'No feedback',
          })) || [],
        skills:
          results.candidateInfo?.skills?.map(skill => ({
            name: skill,
            level: Math.floor(Math.random() * 40) + 60, // Random level for display
          })) || [],
      };
    });

    setRealCandidates(detailedCandidates);
  };

  // Mock metrics
  const mockMetrics = {
    totalCandidates: realCandidates?.length || 0,
    averageScore: Math.round(
      realCandidates
        .filter(c => c.finalScore !== null)
        .reduce((sum, c) => sum + c.finalScore, 0) /
        Math.max(realCandidates.filter(c => c.finalScore !== null).length, 1)
    ),
    completionRate: Math.round(
      (realCandidates.filter(c => c.status === 'completed').length / Math.max(realCandidates.length, 1)) * 100
    ),
    activeInterviews: realCandidates.filter(c => c.status === 'in-progress').length,
  };

  // Filter and sort
  const filteredCandidates = realCandidates
    .filter(candidate => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'score':
          aValue = a.finalScore || 0;
          bValue = b.finalScore || 0;
          break;
        case 'date':
          aValue = new Date(a.interviewDate);
          bValue = new Date(b.interviewDate);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'duration':
          aValue = a.completionTime || 0;
          bValue = b.completionTime || 0;
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });

  const handleViewProfile = candidate => {
    setSelectedCandidate(candidate);
    setIsProfileModalOpen(true);
  };

  const handleViewChat = candidate => {
    console.log('View chat for candidate:', candidate.id);
  };

  const handleExport = () => {
    console.log('Exporting candidate data...');
  };

  const handleSortOrderChange = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  const handleLogout = () => console.log('Logging out...');

  const handleConductInterview = () => navigate('/interviewee-chat-interface');

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} userRole="interviewer" onLogout={handleLogout} />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interviewer Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and evaluate candidate performance in real-time
          </p>

          <div className="mt-4">
            <Button variant="default" onClick={handleConductInterview} iconName="Plus" iconPosition="left">
              Conduct New Interview
            </Button>
          </div>
        </div>

        <MetricsPanel metrics={mockMetrics} />

        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          onExport={handleExport}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Candidates ({filteredCandidates.length})</h2>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No candidates found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No candidates have completed interviews yet. Click "Conduct New Interview" to start.'}
              </p>
            </div>
          ) : (
            <CandidateTable
              candidates={filteredCandidates}
              onViewProfile={handleViewProfile}
              onViewChat={handleViewChat}
            />
          )}
        </div>
      </main>

      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedCandidate(null);
        }}
      />
    </div>
  );
};

export default InterviewerDashboard;
