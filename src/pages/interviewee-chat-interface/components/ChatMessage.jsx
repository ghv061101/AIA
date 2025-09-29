import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ message, isAI = false, timestamp }) => {
  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isAI ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isAI ? 'bg-primary' : 'bg-secondary'
          }`}>
            <Icon 
              name={isAI ? "Bot" : "User"} 
              size={16} 
              color="white" 
            />
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-lg ${
            isAI 
              ? 'bg-card border border-border text-card-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message}
            </div>
          </div>
          
          {timestamp && (
            <div className="text-xs text-muted-foreground mt-1">
              {formatTime(timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;