import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import summaryApi, { API } from "../../api/summaryApi";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("DEBUG API:", API);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Register error:, ", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <FaSignInAlt className="text-4xl text-blue-500 mb-2" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            Login to <span className="text-blue-400">YouthIt</span>
          </h1>
          <p className="text-gray-500">
            Welcome back! Please login to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaUser /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaLock /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition"
          >
            <FaSignInAlt /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
