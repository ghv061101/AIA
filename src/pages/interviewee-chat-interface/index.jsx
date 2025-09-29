import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatMessage from './components/ChatMessage';
import ProgressIndicator from './components/ProgressIndicator';
import QuestionTimer from './components/QuestionTimer';
import ResumeUpload from './components/ResumeUpload';
import ChatInput from './components/ChatInput';
import WelcomeBackModal from './components/WelcomeBackModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { generateInterviewQuestions, evaluateAnswer, analyzeResume } from '../../services/openaiService';

const IntervieweeChatInterface = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Core state
  const [currentPhase, setCurrentPhase] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Interview state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    phone: '',
    resumeFile: null
  });
  const [missingFields, setMissingFields] = useState([]);
  const [currentMissingField, setCurrentMissingField] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [finalResults, setFinalResults] = useState(null);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);

  // Static fallback questions
  const fallbackQuestions = [
    {
      id: crypto.randomUUID(),
      difficulty: 'Easy',
      timeLimit: 300,
      question: "What is the difference between let, const, and var in JavaScript? Provide examples of when you would use each."
    },
    {
      id: crypto.randomUUID(),
      difficulty: 'Easy',
      timeLimit: 300,
      question: "Explain what React hooks are and name three commonly used hooks with their purposes."
    },
    {
      id: crypto.randomUUID(),
      difficulty: 'Medium',
      timeLimit: 480,
      question: "How would you implement state management in a React application? Compare useState, useContext, and Redux approaches."
    },
    {
      id: crypto.randomUUID(),
      difficulty: 'Medium',
      timeLimit: 480,
      question: "Describe the Node.js event loop and how it handles asynchronous operations. What are callbacks, promises, and async/await?"
    },
    {
      id: crypto.randomUUID(),
      difficulty: 'Hard',
      timeLimit: 600,
      question: "Design a RESTful API for a blog application with authentication. Include endpoints, HTTP methods, status codes, and explain your database schema design."
    },
    {
      id: crypto.randomUUID(),
      difficulty: 'Hard',
      timeLimit: 600,
      question: "Implement a custom React hook for debouncing user input. Explain how you would optimize a React application for performance, including code splitting and memoization."
    }
  ];

  // Get current questions
  const getCurrentQuestions = () => {
    return dynamicQuestions?.length > 0 ? dynamicQuestions : fallbackQuestions;
  };

  // Session management
  useEffect(() => {
    const savedSession = localStorage.getItem('interviewSession');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData?.phase !== 'completed') {
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    } else {
      initializeInterview();
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save session
  useEffect(() => {
    const sessionData = {
      phase: currentPhase,
      currentQuestion,
      candidateInfo,
      messages,
      interviewAnswers,
      dynamicQuestions,
      lastActivity: Date.now()
    };
    localStorage.setItem('interviewSession', JSON.stringify(sessionData));
  }, [currentPhase, currentQuestion, candidateInfo, messages, interviewAnswers, dynamicQuestions]);

  const initializeInterview = () => {
    const welcomeMessage = {
      id: crypto.randomUUID(),
      content: `Welcome to your AI-powered technical interview! 🚀\n\nI'm your AI interviewer, and I'll guide you through this process step by step.\n\nHere's what we'll do:\n1. Upload your resume (PDF or DOCX)\n2. Collect any missing information\n3. Complete 6 personalized technical questions\n4. Receive your AI-powered evaluation\n\nLet's get started!`,
      isAI: true,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setCurrentPhase('upload');

    setTimeout(() => {
      addAIMessage("Please upload your resume to begin. I'll analyze your skills and generate personalized interview questions tailored to your experience.");
    }, 1500);
  };

  const addAIMessage = (content) => {
    const message = {
      id: crypto.randomUUID(),
      content,
      isAI: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content) => {
    const message = {
      id: crypto.randomUUID(),
      content,
      isAI: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleResumeUpload = async (file) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addUserMessage(`Resume uploaded: ${file?.name}`);
      addAIMessage("Analyzing your resume with AI... This will help me create personalized interview questions tailored to your experience.");

      const mockResumeText = `John Smith
      Software Developer
      Email: john.smith@email.com
      Experience: React, Node.js, MongoDB, Redux`;

      let analyzedData;
      try {
        analyzedData = await analyzeResume(mockResumeText);
        addAIMessage(`Great! I've analyzed your resume using AI. Key Skills: ${analyzedData?.skills?.technical?.slice(0, 4)?.join(', ')}`);
        const questions = [];
        const difficulties = ['Easy','Easy','Medium','Medium','Hard','Hard'];

        for (let i=0;i<6;i++){
          try{
            const generatedQuestions = await generateInterviewQuestions(analyzedData,difficulties[i],1);
            if(generatedQuestions?.length>0){
              questions.push({...generatedQuestions[0], timeLimit: difficulties[i]==='Easy'?300:difficulties[i]==='Medium'?480:600});
            }
          }catch(err){
            console.error(`Error generating question ${i+1}:`,err);
            questions.push(fallbackQuestions[i]);
          }
        }

        if(questions.length>0){
          setDynamicQuestions(questions);
          addAIMessage("Personalized interview questions generated based on your resume.");
        }
      }catch(error){
        console.error('Error analyzing resume:',error);
        addAIMessage("We'll collect some basic information manually.");
        analyzedData = {contactInfo:{name:"John Smith",email:"john.smith@email.com",phone:""}};
      }

      setCandidateInfo(prev=>({
        ...prev,
        name: analyzedData?.contactInfo?.name || "John Smith",
        email: analyzedData?.contactInfo?.email || "john.smith@email.com",
        phone: analyzedData?.contactInfo?.phone || "",
        resumeFile: file,
        skills: analyzedData?.skills?.technical || []
      }));

      const missing = [];
      if(!analyzedData?.contactInfo?.name) missing.push('name');
      if(!analyzedData?.contactInfo?.email) missing.push('email');
      if(!analyzedData?.contactInfo?.phone) missing.push('phone');
      setMissingFields(missing);

      if(missing.length>0){
        setCurrentPhase('info');
        setTimeout(()=>{addAIMessage("Please provide your phone number:")},1000);
      }else{
        startInterview();
      }

    } catch(err){
      console.error('Error processing resume:',err);
      addAIMessage("Issue processing resume. Proceeding manually.");
      setCurrentPhase('info');
    }finally{
      setIsLoading(false);
    }
  };

  const handleInfoCollection = (response)=>{
    if(currentMissingField<missingFields.length){
      const field = missingFields[currentMissingField];
      setCandidateInfo(prev=>({...prev,[field]:response}));
      addUserMessage(response);

      if(currentMissingField<missingFields.length-1){
        setCurrentMissingField(prev=>prev+1);
        const nextField = missingFields[currentMissingField+1];
        setTimeout(()=>addAIMessage(`Thank you! Now please provide your ${nextField}:`),500);
      }else{
        setTimeout(()=>{
          addAIMessage("All information collected. Let's begin your interview.");
          setTimeout(()=>startInterview(),1500);
        },500);
      }
    }
  };

  const startInterview = ()=>{
    setCurrentPhase('interview');
    setCurrentQuestion(1);
    setTimeout(()=>{
      const questions = getCurrentQuestions();
      const firstQuestion = questions[0];
      const questionType = dynamicQuestions.length>0?'AI-generated':'standard';
      addAIMessage(`Question 1 of 6 (${firstQuestion.difficulty}): ${firstQuestion.question} You have ${Math.floor(firstQuestion.timeLimit/60)} minutes. Type: ${questionType}`);
      setTimerActive(true);
    },1000);
  };

  const handleInterviewAnswer = async(answer)=>{
    setTimerActive(false);
    addUserMessage(answer);
    const questions = getCurrentQuestions();
    const currentQ = questions[currentQuestion-1];

    setIsLoading(true);
    addAIMessage("Analyzing your response...");

    try{
      const evaluation = await evaluateAnswer(currentQ.question,answer,currentQ.difficulty);
      const answerData = {questionId:currentQ.id,question:currentQ.question,answer,difficulty:currentQ.difficulty,timeUsed:currentQ.timeLimit,timestamp:new Date(),aiEvaluation:evaluation};
      setInterviewAnswers(prev=>[...prev,answerData]);

      setTimeout(()=>{
        addAIMessage(`✅ AI Analysis: Score ${evaluation?.score}/100. Feedback: ${evaluation?.feedback?.substring(0,200)}`);
        if(currentQuestion<questions.length){
          setTimeout(()=>{
            const nextQuestion = questions[currentQuestion];
            setCurrentQuestion(prev=>prev+1);
            const questionType = dynamicQuestions.length>0?'AI-generated':'standard';
            addAIMessage(`Question ${currentQuestion+1} of 6 (${nextQuestion.difficulty}): ${nextQuestion.question}. You have ${Math.floor(nextQuestion.timeLimit/60)} minutes. Type: ${questionType}`);
            setTimerActive(true);
          },3000);
        }else{
          completeInterview();
        }
      },2000);
      setIsLoading(false);

    }catch(err){
      console.error('Error evaluating answer:',err);
      const answerData = {questionId:currentQ.id,question:currentQ.question,answer,difficulty:currentQ.difficulty,timeUsed:currentQ.timeLimit,timestamp:new Date()};
      setInterviewAnswers(prev=>[...prev,answerData]);
      setTimeout(()=>{
        addAIMessage("Thank you! Moving to next question...");
        if(currentQuestion<questions.length){
          setTimeout(()=>{
            const nextQuestion = questions[currentQuestion];
            setCurrentQuestion(prev=>prev+1);
            addAIMessage(`Question ${currentQuestion+1} of 6 (${nextQuestion.difficulty}): ${nextQuestion.question}.`);
            setTimerActive(true);
          },2000);
        }else completeInterview();
      },1000);
      setIsLoading(false);
    }
  };

  const handleTimeUp = ()=>{
    setTimerActive(false);
    addAIMessage("Time's up!");
    const questions = getCurrentQuestions();
    const currentQ = questions[currentQuestion-1];
    const answerData = {questionId:currentQ.id,question:currentQ.question,answer:"(No answer provided - time expired)",difficulty:currentQ.difficulty,timeUsed:currentQ.timeLimit,timestamp:new Date()};
    setInterviewAnswers(prev=>[...prev,answerData]);

    if(currentQuestion<questions.length){
      setTimeout(()=>{
        const nextQuestion = questions[currentQuestion];
        setCurrentQuestion(prev=>prev+1);
        addAIMessage(`Question ${currentQuestion+1} of 6 (${nextQuestion.difficulty}): ${nextQuestion.question}.`);
        setTimerActive(true);
      },2000);
    }else completeInterview();
  };

  const completeInterview = async ()=>{
    setCurrentPhase('completed');
    setIsGeneratingResults(true);
    addAIMessage("🎉 Interview completed. Generating evaluation report...");

    try{
      const summary = await generateInterviewSummary(interviewAnswers,candidateInfo);
      const feedback = await generatePersonalizedFeedback(summary,candidateInfo);
      const results = {...summary,personalizedFeedback:feedback,candidateInfo,interviewAnswers,completedAt:new Date().toISOString(),sessionId:crypto.randomUUID()};
      setFinalResults(results);

      const userSession = JSON.parse(sessionStorage.getItem('aiInterviewUser')||'{}');
      const resultsKey = `interview_results_${userSession.id}_${results.sessionId}`;
      localStorage.setItem(resultsKey,JSON.stringify(results));

      const userResultsHistory = JSON.parse(localStorage.getItem(`user_interviews_${userSession.id}`)||'[]');
      userResultsHistory.push({sessionId:results.sessionId,completedAt:results.completedAt,overallScore:results.overallScore,recommendation:results.recommendation});
      localStorage.setItem(`user_interviews_${userSession.id}`,JSON.stringify(userResultsHistory));

      addAIMessage(`✅ Analysis Complete! Overall Score: ${results.overallScore}/100. Recommendation: ${results.recommendation}`);
      setTimeout(()=>{
        addAIMessage("Redirecting to login page in 10 seconds.");
        setTimeout(()=>{
          sessionStorage.removeItem('aiInterviewUser');
          localStorage.removeItem('interviewSession');
          navigate('/login');
        },10000);
      },3000);
    }catch(err){
      console.error('Error generating final results:',err);
      addAIMessage("❌ Error generating results. Contact support.");
    }finally{
      setIsGeneratingResults(false);
    }
  };

  const handleResumeSession = ()=>{
    const savedSession = localStorage.getItem('interviewSession');
    if(savedSession){
      try{
        const sessionData = JSON.parse(savedSession);
        setCurrentPhase(sessionData.phase);
        setCurrentQuestion(sessionData.currentQuestion);
        setCandidateInfo(sessionData.candidateInfo);
        setMessages(sessionData.messages);
        setInterviewAnswers(sessionData.interviewAnswers);
        setDynamicQuestions(sessionData.dynamicQuestions||[]);
        if(sessionData.phase==='interview') setTimerActive(true);
      }catch(err){
        console.error('Error resuming session:',err);
        initializeInterview();
      }
    }
    setShowWelcomeModal(false);
  };

  const handleStartNewSession = ()=>{
    localStorage.removeItem('interviewSession');
    setShowWelcomeModal(false);
    initializeInterview();
  };

  const getCurrentStepInfo = ()=>{
    switch(currentPhase){
      case 'upload': return {step:1,total:8,phase:'upload'};
      case 'info': return {step:2,total:8,phase:'info'};
      case 'interview': return {step:2+currentQuestion,total:8,phase:'interview'};
      case 'completed': return {step:8,total:8,phase:'completed'};
      default: return {step:1,total:8,phase:'upload'};
    }
  };

  const renderMainContent = ()=>{
    if(currentPhase==='upload' && messages.length<=2){
      return <div className="flex-1 flex items-center justify-center p-6">
        <ResumeUpload onUpload={handleResumeUpload} isUploading={isLoading}/>
      </div>
    }
    return <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map(msg=><ChatMessage key={msg.id} message={msg.content} isAI={msg.isAI} timestamp={msg.timestamp}/>)}
      {isLoading && <div className="flex justify-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} color="white"/>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-3">
            <div className="flex items-center space-x-2">
              <Icon name="Sparkles" size={16} className="animate-pulse text-primary"/>
              <span className="text-sm text-muted-foreground">AI is analyzing...</span>
            </div>
          </div>
        </div>
      </div>}
      <div ref={messagesEndRef}/>
    </div>
  };

  const canSendMessage = ()=>!isLoading && currentPhase!=='completed' && currentPhase!=='upload' && !(currentPhase==='interview'&&!timerActive);

  const handleSendMessage = (msg)=>{
    if(currentPhase==='info') handleInfoCollection(msg);
    else if(currentPhase==='interview') handleInterviewAnswer(msg);
  };

  const getInputPlaceholder = ()=>{
    if(currentPhase==='info') return `Enter your ${missingFields[currentMissingField]}...`;
    if(currentPhase==='interview') return "Type your detailed answer here... (AI will analyze your response)";
    if(currentPhase==='completed') return "Interview completed - AI analysis available";
    return "Type your response...";
  };

  const stepInfo = getCurrentStepInfo();
  const questions = getCurrentQuestions();

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} userRole="candidate" onLogout={()=>navigate('/login')}/>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <ProgressIndicator currentStep={stepInfo.step} totalSteps={stepInfo.total} phase={stepInfo.phase}/>
        {currentPhase==='interview' && timerActive && <div className="px-6 pt-4">
          <QuestionTimer timeLimit={questions[currentQuestion-1]?.timeLimit || 300} isActive={timerActive} onTimeUp={handleTimeUp} difficulty={questions[currentQuestion-1]?.difficulty || 'Easy'} questionNumber={currentQuestion}/>
        </div>}
        {renderMainContent()}
        {(currentPhase==='info'||currentPhase==='interview') && <ChatInput onSendMessage={handleSendMessage} disabled={!canSendMessage()} placeholder={getInputPlaceholder()} maxLength={currentPhase==='interview'?3000:500}/>}
        {currentPhase==='completed' && <div className="p-6 bg-card border-t border-border flex items-center justify-center space-x-4">
          <Button variant="outline" onClick={()=>navigate('/interviewer-dashboard')} iconName="BarChart3" iconPosition="left">View AI Analysis</Button>
          <Button variant="default" onClick={handleStartNewSession} iconName="RefreshCw" iconPosition="left">Start New Interview</Button>
        </div>}
      </div>
      <WelcomeBackModal isOpen={showWelcomeModal} onResume={handleResumeSession} onStartNew={handleStartNewSession} sessionData={{phase:currentPhase,currentQuestion,totalQuestions:questions.length,lastActivity:Date.now(),interviewAnswers}}/>
    </div>
  );
};

export default IntervieweeChatInterface;
