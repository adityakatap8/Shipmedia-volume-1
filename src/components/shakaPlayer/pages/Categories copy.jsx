import { useEffect } from "react";
import { PlayerMenu } from "../components/PlayerMenu";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";

const Categories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Directly embedded JSON data
  const categoriesData = {
    "categories": [
      {
        "id": "action",
        "name": "Action",
        "description": "Thrilling action-packed content",
        "count": 245,
        "items": [
          {
            "id": "movie_1",
            "title": "Sky Warriors",
            "thumbnailImage": "/placeholder.svg",
            "genre": "Action",
            "rating": "PG-13",
            "releaseYear": 2021,
            "duration": "2h 15m",
            "type": "movie"
          }
        ]
      },
      {
        "id": "drama",
        "name": "Drama",
        "description": "Compelling dramatic stories",
        "count": 327,
        "items": [
          {
            "id": "series_1",
            "title": "Mystic Falls",
            "thumbnailImage": "/placeholder.svg",
            "genre": "Drama",
            "rating": "TV-14",
            "releaseYear": 2019,
            "type": "series"
          }
        ]
      }
    ]
  };

  const categories = categoriesData.categories || [];
  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  return (
    <div className="min-h-screen">
      <PlayerMenu />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold text-stream-text-primary mb-8">Categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    categoryId === category.id
                      ? "bg-stream-accent text-white"
                      : " text-stream-text-primary hover:bg-stream-accent/10"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-stream-text-secondary mt-1">
                    {category.count} titles
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="md:col-span-3">
            {selectedCategory ? (
              <div>
                <h2 className="text-2xl font-bold text-stream-text-primary mb-6">
                  {selectedCategory.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCategory.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/${item.type}/${item.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img
                          src={item.thumbnailImage}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-stream-text-primary group-hover:text-stream-accent transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-stream-text-secondary">
                        <span>{item.releaseYear}</span>
                        <span>•</span>
                        <span>{item.rating}</span>
                        <span>•</span>
                        <span>{item.genre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-stream-text-secondary">
                Select a category to view content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
