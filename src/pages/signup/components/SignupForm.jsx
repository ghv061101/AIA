import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";
import indexedDBService from "../../../services/indexedDB";

const SignupForm = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
    jobTitle: "",
    experience: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState("");

  const roleOptions = [
    { value: "candidate", label: "Job Candidate" },
    { value: "interviewer", label: "Interviewer/HR" },
    { value: "admin", label: "Administrator" },
  ];

  const experienceOptions = [
    { value: "0-1", label: "0-1 years" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    // Password validation
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Password must contain uppercase, lowercase, and number";

    // Confirm password validation
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // Role validation
    if (!formData.role) newErrors.role = "Please select your role";

    // Terms validation
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if email already exists
      const emailExists = await indexedDBService.emailExists(formData.email);
      if (emailExists) {
        setErrors({ email: "Email already exists" });
        setIsLoading(false);
        return;
      }

      // Create user data
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password, // In production, this should be hashed
        role: formData.role,
        company: formData.company.trim(),
        jobTitle: formData.jobTitle.trim(),
        experience: formData.experience,
        subscribeNewsletter: formData.subscribeNewsletter,
        profilePicture: null,
        bio: "",
        skills: [],
        preferences: {
          notifications: true,
          emailUpdates: formData.subscribeNewsletter,
          theme: "light",
        },
      };

      // Create user in IndexedDB
      const newUser = await indexedDBService.createUser(userData);

      // Store user session
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        loginTime: new Date().toISOString(),
      };

      sessionStorage.setItem("aiInterviewUser", JSON.stringify(userSession));

      showToast("Account created successfully! Welcome to AI Interview Assistant.", "success");
      onSignup?.(newUser);

      // Navigate based on role
      setTimeout(() => {
        if (newUser.role === "interviewer") {
          navigate("/interviewer-dashboard");
        } else {
          navigate("/profile"); // Go to profile completion first
        }
      }, 1500);

    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: error.message || "Failed to create account" });
      showToast("Failed to create account. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              disabled={isLoading}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              disabled={isLoading}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={isLoading}
            required
          />
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Security</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              disabled={isLoading}
              required
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              disabled={isLoading}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="p-1"
                  tabIndex={-1}
                >
                  <Icon
                    name={showConfirmPassword ? "EyeOff" : "Eye"}
                    size={16}
                    className="text-muted-foreground"
                  />
                </button>
              }
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
          
          <Select
            label="Role"
            options={roleOptions}
            value={formData.role}
            onChange={(value) => handleSelectChange("role", value)}
            placeholder="Select your role"
            error={errors.role}
            disabled={isLoading}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              name="company"
              placeholder="Your current company"
              value={formData.company}
              onChange={handleInputChange}
              error={errors.company}
              disabled={isLoading}
            />

            <Input
              label="Job Title"
              name="jobTitle"
              placeholder="Your current job title"
              value={formData.jobTitle}
              onChange={handleInputChange}
              error={errors.jobTitle}
              disabled={isLoading}
            />
          </div>

          {formData.role === "candidate" && (
            <Select
              label="Years of Experience"
              options={experienceOptions}
              value={formData.experience}
              onChange={(value) => handleSelectChange("experience", value)}
              placeholder="Select your experience level"
              error={errors.experience}
              disabled={isLoading}
            />
          )}
        </div>

        {/* Terms and Preferences */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              error={errors.agreeToTerms}
              disabled={isLoading}
              required
            />

            <Checkbox
              label="Subscribe to newsletter and product updates"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          fullWidth
          className="h-12"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>

      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SignupForm;