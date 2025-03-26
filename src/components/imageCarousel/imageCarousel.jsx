import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './index.css';

const images = [
  { src: '/src/assets/video.mp4', alt: 'Intro Video' },
  { src: '/src/assets/1.svg', alt: 'Poster 2' },
  { src: '/src/assets/2.svg', alt: 'Poster 6' },
  { src: '/src/assets/3.svg', alt: 'Poster 5' },
  { src: '/src/assets/4.svg', alt: 'Poster 5' },
  { src: '/src/assets/5.svg', alt: 'Poster 5' },
  { src: '/src/assets/6.svg', alt: 'Poster 5' },
  { src: '/src/assets/7.svg', alt: 'Poster 5' }
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let intervalId;

    if (images[currentIndex].src.endsWith('.mp4')) {
      videoRef.current?.play();
      setIsVideoStarted(true);
    }

    if (!isVideoPlaying) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
      if (isVideoStarted && !isVideoPlaying) {
        videoRef.current?.pause();
      }
    };
  }, [currentIndex, isVideoPlaying]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `${images[currentIndex].alt}.jpg`;
    link.href = images[currentIndex].src;
    link.click();
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    nextImage(); // Automatically move to the next image after the video ends
  };

  const handleVideoPlay = () => {
    setIsVideoStarted(true);
    setIsVideoPlaying(true);
  };

  return (
    <div className="image-carousel-container">
      <div className="image-container">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <TransformComponent>
              {images[currentIndex].src.endsWith('.mp4') ? (
                <video
                  ref={videoRef}
                  className="carousel-video"
                  controls
                  muted
                  onPlay={handleVideoPlay}
                  onEnded={handleVideoEnd}
                  style={{ width: '100%', height: 'auto' }}
                >
                  <source src={images[currentIndex].src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="carousel-image"
                  style={{ width: '150%', height: 'auto' }}
                />
              )}
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
      <div className="button-container">
        <div className="image-controls">
          <button className="carouButt" onClick={prevImage}>Previous</button>
          <button className="carouButt" onClick={downloadImage}>Download</button>
          <button className="carouButt" onClick={nextImage}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
