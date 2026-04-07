import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating }) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}</span>
    </div>
  );
};

export default RatingStars;