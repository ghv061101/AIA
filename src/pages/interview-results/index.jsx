import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const InterviewResultsPage = () => {
  const navigate = useNavigate();
  const [userResults, setUserResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [userRanking, setUserRanking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserResults();
  }, []);

  const loadUserResults = () => {
    const userSession = JSON.parse(sessionStorage.getItem('aiInterviewUser') || '{}');
    
    if (!userSession.id) {
      navigate('/login');
      return;
    }

    // Load user's interview history
    const userResultsHistory = JSON.parse(localStorage.getItem(`user_interviews_${userSession.id}`) || '[]');
    
    // Get detailed results for each interview
    const detailedResults = userResultsHistory.map(interview => {
      const resultsKey = `interview_results_${userSession.id}_${interview.sessionId}`;
      const results = JSON.parse(localStorage.getItem(resultsKey) || '{}');
      return {
        ...interview,
        ...results
      };
    }).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    setUserResults(detailedResults);
    
    if (detailedResults.length > 0) {
      setSelectedResult(detailedResults[0]);
      calculateRanking(detailedResults[0]);
    }
    
    setLoading(false);
  };

  const calculateRanking = (currentResult) => {
    // Get all completed interviews from all users
    const allResults = Object.keys(localStorage)
      .filter(key => key.startsWith('user_interviews_'))
      .map(key => {
        const userId = key.replace('user_interviews_', '');
        const interviews = JSON.parse(localStorage.getItem(key) || '[]');
        return interviews.map(interview => {
          const resultsKey = `interview_results_${userId}_${interview.sessionId}`;
          const results = JSON.parse(localStorage.getItem(resultsKey) || '{}');
          return {
            userId,
            sessionId: interview.sessionId,
            overallScore: results.overallScore || 0,
            completedAt: results.completedAt
          };
        });
      })
      .flat()
      .sort((a, b) => b.overallScore - a.overallScore);

    const userRank = allResults.findIndex(result => 
      result.sessionId === currentResult.sessionId
    ) + 1;

    const totalCandidates = allResults.length;
    const percentile = Math.round(((totalCandidates - userRank) / totalCandidates) * 100);

    setUserRanking({
      rank: userRank,
      totalCandidates,
      percentile,
      topPerformer: userRank <= Math.ceil(totalCandidates * 0.1)
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aiInterviewUser');
    localStorage.removeItem('aiInterviewUser');
    navigate('/login');
  };

  const handleRetakeInterview = () => {
    navigate('/interviewee-chat-interface');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole="candidate" 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-lg text-foreground">Loading your results...</span>
          </div>
        </div>
      </div>
    );
  }

  if (userResults.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole="candidate" 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="FileQuestion" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Interview Results</h2>
            <p className="text-muted-foreground mb-4">You haven't completed any interviews yet.</p>
            <Button
              variant="default"
              onClick={() => navigate('/interviewee-chat-interface')}
              iconName="Play"
              iconPosition="left"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true} 
        userRole="candidate" 
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Interview Results</h1>
          <p className="text-muted-foreground">
            View your AI-powered interview performance and ranking
          </p>
        </div>

        {/* Results Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Latest Interview Performance</h2>
              <div className="text-sm text-muted-foreground">
                {formatDate(selectedResult?.completedAt)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(selectedResult?.overallScore)}`}>
                  {selectedResult?.overallScore}
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className={`text-lg font-bold ${
                  selectedResult?.recommendation === 'Strong Hire' ? 'text-green-600' :
                  selectedResult?.recommendation === 'Hire' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {selectedResult?.recommendation}
                </div>
                <div className="text-sm text-muted-foreground">Recommendation</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-lg font-bold text-foreground">{selectedResult?.levelRecommendation}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-lg font-bold text-foreground">
                  {selectedResult?.technicalSkills?.score}/10
                </div>
                <div className="text-sm text-muted-foreground">Technical</div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium text-card-foreground mb-2">AI Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedResult?.summary}
              </p>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Your Ranking</h3>
            
            {userRanking && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">#{userRanking.rank}</div>
                  <div className="text-sm text-muted-foreground">
                    out of {userRanking.totalCandidates} candidates
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{userRanking.percentile}th</div>
                  <div className="text-sm text-muted-foreground">percentile</div>
                </div>
                
                {userRanking.topPerformer && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <Icon name="Trophy" size={20} className="text-yellow-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-yellow-800">Top 10% Performer!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Key Strengths</h3>
            <ul className="space-y-2">
              {selectedResult?.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Areas for Improvement</h3>
            <ul className="space-y-2">
              {selectedResult?.areasForImprovement?.map((area, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Personalized Feedback */}
        {selectedResult?.personalizedFeedback && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Personalized Feedback</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Motivational Message</h4>
                <p className="text-sm text-blue-800">{selectedResult.personalizedFeedback.motivationalMessage}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Career Advice</h4>
                <p className="text-sm text-green-800">{selectedResult.personalizedFeedback.careerAdvice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Question-wise Performance */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Question-wise Performance</h3>
          <div className="space-y-4">
            {selectedResult?.interviewAnswers?.map((answer, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">
                    Question {index + 1} ({answer.difficulty})
                  </span>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreBg(answer.aiEvaluation?.score || 0)} ${getScoreColor(answer.aiEvaluation?.score || 0)}`}>
                    {answer.aiEvaluation?.score || 0}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{answer.question}</p>
                <p className="text-xs text-muted-foreground">{answer.aiEvaluation?.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="default"
            onClick={handleRetakeInterview}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Take Another Interview
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            iconName="Download"
            iconPosition="left"
          >
            Download Results
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            iconName="LogOut"
            iconPosition="left"
          >
            Logout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InterviewResultsPage;