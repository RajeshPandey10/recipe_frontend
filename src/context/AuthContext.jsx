import { createContext, useEffect, useState } from "react";
import summaryApi, { API } from "../../api/summaryApi";
import { toast } from "react-toastify";
console.log("DEBUG API in AuthContext:", API);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      summaryApi.getMe().then((res) => {
        setUser(res.data);
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await summaryApi.login(email, password);
      localStorage.setItem("token", res.data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data);
      toast.success("Login successful!", { position: "top-center" });
    } catch (err) {
      let msg = "Login failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      toast.error(msg, { position: "top-center" });
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await summaryApi.register(username, email, password);
      localStorage.setItem("token", res.data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data);
      toast.success("Registration successful!", { position: "top-center" });
    } catch (err) {
      let msg = "Registration failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      toast.error(msg, { position: "top-center" });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
