import React, { useEffect, useState } from "react";
import summaryApi from "../../api/summaryApi";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlus,
  FaTrash,
  FaUtensils,
  FaClock,
  FaImage,
  FaListUl,
  FaChevronLeft,
  FaEdit,
} from "react-icons/fa";

const EditRecipe = () => {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
    category: "",
    photoUrls: [],
    cookingTime: "",
  });
  const { id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    handleInputChange("ingredients", newIngredients);
    const lastIngredient =
      formData.ingredients[formData.ingredients.length - 1];
    if (error && lastIngredient.trim() !== "") {
      setError("");
    }
  };

  const addIngredient = () => {
    const lastIngredient =
      formData.ingredients[formData.ingredients.length - 1];
    if (lastIngredient.trim() !== "") {
      setError("");
      handleInputChange("ingredients", [...formData.ingredients, ""]);
    } else {
      setError("Please fill in the last ingredient before adding a new one");
    }
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      handleInputChange("ingredients", newIngredients);
      const lastIngredient =
        formData.ingredients[formData.ingredients.length - 1];
      if (error && lastIngredient.trim() !== "") {
        setError("");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photoUrls: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      formData.ingredients
        .filter((i) => i.trim() !== "")
        .forEach((ing) => data.append("ingredients", ing));
      data.append("instructions", formData.instructions);
      data.append("category", formData.category);
      data.append(
        "cookingTime",
        formData.cookingTime ? Number(formData.cookingTime) : ""
      );
      formData.photoUrls.forEach((file) => data.append("images", file));

      await summaryApi.updateRecipe(id, data);
      toast.success("Recipe updated successfully!", { position: "top-center" });
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError("Failed to update recipe");
      toast.error("Failed to update recipe", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await summaryApi.getRecipe(id);
      setFormData({
        title: res.data.title,
        ingredients: res.data.ingredients,
        instructions: res.data.instructions,
        category: res.data.category,
        photoUrls: res.data.photoUrls || [],
        cookingTime: res.data.cookingTime,
      });
    };
    fetchRecipe();
  }, [id]);

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative border border-blue-200">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 text-blue-400 hover:text-blue-600 flex items-center gap-1 text-sm font-semibold"
        >
          <FaChevronLeft /> Back
        </button>
        <div className="flex flex-col items-center mb-6">
          <FaEdit className="text-4xl text-blue-500 mb-2" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            Edit Recipe - <span className="text-blue-400">YouthIt Recipes</span>
          </h1>
          <p className="text-gray-500">
            Update your recipe for the YouthIt community!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaListUl /> Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
              placeholder="e.g., Spaghetti Bolognese"
            />
          </div>
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaListUl /> Ingredients
            </label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full bg-red-50 border border-red-200 transition"
                      title="Remove ingredient"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-500 border border-blue-300 px-3 py-1 rounded-lg font-medium transition mt-1"
                onClick={addIngredient}
              >
                <FaPlus /> Add Ingredient
              </button>
            </div>
          </div>
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaListUl /> Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[100px]"
              required
              placeholder="Describe the steps..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
                <FaListUl /> Category
              </label>
              <select
                onChange={(e) => handleInputChange("category", e.target.value)}
                value={formData.category}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
                <FaClock /> Cooking Time (minutes)
              </label>
              <input
                type="number"
                value={formData.cookingTime}
                onChange={(e) =>
                  handleInputChange("cookingTime", e.target.value)
                }
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="e.g., 30"
                required
                min={0}
              />
            </div>
          </div>
          <div>
            <label className="text-blue-700 font-semibold mb-1 flex items-center gap-2">
              <FaImage /> Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {formData.photoUrls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
                {formData.photoUrls.map((file, idx) =>
                  typeof file === "string" ? (
                    <img
                      key={idx}
                      src={file}
                      alt="Preview"
                      className="max-h-32 rounded-lg border border-blue-100 shadow-md object-cover"
                    />
                  ) : (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="max-h-32 rounded-lg border border-blue-100 shadow-md object-cover"
                    />
                  )
                )}
              </div>
            )}
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}
          <button
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">
                  <FaUtensils />
                </span>{" "}
                Updating...
              </>
            ) : (
              <>
                <FaEdit /> Update Recipe
              </>
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditRecipe;
