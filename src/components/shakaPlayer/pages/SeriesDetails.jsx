import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayerMenu } from "../components/PlayerMenu";
import { Button } from "../components/ui/button";
import { Play, Info } from "lucide-react";
import ContentCarousel from "../components/ContentCarousel";
import { useToast } from "../components/ui/use-toast";
import placeholder from "../../../assets/placeholder.svg";

const SeriesDetails = () => {
  const { seriesId } = useParams();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // JSON data directly embedded into the code
  const seriesData = {
    "id": "series_1",
    "title": "Mad Men",
    "description": "A odd town shrouded in mystery, where secrets unfold each season.",
    "genre": "Drama",
    "rating": "TV-14",
    "releaseYear": 2019,
    "backgroundImage": placeholder,
    "logoImage": placeholder,
    "seasons": [
      {
        "id": "season_1",
        "number": 1,
        "title": "Season 1",
        "episodes": [
          {
            "id": "ep_1",
            "number": 1,
            "title": "Welcome to Mystic Falls",
            "description": "Strange events begin to occur in a small town.",
            "duration": "45m",
            "thumbnail": placeholder,
            "url": "https://testmovies-1.s3.amazonaws.com/President_McKinley_taking_the_oath.mp4?AWSAccessKeyId=AKIATKPD3X56A554ASFB&Signature=TVNKCAoPVMi23jVXvJVS5oSgltM%3D&Expires=1737021210"
          },
          {
            "id": "ep_2",
            "number": 2,
            "title": "The Mystery Deepens",
            "description": "More secrets come to light as the investigation continues.",
            "duration": "42m",
            "thumbnail": placeholder,
            "url": "https://testmovies-1.s3.amazonaws.com/Popeye_the_Sailor_Meets_Sindbad_the_Sailor.mp4?AWSAccessKeyId=AKIATKPD3X56A554ASFB&Signature=HoqhCzAJgs456Z61IH86h%2BaPrRo%3D&Expires=1737021187"
          }
        ]
      }
    ],
    "cast": [
      {
        "id": "cast_1",
        "name": "Emily Clark",
        "role": "Detective Sarah Mitchell",
        "image": placeholder
      }
    ],
    "crew": [
      {
        "id": "crew_1",
        "name": "Michael Brown",
        "role": "Showrunner",
        "image": placeholder
      }
    ],
    "relatedContent": [
      {
        "id": "series_2",
        "title": "Dark Secrets",
        "thumbnailImage": placeholder,
        "genre": "Drama",
        "rating": "TV-14",
        "releaseYear": 2020,
        "type": "series"
      }
    ]
  };

  const currentSeason = seriesData.seasons[selectedSeason];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${seriesData.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-stream-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stream-background via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-12 w-1/2">
          <img
            src={seriesData.logoImage}
            alt={seriesData.title}
            className="w-64 mb-6"
          />
          <p className="text-stream-text-primary text-lg mb-4">
            {seriesData.description}
          </p>
          <div className="flex items-center gap-4 text-stream-text-secondary mb-6">
            <span>{seriesData.releaseYear}</span>
            <span>{seriesData.rating}</span>
            <span>{seriesData.genre}</span>
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => navigate(`/player/tvepisode/${seriesData.seasons[0].episodes[0].id}`)}
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
            <Button size="lg" variant="secondary">
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Season Selection and Episodes */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className=" text-stream-text-primary border-none rounded-lg p-2"
          >
            {seriesData.seasons.map((season, index) => (
              <option key={season.id} value={index}>
                {season.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {currentSeason.episodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => navigate(`/player/tvepisode/${episode.id}`)}
              className="flex gap-6 rounded-lg p-4 hover:bg-stream-accent/10 transition-colors cursor-pointer"
            >
              <div className="w-48 aspect-video rounded-md overflow-hidden">
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-stream-text-primary font-medium">
                    Episode {episode.number}
                  </span>
                  <span className="text-stream-text-secondary">
                    {episode.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-stream-text-primary mb-2">
                  {episode.title}
                </h3>
                <p className="text-stream-text-secondary">
                  {episode.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cast & Crew Sections */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-stream-text-primary mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seriesData.cast.map((member) => (
              <div key={member.id} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-stream-text-primary font-medium">
                  {member.name}
                </h3>
                <p className="text-sm text-stream-text-secondary">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stream-text-primary mb-6">Crew</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seriesData.crew.map((member) => (
              <div key={member.id} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-stream-text-primary font-medium">
                  {member.name}
                </h3>
                <p className="text-sm text-stream-text-secondary">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Content */}
        {seriesData.relatedContent && (
          <ContentCarousel
            title="You Might Also Like"
            items={seriesData.relatedContent}
          />
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
