import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context.jsx";
import axios from "../config/axios.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: "Very Weak", color: "text-red-400" };
      case 2: return { text: "Weak", color: "text-orange-400" };
      case 3: return { text: "Medium", color: "text-yellow-400" };
      case 4: return { text: "Strong", color: "text-green-400" };
      case 5: return { text: "Very Strong", color: "text-green-500" };
      default: return { text: "", color: "" };
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.name.length < 3) {
      setError("Name must be at least 3 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { name, email, password } = formData;
    
    axios.post('/users/register', { name, email, password })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate('/home');
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.errors?.[0]?.msg || 
                           err.response?.data?.message || 
                           "Registration failed. Please try again.";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const passwordStrengthInfo = getPasswordStrengthText();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300">Join CollabSpace and start collaborating</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-center text-sm">
            {error}
          </div>
        )}
        
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium text-gray-200">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
            placeholder="Enter your email"
            required
          />
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium text-gray-200">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
            placeholder="Create a password"
            required
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${passwordStrengthInfo.color}`}>
                  {passwordStrengthInfo.text}
                </span>
                <span className="text-gray-400">
                  {passwordStrength}/5
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength <= 1 ? 'bg-red-500' :
                    passwordStrength === 2 ? 'bg-orange-500' :
                    passwordStrength === 3 ? 'bg-yellow-500' :
                    passwordStrength === 4 ? 'bg-green-500' : 'bg-green-600'
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-200">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
            placeholder="Confirm your password"
            required
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
            <p className="text-green-400 text-xs mt-1 flex items-center">
              <i className="ri-check-line mr-1"></i>
              Passwords match
            </p>
          )}
        </div>
        
        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
            <input 
              type="checkbox" 
              required
              className="mt-1 w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || formData.password !== formData.confirmPassword}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
        
        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        
        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-300 text-sm hover:underline transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </form>

      {/* Custom Styles */}
      <style >{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;