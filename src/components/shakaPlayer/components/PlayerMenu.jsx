import { Link } from "react-router-dom";

export function PlayerMenu() {
  return (
    <div className="top-0 z-50  backdrop-blur-sm border-b border-stream-background-lighter">
      <div className="container mx-auto px-4">
        <nav className="h-14 flex items-center space-x-8">
          <Link 
            to="/showcase-projects" 
            className="text-stream-text-primary hover:text-stream-accent transition-colors"
          >
            Showcase Catalogue
          </Link>
          {/* <Link 
            to="/categories" 
            className="text-stream-text-primary hover:text-stream-accent transition-colors"
          >
            Categories
          </Link> */}
          {/* <Link 
            to="/search" 
            className="text-stream-text-primary hover:text-stream-accent transition-colors"
          >
            Search
          </Link> */}
        </nav>
      </div>
    </div>
  );
}
