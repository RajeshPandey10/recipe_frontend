import axios from "axios";

const API = axios.create({
  baseURL: "https://recipe-backend-0l2k.onrender.com/api", // Vite proxy will handle localhost:5000
});

const summaryApi = {
  // Auth
  register: (username, email, password) =>
    API.post("/auth/register", { username, email, password }),
  login: (email, password) => API.post("/auth/login", { email, password }),
  getMe: () => API.get("/auth/me"),

  // Recipes
  getRecipes: (category) =>
    API.get(
      `/recipes${category && category !== "All" ? `?category=${category}` : ""}`
    ),
  getRecipe: (id) => API.get(`/recipes/${id}`),
  addRecipe: (formData) =>
    API.post("/recipes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateRecipe: (id, formData) =>
    API.put(`/recipes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteRecipe: (id) => API.delete(`/recipes/${id}`),
};

export { API };
export default summaryApi;
