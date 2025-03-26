import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Play, Info } from "lucide-react";

export const HeroCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  const currentItem = items[currentIndex];

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentItem.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-stream-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stream-background via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 p-12 w-1/2">
        <img
          src={currentItem.logoImage}
          alt={currentItem.title}
          className="w-64 mb-6"
        />
        <p className="text-stream-text-primary text-lg mb-4">
          {currentItem.description}
        </p>
        <div className="flex items-center gap-4 text-stream-text-secondary mb-6">
          <span>{currentItem.releaseYear}</span>
          <span>{currentItem.rating}</span>
          <span>{currentItem.genre}</span>
        </div>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => (window.location.href = currentItem.ctaLink)}
          >
            <Play className="mr-2 h-5 w-5" />
            Play
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => (window.location.href = currentItem.ctaLink)}
          >
            <Info className="mr-2 h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};
