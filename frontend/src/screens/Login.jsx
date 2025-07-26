import React, {  useContext, useState, } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios.js";
import { UserContext } from "../context/user.context.jsx";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");


  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    axios.post("/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token",res.data.token)
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Login</h2>
        {error && (
          <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
