import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/ui/Header';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { generateInterviewSummary, generatePersonalizedFeedback } from '../../../services/openaiService';

const CandidateDetailView = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Mock candidate data (in real app, this would come from an API)
  const mockCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      status: "completed",
      finalScore: 87,
      completionTime: 45,
      interviewDate: "2025-01-25T10:30:00Z",
      currentQuestion: 6,
      summary: `Excellent full-stack developer with strong React and Node.js skills. Demonstrated solid understanding of modern JavaScript concepts, state management, and API integration. Shows great problem-solving abilities and clean coding practices.`,
      questionScores: [
        { 
          difficulty: "Easy", 
          score: 95, 
          feedback: "Perfect understanding of React hooks and component lifecycle",
          question: "Explain the difference between useState and useEffect hooks in React",
          answer: "useState is used for managing local component state and returns an array with the current state value and a function to update it. useEffect is used for side effects like API calls, subscriptions, or manual DOM changes. It runs after render and can clean up with a return function.",
          timeUsed: 120
        },
        { 
          difficulty: "Easy", 
          score: 90, 
          feedback: "Good grasp of JavaScript fundamentals and ES6 features",
          question: "What are the differences between let, const, and var in JavaScript?",
          answer: "var has function scope, let and const have block scope. var can be redeclared, let can be reassigned but not redeclared, const cannot be reassigned or redeclared. let and const are hoisted but not initialized, creating a temporal dead zone.",
          timeUsed: 150
        },
        { 
          difficulty: "Medium", 
          score: 85, 
          feedback: "Solid implementation of state management with Redux",
          question: "How would you implement global state management in a large React application?",
          answer: "I would use Redux with Redux Toolkit for complex state, Context API for simpler global state, or Zustand for a lightweight solution. I'd organize state by domain, use selectors for performance, and implement proper action creators and reducers.",
          timeUsed: 300
        },
        { 
          difficulty: "Medium", 
          score: 80, 
          feedback: "Good API integration skills, minor optimization opportunities",
          question: "Describe your approach to handling API calls and error handling in React",
          answer: "I use custom hooks for API calls, implement proper loading states, handle different error types (network, validation, server), use try-catch blocks, and show user-friendly error messages. I also implement retry logic and caching when appropriate.",
          timeUsed: 280
        },
        { 
          difficulty: "Hard", 
          score: 88, 
          feedback: "Excellent system design thinking and scalability considerations",
          question: "Design a scalable architecture for a real-time chat application",
          answer: "I'd use WebSockets or Socket.io for real-time communication, implement message queuing with Redis, use microservices architecture, implement horizontal scaling with load balancers, add caching layers, and use CDN for media files. Database would be partitioned by chat rooms.",
          timeUsed: 600
        },
        { 
          difficulty: "Hard", 
          score: 85, 
          feedback: "Strong performance optimization techniques demonstrated",
          question: "How would you optimize the performance of a React application rendering large lists?",
          answer: "I'd implement virtualization using react-window, use memo and useMemo for expensive calculations, implement pagination or infinite scrolling, optimize bundle size with code splitting, use proper key props, and implement proper shouldComponentUpdate logic.",
          timeUsed: 480
        }
      ],
      skills: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "JavaScript", level: 88 },
        { name: "TypeScript", level: 75 },
        { name: "MongoDB", level: 70 },
        { name: "Express.js", level: 80 }
      ],
      interviewAnswers: [
        {
          questionId: 1,
          question: "Explain the difference between useState and useEffect hooks in React",
          answer: "useState is used for managing local component state and returns an array with the current state value and a function to update it. useEffect is used for side effects like API calls, subscriptions, or manual DOM changes. It runs after render and can clean up with a return function.",
          difficulty: "Easy",
          timeUsed: 120,
          timestamp: new Date("2025-01-25T10:35:00Z")
        },
        {
          questionId: 2,
          question: "What are the differences between let, const, and var in JavaScript?",
          answer: "var has function scope, let and const have block scope. var can be redeclared, let can be reassigned but not redeclared, const cannot be reassigned or redeclared. let and const are hoisted but not initialized, creating a temporal dead zone.",
          difficulty: "Easy",
          timeUsed: 150,
          timestamp: new Date("2025-01-25T10:38:00Z")
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading candidate data
    setTimeout(() => {
      const foundCandidate = mockCandidates?.find(c => c?.id === parseInt(candidateId));
      setCandidate(foundCandidate);
      setLoading(false);
    }, 1000);
  }, [candidateId]);

  const generateAISummary = async () => {
    if (!candidate?.interviewAnswers || aiSummary) return;
    
    setAiLoading(true);
    try {
      const summary = await generateInterviewSummary(candidate?.interviewAnswers, candidate);
      const feedback = await generatePersonalizedFeedback(summary, candidate);
      
      setAiSummary({
        ...summary,
        personalizedFeedback: feedback
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setAiLoading(false);
    }
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleLogout = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole="interviewer" 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-lg text-foreground">Loading candidate details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole="interviewer" 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Candidate Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested candidate could not be found.</p>
            <Button
              variant="outline"
              onClick={() => navigate('/interviewer-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Dashboard
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
        userRole="interviewer" 
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/interviewer-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="mb-4"
            >
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
                iconName="Printer"
                iconPosition="left"
              >
                Print Report
              </Button>
              <Button
                variant="default"
                onClick={generateAISummary}
                disabled={aiLoading || !!aiSummary}
                iconName={aiLoading ? "Loader2" : "Sparkles"}
                iconPosition="left"
                className={aiLoading ? "animate-pulse" : ""}
              >
                {aiLoading ? 'Generating AI Analysis...' : aiSummary ? 'AI Analysis Complete' : 'Generate AI Analysis'}
              </Button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">{candidate?.name}</h1>
                  <p className="text-muted-foreground">{candidate?.email}</p>
                  <p className="text-sm text-muted-foreground">{candidate?.phone}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  candidate?.status === 'completed' ? 'bg-green-100 text-green-800' :
                  candidate?.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  candidate?.status === 'paused'? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {candidate?.status?.charAt(0)?.toUpperCase() + candidate?.status?.slice(1)}
                </div>
                
                {candidate?.finalScore && (
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-foreground">{candidate?.finalScore}</span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground mt-1">
                  Interviewed: {new Date(candidate?.interviewDate)?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: 'BarChart3' },
                { id: 'questions', label: 'Question Analysis', icon: 'MessageSquare' },
                { id: 'skills', label: 'Skills Assessment', icon: 'Code' },
                { id: 'ai-insights', label: 'AI Insights', icon: 'Sparkles' }
              ]?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{candidate?.finalScore || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{candidate?.completionTime || 'N/A'}m</div>
                      <div className="text-sm text-muted-foreground">Completion Time</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{candidate?.currentQuestion || 0}/6</div>
                      <div className="text-sm text-muted-foreground">Questions Answered</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-foreground">
                        {candidate?.questionScores ? Math.round(candidate?.questionScores?.reduce((sum, q) => sum + q?.score, 0) / candidate?.questionScores?.length) : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                </div>

                {/* Interview Summary */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Interview Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{candidate?.summary}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Easy Questions:</span>
                      <span className="font-medium">
                        {candidate?.questionScores?.filter(q => q?.difficulty === 'Easy')?.length || 0}/2
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium Questions:</span>
                      <span className="font-medium">
                        {candidate?.questionScores?.filter(q => q?.difficulty === 'Medium')?.length || 0}/2
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hard Questions:</span>
                      <span className="font-medium">
                        {candidate?.questionScores?.filter(q => q?.difficulty === 'Hard')?.length || 0}/2
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Interview Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started:</span>
                      <span className="font-medium">
                        {new Date(candidate?.interviewDate)?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${
                        candidate?.status === 'completed' ? 'text-green-600' :
                        candidate?.status === 'in-progress' ? 'text-blue-600' :
                        candidate?.status === 'paused'? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {candidate?.status?.charAt(0)?.toUpperCase() + candidate?.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              {candidate?.questionScores?.map((questionScore, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Question {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          questionScore?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          questionScore?.difficulty === 'Medium'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {questionScore?.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Time: {formatTime(questionScore?.timeUsed || 0)}
                        </span>
                      </div>
                      <h4 className="font-medium text-card-foreground mb-3">
                        {questionScore?.question}
                      </h4>
                    </div>
                    <div className={`text-right ${getScoreBg(questionScore?.score)} px-3 py-1 rounded-lg`}>
                      <div className={`text-lg font-bold ${getScoreColor(questionScore?.score)}`}>
                        {questionScore?.score}
                      </div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-card-foreground mb-2">Answer:</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed bg-muted p-3 rounded">
                      {questionScore?.answer}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-card-foreground mb-2">Feedback:</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {questionScore?.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">Skills Assessment</h3>
              <div className="space-y-6">
                {candidate?.skills?.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-card-foreground">{skill?.name}</span>
                      <span className="text-sm text-muted-foreground">{skill?.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${skill?.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              {!aiSummary && !aiLoading ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="Sparkles" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">AI Analysis Not Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate comprehensive AI insights about this candidate's performance.
                  </p>
                  <Button
                    variant="default"
                    onClick={generateAISummary}
                    iconName="Sparkles"
                    iconPosition="left"
                  >
                    Generate AI Analysis
                  </Button>
                </div>
              ) : aiLoading ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="Loader2" size={48} className="text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Generating AI Analysis...</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing the candidate's responses and performance. This may take a few moments.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Assessment */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Overall Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-foreground">{aiSummary?.overallScore}</div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className={`text-lg font-bold ${
                          aiSummary?.recommendation === 'Strong Hire' ? 'text-green-600' :
                          aiSummary?.recommendation === 'Hire' ? 'text-blue-600' :
                          aiSummary?.recommendation === 'No Hire'? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {aiSummary?.recommendation}
                        </div>
                        <div className="text-sm text-muted-foreground">Recommendation</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground">{aiSummary?.levelRecommendation}</div>
                        <div className="text-sm text-muted-foreground">Level</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground">{aiSummary?.technicalSkills?.score}/10</div>
                        <div className="text-sm text-muted-foreground">Technical</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{aiSummary?.summary}</p>
                  </div>

                  {/* Detailed Assessment */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-3">Technical Skills</h4>
                      <div className="text-2xl font-bold text-foreground mb-2">{aiSummary?.technicalSkills?.score}/10</div>
                      <p className="text-sm text-muted-foreground">{aiSummary?.technicalSkills?.assessment}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-3">Problem Solving</h4>
                      <div className="text-2xl font-bold text-foreground mb-2">{aiSummary?.problemSolving?.score}/10</div>
                      <p className="text-sm text-muted-foreground">{aiSummary?.problemSolving?.assessment}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-3">Communication</h4>
                      <div className="text-2xl font-bold text-foreground mb-2">{aiSummary?.communication?.score}/10</div>
                      <p className="text-sm text-muted-foreground">{aiSummary?.communication?.assessment}</p>
                    </div>
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-4">Key Strengths</h4>
                      <ul className="space-y-2">
                        {aiSummary?.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-4">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {aiSummary?.areasForImprovement?.map((area, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="AlertCircle" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Next Steps and Interviewer Notes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-4">Recommended Next Steps</h4>
                      <ul className="space-y-2">
                        {aiSummary?.nextSteps?.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-4">Interviewer Notes</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary?.interviewerNotes}</p>
                    </div>
                  </div>

                  {/* Personalized Feedback */}
                  {aiSummary?.personalizedFeedback && (
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h4 className="font-semibold text-card-foreground mb-4">Personalized Feedback for Candidate</h4>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 mb-2">Motivational Message</h5>
                          <p className="text-sm text-blue-800">{aiSummary?.personalizedFeedback?.motivationalMessage}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-card-foreground mb-3">Key Strengths</h5>
                            <ul className="space-y-1">
                              {aiSummary?.personalizedFeedback?.keyStrengths?.map((strength, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                                  <Icon name="Star" size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-card-foreground mb-3">Development Areas</h5>
                            <div className="space-y-3">
                              {aiSummary?.personalizedFeedback?.developmentAreas?.map((area, index) => (
                                <div key={index} className="text-sm">
                                  <div className="font-medium text-card-foreground">{area?.area}</div>
                                  <div className="text-muted-foreground mt-1">
                                    {area?.recommendations?.[0]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-medium text-green-900 mb-2">Career Advice</h5>
                          <p className="text-sm text-green-800">{aiSummary?.personalizedFeedback?.careerAdvice}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CandidateDetailView;