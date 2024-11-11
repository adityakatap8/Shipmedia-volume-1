import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './index.css';

const images = [
  { src: '/src/assets/1.png', alt: 'Poster 2' },
  { src: '/src/assets/2.png', alt: 'Poster 6' },
  { src: '/src/assets/3.png', alt: 'Poster 5' },
  { src: '/src/assets/4.png', alt: 'Poster 5' },
  { src: '/src/assets/5.png', alt: 'Poster 5' },
  { src: '/src/assets/6.png', alt: 'Poster 5' },
  { src: '/src/assets/7.png', alt: 'Poster 5' },
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="carousel-image"
                style={{ width: '150%', height: 'auto' }}
              />
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
      <div className="button-container">
        <div className="image-controls">
          <button className='carouButt' onClick={prevImage}>Previous</button>
          <button className='carouButt' onClick={downloadImage}>Download</button>
          <button className='carouButt' onClick={nextImage}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
