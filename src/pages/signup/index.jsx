import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import Icon from '../../components/AppIcon';

const SignupPage = () => {
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

  const handleSignup = (user) => {
    console.log('User signed up:', user);
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Brain" size={28} color="white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">AI Interview</h1>
                <p className="text-lg text-muted-foreground -mt-1">Assistant</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Join AI Interview Assistant
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create your account to access our AI-powered interview platform. 
                Whether you're a candidate looking to practice or an interviewer seeking better insights, 
                we've got you covered.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Brain" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed insights and personalized feedback powered by advanced AI technology.
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={24} className="text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Receive instant feedback and scoring during your interview sessions.
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="BarChart3" size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Reports</h3>
              <p className="text-sm text-muted-foreground">
                Access detailed performance analytics and improvement recommendations.
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <SignupForm onSignup={handleSignup} />
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} className="text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Your Data is Secure</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use industry-standard encryption and security measures to protect your personal information. 
                  Your interview data is stored locally and never shared without your explicit consent.
                </p>
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

export default SignupPage;