import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";
import indexedDBService from "../../../services/indexedDB";

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  // Mock credentials for demo purposes
  const demoCredentials = [
    {
      email: "interviewer@aiinterview.com",
      password: "interviewer123",
      role: "interviewer",
    },
    {
      email: "candidate@example.com", 
      password: "candidate123",
      role: "candidate",
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // First try to authenticate with IndexedDB
      let user = null;
      
      try {
        user = await indexedDBService.authenticateUser(formData.email, formData.password);
      } catch (error) {
        // If IndexedDB authentication fails, check demo credentials
        const demoUser = demoCredentials.find(
          (cred) => cred.email === formData.email && cred.password === formData.password
        );
        
        if (demoUser) {
          // Create demo user in IndexedDB if it doesn't exist
          try {
            const existingUser = await indexedDBService.getUserByEmail(formData.email);
            if (!existingUser) {
              const newUser = await indexedDBService.createUser({
                firstName: demoUser.role === 'interviewer' ? 'Demo' : 'Test',
                lastName: demoUser.role === 'interviewer' ? 'Interviewer' : 'Candidate',
                email: demoUser.email,
                password: demoUser.password,
                role: demoUser.role,
                company: demoUser.role === 'interviewer' ? 'AI Interview Corp' : 'Tech Company',
                jobTitle: demoUser.role === 'interviewer' ? 'Senior Interviewer' : 'Software Developer',
                experience: demoUser.role === 'candidate' ? '3-5' : '',
                bio: `Demo ${demoUser.role} account for testing purposes.`,
                skills: demoUser.role === 'candidate' ? ['JavaScript', 'React', 'Node.js'] : [],
                profileComplete: true
              });
              user = newUser;
            } else {
              user = existingUser;
            }
          } catch (createError) {
            console.error('Error creating demo user:', createError);
            throw new Error('Authentication failed');
          }
        } else {
          throw new Error('Invalid email or password');
        }
      }

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Store user session
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem(
        "aiInterviewUser",
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          profileComplete: user.profileComplete,
          loginTime: new Date().toISOString(),
        })
      );

      onLogin?.(user);
      showToast("Login successful!");

      // Check if user has interview results to show
      const userResultsHistory = JSON.parse(localStorage.getItem(`user_interviews_${user.id}`) || '[]');
      
      // Navigate based on role and profile completion
      if (user.role === "interviewer") {
        navigate("/interviewer-dashboard");
      } else if (userResultsHistory.length > 0) {
        // Candidate with interview results - show results page
        navigate("/interview-results");
      } else if (user.profileComplete) {
        navigate("/interviewee-chat-interface");
      } else {
        navigate("/profile");
      }
      
    } catch {
      setErrors({ general: error.message || "An error occurred during login" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showToast("Password reset link sent to your email!");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <Icon
              name="AlertCircle"
              size={20}
              className="text-red-500 mr-3 flex-shrink-0"
            />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-1"
                tabIndex={-1}
              >
                <Icon
                  name={showPassword ? "EyeOff" : "Eye"}
                  size={16}
                  className="text-muted-foreground"
                />
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          fullWidth
          className="h-12"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
