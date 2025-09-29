import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics }) => {
  const metricCards = [
    {
      title: "Total Candidates",
      value: metrics?.totalCandidates,
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Average Score",
      value: `${metrics?.averageScore}%`,
      icon: "TrendingUp",
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+5.2%",
      changeType: "positive"
    },
    {
      title: "Completion Rate",
      value: `${metrics?.completionRate}%`,
      icon: "CheckCircle",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "-2.1%",
      changeType: "negative"
    },
    {
      title: "Active Interviews",
      value: metrics?.activeInterviews,
      icon: "Clock",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "3 ongoing",
      changeType: "neutral"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${metric?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={metric?.icon} size={24} className={metric?.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric?.title}</p>
                <p className="text-2xl font-bold text-card-foreground">{metric?.value}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              metric?.changeType === 'positive' ? 'text-green-600' : 
              metric?.changeType === 'negative'? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {metric?.changeType === 'positive' && <Icon name="TrendingUp" size={16} className="inline mr-1" />}
              {metric?.changeType === 'negative' && <Icon name="TrendingDown" size={16} className="inline mr-1" />}
              {metric?.change}
            </span>
            <span className="text-sm text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;