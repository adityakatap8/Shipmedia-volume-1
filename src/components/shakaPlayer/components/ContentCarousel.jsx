import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const ContentCarousel = ({ title, items }) => {
  const scrollLeft = () => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-8">
      <h2 className="text-stream-text-primary text-2xl font-semibold mb-4 px-12">
        {title}
      </h2>

      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div
          id={`carousel-${title}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-12 scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none w-64 group/item cursor-pointer"
              onClick={() => (window.location.href = `/${item.contentType}/${item.id}`)}
            >
              <div className="relative aspect-video rounded-md overflow-hidden">
                <img
                  src={item.thumbnailImage}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-stream-text-primary mt-2 group-hover/item:text-stream-accent transition-colors">
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

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollRight}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

// Default export for ContentCarousel
export default ContentCarousel;
