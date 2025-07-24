import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUtensils,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaPlus,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FaUtensils className="text-2xl text-white" />
          <span className="text-2xl font-extrabold text-white tracking-tight">
            YouthIt Recipes
          </span>
        </Link>
        <div className="flex gap-x-4 items-center">
          {user ? (
            <>
              <Link to="/add-recipe">
                <button className="flex items-center gap-2 bg-white text-blue-600 font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-50 transition">
                  <FaPlus /> Add Recipe
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="flex items-center gap-2 bg-white text-blue-600 font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-50 transition">
                  <FaSignInAlt /> Login
                </button>
              </Link>
              <Link to="/register">
                <button className="flex items-center gap-2 bg-white text-blue-600 font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-50 transition">
                  <FaUserPlus /> Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
