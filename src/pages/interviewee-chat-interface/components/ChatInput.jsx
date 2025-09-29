import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your response...",
  maxLength = 1000,
  showCharCount = true 
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = maxLength - message?.length;
  const isNearLimit = remainingChars <= 50;

  return (
    <div className="bg-card border-t border-border p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`relative border rounded-lg transition-all duration-200 ${
          isFocused 
            ? 'border-ring shadow-sm' 
            : disabled 
              ? 'border-border bg-muted' :'border-border hover:border-ring/50'
        }`}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled ? "Please wait..." : placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          <div className="absolute right-2 bottom-2">
            <Button
              type="submit"
              size="icon"
              variant={message?.trim() && !disabled ? "default" : "ghost"}
              disabled={!message?.trim() || disabled}
              className="h-8 w-8"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </span>
          </div>
          
          {showCharCount && (
            <span className={`font-mono ${
              isNearLimit ? 'text-warning' : 'text-muted-foreground'
            }`}>
              {remainingChars} characters remaining
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;