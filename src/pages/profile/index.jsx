import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProfileForm from './components/ProfileForm';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import indexedDBService from '../../services/indexedDB';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('aiInterviewUser') || '{}');
      
      if (!sessionUser.id) {
        navigate('/login');
        return;
      }

      const fullUser = await indexedDBService.getUserById(sessionUser.id);
      
      if (!fullUser) {
        setError('User not found');
        return;
      }

      setUser(fullUser);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    
    // Navigate based on role after profile completion
    if (updatedUser.role === 'interviewer') {
      navigate('/interviewer-dashboard');
    } else {
      navigate('/interviewee-chat-interface');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aiInterviewUser');
    localStorage.removeItem('aiInterviewUser');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await indexedDBService.deleteUser(user.id);
        sessionStorage.removeItem('aiInterviewUser');
        localStorage.removeItem('aiInterviewUser');
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole={user?.role} 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-lg text-foreground">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={true} 
          userRole={user?.role} 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true} 
        userRole={user?.role} 
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(user?.role === 'interviewer' ? '/interviewer-dashboard' : '/interviewee-chat-interface')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${user?.profileComplete ? 'bg-success' : 'bg-warning'}`} />
                <div>
                  <span className="font-medium text-foreground">
                    Profile Status: {user?.profileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {user?.profileComplete 
                      ? 'Your profile is complete and ready to use.' 
                      : 'Complete your profile to get the best experience.'
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground">
                <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(user?.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <ProfileForm user={user} onUpdate={handleProfileUpdate} />

        {/* Danger Zone */}
        <div className="mt-12 bg-card border border-destructive/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;