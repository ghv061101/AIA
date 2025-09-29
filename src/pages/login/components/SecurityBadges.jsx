import React from "react";
import Icon from "../../../components/AppIcon";

const BadgeCard = ({ feature }) => (
  <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mb-2">
      <Icon name={feature.icon} size={16} className="text-success" />
    </div>
    <p className="text-xs font-medium text-foreground mb-1">{feature.text}</p>
    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
  </div>
);

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      text: "SSL Encrypted",
      description: "Your data is protected with 256-bit SSL encryption",
    },
    {
      icon: "Lock",
      text: "Privacy Protected",
      description: "We never share your personal information",
    },
    {
      icon: "Eye",
      text: "GDPR Compliant",
      description: "Full compliance with data protection regulations",
    },
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground font-medium">
          Your security is our priority
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {securityFeatures.map((feature) => (
          <BadgeCard key={feature.text} feature={feature} />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Protected by industry-standard security measures
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;
