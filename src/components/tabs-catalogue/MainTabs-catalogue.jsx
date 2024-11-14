import React, { useState } from "react";
import "./index.css";

const videoCatalogue = [
    {
        title: "Movie 1",
        description: "Description of Movie 1",
        src: "/src/assets/11.jpg",
        rating: "UA",
        duration: "2h 10m",
        genres: ["Action", "Adventure"]
    },
    {
        title: "Movie 2",
        description: "Description of Movie 2",
        src: "/src/assets/22.jpg",
        rating: "18+",
        duration: "1h 45m",
        genres: ["Thriller", "Horror"]
    },
    {
        title: "Movie 3",
        description: "Description of Movie 3",
        src: "/src/assets/33.jpg",
        rating: "U",
        duration: "1h 30m",
        genres: ["Drama", "Romance"]
    },
    {
        title: "Movie 4",
        description: "Description of Movie 4",
        src: "/src/assets/44.jpg",
        rating: "18+",
        duration: "2h 5m",
        genres: ["Action", "Thriller"]
    },
    {
        title: "Movie 5",
        description: "Description of Movie 5",
        src: "/src/assets/55.jpg",
        rating: "UA",
        duration: "2h 0m",
        genres: ["Comedy", "Family"]
    },
    {
        title: "Movie 6",
        description: "Description of Movie 6",
        src: "/src/assets/66.jpg",
        rating: "12+",
        duration: "1h 40m",
        genres: ["Animation", "Fantasy"]
    },
    {
        title: "Movie 7",
        description: "Description of Movie 7",
        src: "/src/assets/77.jpg",
        rating: "U",
        duration: "1h 50m",
        genres: ["Adventure", "Fantasy"]
    },
    {
        title: "Movie 8",
        description: "Description of Movie 8",
        src: "/src/assets/88.jpg",
        rating: "A",
        duration: "2h 15m",
        genres: ["Horror", "Mystery"]
    },
    {
        title: "Movie 9",
        description: "Description of Movie 9",
        src: "/src/assets/99.jpg",
        rating: "PG",
        duration: "1h 55m",
        genres: ["Romance", "Comedy"]
    },
];

function Catalogue() {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);

    const handleExpand = (index) => {
        if (expandedItemIndex === index) {
            setExpandedItemIndex(null);
        } else {
            setExpandedItemIndex(index);
        }
    };

    return (
        <div className="catalogue-container">
            <h1>Video Catalogue</h1>
            <div className="catalogue-grid">
                {videoCatalogue.map((video, index) => (
                    <div key={index} className={`catalogue-item ${expandedItemIndex === index ? 'expanded' : ''}`}>
                        {/* Poster Card */}
                        <div className="movie-poster">
                            <img src={video.src} alt={video.title} className="movie-image" />
                        </div>
                        <div className="movie-hover-info">
                            <h3>{video.title}</h3>
                            <button 
                                onClick={() => handleExpand(index)} 
                                className="expand circle-button"
                            >
                                +
                            </button>
                            {expandedItemIndex === index && (
                                <div className="expanded-info">
                                    <p><strong>Rating:</strong> {video.rating}</p>
                                    <p><strong>Description:</strong> {video.description}</p>
                                    <p><strong>Duration:</strong> {video.duration}</p>
                                    <p><strong>Genres:</strong> {video.genres.join(", ")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalogue;