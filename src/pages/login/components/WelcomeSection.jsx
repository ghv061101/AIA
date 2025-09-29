import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = () => {
  const features = [
    {
      icon: 'Brain',
      title: 'AI-Powered Interviews',
      description: 'Advanced AI technology for comprehensive candidate evaluation'
    },
    {
      icon: 'Clock',
      title: 'Timed Assessments',
      description: 'Structured timing for fair and consistent evaluations'
    },
    {
      icon: 'BarChart3',
      title: 'Real-time Analytics',
      description: 'Instant insights and detailed performance metrics'
    },
    {
      icon: 'Users',
      title: 'Dual Interface',
      description: 'Separate optimized experiences for candidates and interviewers'
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
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
          <h2 className="text-xl font-semibold text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sign in to access your AI-powered interview platform and streamline your technical hiring process.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={feature?.icon} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-foreground text-sm mb-1">
                  {feature?.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;