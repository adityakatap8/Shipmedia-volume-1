import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import './index.css'; // Importing specific CSS file

const Categories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Example categories (replace this with your actual data)
  const categories = [
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Thriller",
    "Horror",
    "Documentary",
    // "Sci-Fi",
  ];

  // State to store the selected category
  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);  // Update selected category
    navigate(`/categories/${category.toLowerCase()}`);  // Navigate to the specific category screen
  };

  return (
    <div className="categories-page ">
      <div className="categories-container container-fluid mx-auto">
        {/* Categories will now be listed vertically */}
        <div className="categories-list flex flex-col">
          {categories.map((category) => (
            <button
              key={category}
              className={`${
                selectedCategory === category
                  ? "categories-button-selected text-blue-600 font-semibold" // Apply blue color to selected category
                  : "text-white" // Removed hover effects
              } categories-button py-2 px-6 p-2 text-sm font-semibold transition-all duration-300`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              {/* Blue underline for both selected and non-selected categories */}
              <div
                className={`${
                  selectedCategory === category ? "bg-blue-600" : "bg-transparent"
                } h-1 w-full mt-2 transition-all duration-300`}
              ></div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="categories-content mt-8 text-center text-stream-text-secondary">
            <h2 className="categories-subtitle text-md font-semibold">Showing {selectedCategory} Movies</h2>
            {/* Here you would render the movies or items for the selected category */}
            <p>Content related to {selectedCategory} will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
