import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const CredentialCard = ({ cred, copyToClipboard }) => {
  return (
    <div className="space-y-3 p-3 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-foreground">{cred.role} Account</h4>
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon
            name={cred.role === "Interviewer" ? "UserCheck" : "User"}
            size={14}
            className="text-primary"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{cred.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded border">
          <span className="text-xs text-foreground font-mono">{cred.email}</span>
          <button
            onClick={() => copyToClipboard(cred.email)}
            className="p-1 hover:bg-muted rounded transition-colors duration-200"
            title="Copy email"
          >
            <Icon name="Copy" size={12} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 bg-muted/50 rounded border">
          <span className="text-xs text-foreground font-mono">{cred.password}</span>
          <button
            onClick={() => copyToClipboard(cred.password)}
            className="p-1 hover:bg-muted rounded transition-colors duration-200"
            title="Copy password"
          >
            <Icon name="Copy" size={12} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toast, setToast] = useState("");

  const mockCredentials = [
    {
      role: "Interviewer",
      email: "interviewer@aiinterview.com",
      password: "interviewer123",
      description: "Access the interviewer dashboard with candidate management and analytics (Demo Account)",
    },
    {
      role: "Candidate",
      email: "candidate@example.com",
      password: "candidate123",
      description: "Experience the candidate interview interface with AI-powered questions (Demo Account)",
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)?.then(() => {
      setToast("Copied to clipboard!");
      setTimeout(() => setToast(""), 1500);
    });
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-sm"
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
      >
        Demo Credentials
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg border border-border animate-slide-in">
          <p className="text-xs text-muted-foreground text-center">
            Use these credentials to explore different user experiences
          </p>

          {mockCredentials.map((cred) => (
            <CredentialCard key={cred.role} cred={cred} copyToClipboard={copyToClipboard} />
          ))}

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Click the copy icons to quickly fill the login form
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;
