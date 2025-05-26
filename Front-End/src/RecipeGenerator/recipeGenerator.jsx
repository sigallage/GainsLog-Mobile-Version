import { useEffect, useState } from "react";
import axios from "axios";
import "./recipeGenerator.css";

const AIRecipeGenerator = () => {
  const [dietType, setDietType] = useState("bulking");
  const [country, setCountry] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-detect user's country
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        setCountry(response.data.country_name);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    fetchUserCountry();
  }, []);

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe("");

    try {
      const response = await axios.post("http://localhost:5000/api/ai-recipes/generate", {
        dietType,
        country,
      });

      setRecipe(response.data.recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Error fetching recipe. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="ai-recipe-generator">
      <h2>🍽️ AI-Powered Recipe Generator</h2>

      <label>Diet Type:</label>
      <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
        <option value="bulking">Bulking</option>
        <option value="cutting">Cutting</option>
      </select>

      <label>Country:</label>
      <input type="text" value={country} readOnly />

      <button onClick={generateRecipe} disabled={loading}>
        {loading ? "Generating..." : "Get AI Recipe"}
      </button>

      {recipe && <div className="recipe-output"><pre>{recipe}</pre></div>}
    </div>
  );
};

export default AIRecipeGenerator;
