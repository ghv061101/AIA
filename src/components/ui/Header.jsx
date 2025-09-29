import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ isAuthenticated = false, userRole = null, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const renderLogo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={24} color="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-foreground">AI Interview</span>
        <span className="text-sm text-muted-foreground -mt-1">Assistant</span>
      </div>
    </div>
  );

  const renderAuthenticatedNav = () => {
    if (userRole === 'interviewer') {
      return (
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavigation('/interviewer-dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/interviewer-dashboard')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation('/interviews')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/interviews')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Interviews
          </button>
          <button
            onClick={() => handleNavigation('/candidates')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/candidates')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => handleNavigation('/analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/analytics')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Analytics
          </button>
        </nav>
      );
    }

    if (userRole === 'candidate') {
      return (
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleNavigation('/interviewee-chat-interface')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/interviewee-chat-interface')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Interview
          </button>
          <button
            onClick={() => handleNavigation('/profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActivePath('/profile')
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            Profile
          </button>
        </nav>
      );
    }

    return null;
  };

  const renderUserActions = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => handleNavigation('/login')}
            className="hidden sm:flex"
          >
            Sign In
          </Button>
          <Button
            variant="default"
            onClick={() => handleNavigation('/signup')}
            className="hidden sm:flex"
          >
            Sign Up
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
          
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation('/notifications')}
            >
              <Icon name="Bell" size={20} />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <Icon name="ChevronDown" size={16} />
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-modal z-50 animate-slide-in">
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="User" size={16} className="mr-3" />
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={() => handleNavigation('/help')}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="HelpCircle" size={16} className="mr-3" />
                      Help
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div 
            className="cursor-pointer"
            onClick={() => handleNavigation(isAuthenticated ? (userRole === 'interviewer' ? '/interviewer-dashboard' : '/interviewee-chat-interface') : '/')}
          >
            {renderLogo()}
          </div>
          
          {renderAuthenticatedNav()}
          {renderUserActions()}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-16 right-0 left-0 bg-background border-b border-border shadow-modal animate-slide-in">
            <div className="container px-6 py-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {userRole === 'interviewer' && (
                    <>
                      <button
                        onClick={() => handleNavigation('/interviewer-dashboard')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/interviewer-dashboard')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="BarChart3" size={20} className="mr-3" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation('/interviews')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/interviews')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="MessageSquare" size={20} className="mr-3" />
                        Interviews
                      </button>
                      <button
                        onClick={() => handleNavigation('/candidates')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/candidates')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="Users" size={20} className="mr-3" />
                        Candidates
                      </button>
                      <button
                        onClick={() => handleNavigation('/analytics')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/analytics')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="TrendingUp" size={20} className="mr-3" />
                        Analytics
                      </button>
                    </>
                  )}
                  
                  {userRole === 'candidate' && (
                    <>
                      <button
                        onClick={() => handleNavigation('/interviewee-chat-interface')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/interviewee-chat-interface')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="MessageSquare" size={20} className="mr-3" />
                        Interview
                      </button>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-md transition-colors duration-200 ${
                          isActivePath('/profile')
                            ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name="User" size={20} className="mr-3" />
                        Profile
                      </button>
                    </>
                  )}
                  
                  <hr className="border-border" />
                  
                  <button
                    onClick={() => handleNavigation('/notifications')}
                    className="flex items-center w-full px-4 py-3 text-left rounded-md text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="Bell" size={20} className="mr-3" />
                    Notifications
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="flex items-center w-full px-4 py-3 text-left rounded-md text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="Settings" size={20} className="mr-3" />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/help')}
                    className="flex items-center w-full px-4 py-3 text-left rounded-md text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="HelpCircle" size={20} className="mr-3" />
                    Help
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-left rounded-md text-destructive hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={20} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/login')}
                    fullWidth
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleNavigation('/signup')}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;