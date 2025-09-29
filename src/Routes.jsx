import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop.jsx";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import IntervieweeChatInterface from './pages/interviewee-chat-interface';
import InterviewerDashboard from './pages/interviewer-dashboard';
import CandidateDetailView from './pages/interviewer-dashboard/components/CandidateDetailView';
import SignupPage from './pages/signup';
import ProfilePage from './pages/profile';
import InterviewResultsPage from './pages/interview-results';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<IntervieweeChatInterface />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/interviewee-chat-interface" element={<IntervieweeChatInterface />} />
          <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
          <Route path="/interview-results" element={<InterviewResultsPage />} />
          <Route path="/candidate-detail/:candidateId" element={<CandidateDetailView />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;