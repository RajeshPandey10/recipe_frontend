import summaryApi from "../../api/summaryApi";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaListUl,
  FaImage,
  FaEdit,
  FaTrashAlt,
  FaUtensils,
} from "react-icons/fa";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await summaryApi.getRecipe(id);
      setRecipe(res.data);
    };
    fetchRecipe();
  }, [id]);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await summaryApi.deleteRecipe(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (!recipe)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-blue-500 text-xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <FaUtensils className="text-4xl text-blue-500 mb-2" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
              {recipe.category}
            </span>
            <span className="flex items-center gap-1 text-blue-500 text-xs font-medium">
              <FaClock /> {recipe.cookingTime} min
            </span>
          </div>
        </div>
        {Array.isArray(recipe.photoUrls) && recipe.photoUrls.length > 0 ? (
          <div className="flex justify-center mb-6 gap-2 flex-wrap">
            {recipe.photoUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={recipe.title}
                className="max-h-80 rounded-xl border border-blue-100 shadow-md object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mb-6">
            <div className="w-full h-80 flex items-center justify-center bg-blue-50 rounded-xl">
              <FaImage className="text-6xl text-blue-200" />
            </div>
          </div>
        )}
        <div className="mb-6">
          {recipe.createdBy && (
            <div className="text-sm text-gray-500 mb-2 text-center">
              <span className="font-semibold text-blue-600">Author:</span>{" "}
              {recipe.createdBy.username} ({recipe.createdBy.email})
            </div>
          )}
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
            <FaListUl className="text-blue-400" /> Ingredients
          </h2>
          <ul className="pl-6 mb-4 list-disc text-gray-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
            <FaListUl className="text-blue-400" /> Instructions
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
        {user && user._id === recipe.createdBy && (
          <div className="flex space-x-4 mt-6 justify-center">
            <Link to={`/edit-recipe/${id}`}>
              <button className="flex items-center gap-2 bg-yellow-400 text-white p-3 rounded-xl font-bold shadow hover:bg-yellow-500 transition">
                <FaEdit /> Edit
              </button>
            </Link>
            <button
              className="flex items-center gap-2 bg-red-500 text-white p-3 rounded-xl font-bold shadow hover:bg-red-600 transition"
              onClick={handleDelete}
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
