import summaryApi from "../../api/summaryApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaClock, FaListUl, FaImage } from "react-icons/fa";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await summaryApi.getRecipes(category);
      // Defensive: ensure array
      if (Array.isArray(res.data)) {
        setRecipes(res.data);
      } else if (res.data && Array.isArray(res.data.recipes)) {
        setRecipes(res.data.recipes);
      } else {
        setRecipes([]);
      }
    };
    fetchRecipes();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-8">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col items-center mb-8">
          <FaUtensils className="text-5xl text-blue-500 mb-2" />
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-1">
            YouthIt Recipes
          </h1>
          <p className="text-gray-500 text-lg">
            Discover and share your favorite recipes with the YouthIt community!
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 mb-6 justify-center">
          {categories.map((cat) => (
            <button
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm border transition duration-200 ${
                category === cat
                  ? "bg-blue-500 text-white border-blue-500 scale-105"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
              }`}
              key={cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(recipes) && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Link
                to={`/recipe/${recipe._id}`}
                className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl duration-300 cursor-pointer border border-blue-100 group"
                key={recipe._id}
              >
                {Array.isArray(recipe.photoUrls) &&
                recipe.photoUrls.length > 0 ? (
                  <img
                    src={recipe.photoUrls[0]}
                    alt={recipe.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-blue-50">
                    <FaImage className="text-5xl text-blue-200" />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-2xl font-bold capitalize text-blue-700 mb-1 flex items-center gap-2">
                    <FaListUl className="text-blue-400" /> {recipe.title}
                  </h2>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {recipe.category}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500 text-xs font-medium">
                      <FaClock /> {recipe.cookingTime} min
                    </span>
                  </div>
                  {recipe.createdBy && (
                    <div className="text-xs text-gray-500 mt-1">
                      By: {recipe.createdBy.username} ({recipe.createdBy.email})
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg py-12">
              No recipes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
