import React from 'react';
import { motion } from 'framer-motion';

const ImageGallery = ({ images, activeIndex, onSelect }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-2xl bg-gray-100">
        <motion.img
          key={activeIndex}
          src={images[activeIndex]}
          alt={`Product view ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${
                index === activeIndex ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;