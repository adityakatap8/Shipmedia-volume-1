import { Button } from '../components/ui/button';
import { ArrowLeft, FastForwardIcon, ForwardIcon, PauseIcon, PlayIcon, Redo2, RewindIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shaka from 'shaka-player';

const ShakaPlayer = ({
  width = '100%',
  height = '100%',
  url // The dynamic URL prop passed from the parent
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isEnded, setIsEnded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Effect to initialize the player and load the video
  useEffect(() => {
    if (!url) return;  // If no URL, do not continue

    shaka.polyfill.installAll(); // Install Shaka polyfills

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported for Shaka Player!');
      return;
    }

    const initPlayer = async () => {
      try {
        const player = new shaka.Player(videoRef.current); // Initialize Shaka player
        const video = videoRef.current;
        playerRef.current = player;

        player.addEventListener('error', (event) => {
          console.error('Error code:', event.detail.code, 'object:', event.detail);
        });

        await player.load(url);  // Load the video using the URL prop

        video.addEventListener('ended', () => setIsEnded(true));

        const handlePlayStateChange = () => {
          setIsPlaying(!video.paused);
        };

        video.addEventListener('play', handlePlayStateChange);
        video.addEventListener('pause', handlePlayStateChange);

        console.log('Video loaded successfully');
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    initPlayer(); // Initialize the player when URL changes
  }, [url]); // Re-run this effect if `url` changes

  // Handler to replay the video when it's ended
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsEnded(false);
    }
  };

  // Rewind by 10 seconds
  const handleRewind = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    }
  };

  // Forward by 10 seconds
  const handleForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    }
  };

  // Play/Pause handler
  const handlePause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <div
      className="min-h-screen relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* <Button
        variant="ghost"
        className="absolute top-4 left-4 text-white hover:bg-white/10 z-10"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button> */}
      <div className="h-screen flex items-center justify-center">
        <div className="w-auto h-auto">
          <div className="relative w-full h-full video-player" style={{ zIndex:1 }}>
            <video
              ref={videoRef}
              style={{ width, height }}
              controls
              className="w-auto h-auto"
              autoPlay
            />
          </div>

          {showControls && !isEnded && (
            <div
              className="absolute inset-0 flex items-center justify-center gap-4"
              style={{
                pointerEvents: "none",
              }}
            >
              <Button
                variant="outline"
                size="lg"
                className="text-white bg-white/20 hover:text-white hover:bg-black/50"
                onClick={handleRewind}
                style={{ pointerEvents: "auto" }}
              >
                <RewindIcon />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white bg-white/20 hover:text-white hover:bg-black/50"
                onClick={handlePause}
                style={{ pointerEvents: "auto" }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white bg-white/20 hover:text-white hover:bg-black/50"
                onClick={handleForward}
                style={{ pointerEvents: "auto" }}
              >
                <FastForwardIcon />
              </Button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                size="lg"
                className="text-white bg-white/20 hover:text-white hover:bg-black/50"
                onClick={handleReplay}
              >
                <Redo2 className="mr-2" />
                Replay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShakaPlayer;
