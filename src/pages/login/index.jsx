import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import WelcomeSection from './components/WelcomeSection';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkExistingSession = () => {
      const sessionUser = sessionStorage.getItem('aiInterviewUser');
      const localUser = localStorage.getItem('aiInterviewUser');
      
      if (sessionUser || localUser) {
        const user = JSON.parse(sessionUser || localUser);
        
        // Navigate to appropriate dashboard
        if (user?.role === 'interviewer') {
          navigate('/interviewer-dashboard');
        } else {
          navigate('/interviewee-chat-interface');
        }
        return;
      }
      
      setIsLoading(false);
    };

    // Simulate loading delay for better UX
    const timer = setTimeout(checkExistingSession, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogin = (user) => {
    // This is handled in the LoginForm component
    // but we can add additional logic here if needed
    console.log('User logged in:', user);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto animate-pulse">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
            {/* Left Column - Welcome Section */}
            <div className="space-y-8">
              <WelcomeSection />
              
              {/* Additional Info Section */}
              <div className="hidden lg:block space-y-6">
                <div className="p-6 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4">
                    Platform Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">10K+</p>
                      <p className="text-sm text-muted-foreground">Interviews Conducted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">95%</p>
                      <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">500+</p>
                      <p className="text-sm text-muted-foreground">Companies Trust Us</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">24/7</p>
                      <p className="text-sm text-muted-foreground">Platform Availability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Sign In
                    </h2>
                    <p className="text-muted-foreground">
                      Access your AI Interview Assistant account
                    </p>
                  </div>

                  <LoginForm onLogin={handleLogin} />
                  
                  <CredentialsHelper />
                </div>
              </div>

              <SecurityBadges />

              {/* Mobile Statistics */}
              <div className="lg:hidden">
                <div className="p-6 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4 text-center">
                    Trusted by Professionals
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary">10K+</p>
                      <p className="text-xs text-muted-foreground">Interviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-success">95%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} AI Interview Assistant. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;