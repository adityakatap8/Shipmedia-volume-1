import { PlayerMenu } from "../components/PlayerMenu";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="">
      <div className="container-fluid mx-auto">
        <div className="max-w-2xl mx-auto">
          {/* Flex container for title and input field */}
          <div className="flex items-center mb-8">
            {/* <p className="text-3xl text-stream-text-primary mr-4">Search</p> */}
            <div className="relative w-full">
              {/* <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stream-text-secondary" /> */}
              <Input
                type="text"
                placeholder="Searh Here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 border-stream-background-lighter text-stream-text-primary placeholder:text-stream-text-secondary"
              />
            </div>
          </div>
          {searchQuery && (
            <div className="mt-8 text-center text-stream-text-secondary">
              Search functionality coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
