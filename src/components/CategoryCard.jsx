import React, { useState } from "react";
import placeholder from "../assets/placeholder-course.jpg";

export default function CourseCard({ course, onClick }) {
  const [imageError, setImageError] = useState(false);
  
  // Multiple fallback options for database thumbnails
  const getImageSrc = () => {
    if (imageError) return placeholder;
    
    // Check for various possible image properties from your database
    const possibleImages = [
      course?.thumbnail,
      course?.image, 
      course?.coverImage,
      course?.poster,
      course?.previewImage,
      course?.thumbnailUrl,
      course?.imageUrl,
      course?.cover,
      course?.photo,
      course?.picture
    ];
    
    // Find the first non-empty image URL
    const imageUrl = possibleImages.find(img => img && img.trim() !== '');
    
    // If we have an image URL, ensure it's a complete URL
    if (imageUrl) {
      // If it starts with 'http', return as is
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // If it starts with '/', assume it's a relative path from your server
      if (imageUrl.startsWith('/')) {
        return imageUrl;
      }
      // If it's just a filename, you might need to prepend your base URL
      // Adjust this based on your server setup
      return imageUrl;
    }
    
    return placeholder;
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src, 'for course:', course?.name);
    setImageError(true);
  };

  // Generate random height for Pinterest masonry effect (iPhone-like proportions)
  const heights = ['h-64', 'h-72', 'h-80', 'h-88', 'h-96'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-indigo-500/60
                 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer
                 transform hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Image container with fixed aspect ratio similar to iPhone dimensions */}
      <div className={`relative overflow-hidden ${randomHeight} bg-gray-700`}>
        <img
          src={getImageSrc()}
          loading="lazy"
          alt={course?.name || "Course thumbnail"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          onLoad={() => console.log('Image loaded successfully:', getImageSrc())}
          referrerPolicy="no-referrer"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        {course?.category && (
          <div className="absolute top-3 left-3">
            <span className="text-xs rounded-full bg-black/60 backdrop-blur-sm px-2 py-1 text-white font-medium">
              {course.category}
            </span>
          </div>
        )}
        
        {/* Duration or level badge */}
        {(course?.duration || course?.level) && (
          <div className="absolute top-3 right-3">
            <span className="text-xs rounded-full bg-indigo-500/80 backdrop-blur-sm px-2 py-1 text-white font-medium">
              {course.duration || course.level}
            </span>
          </div>
        )}
        
        {/* Price badge */}
        {course?.price !== undefined && (
          <div className="absolute bottom-3 right-3">
            <span className={`text-xs rounded-full backdrop-blur-sm px-2 py-1 font-medium ${
              course.price === 0 || course.price === 'Free' 
                ? 'bg-green-500/80 text-white' 
                : 'bg-blue-500/80 text-white'
            }`}>
              {course.price === 0 || course.price === 'Free' ? 'Free' : `$${course.price}`}
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200 mb-2">
          {course?.name || course?.title || "Untitled course"}
        </h3>
        
        {/* Instructor */}
        {course?.instructor && (
          <p className="text-sm text-gray-400 mb-2">
            by {course.instructor}
          </p>
        )}
        
        {/* Description */}
        {(course?.about || course?.description) && (
          <p className="text-sm text-gray-400 line-clamp-3 mb-3">
            {course.about || course.description}
          </p>
        )}
        
        {/* Rating and stats */}
        <div className="flex items-center justify-between">
          {course?.rating && (
            <div className="flex items-center">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-1">
                {course.rating} {course.reviewCount && `(${course.reviewCount})`}
              </span>
            </div>
          )}
          
          {course?.studentsCount && (
            <span className="text-xs text-gray-500">
              {course.studentsCount} students
            </span>
          )}
        </div>
        
        {/* Tags */}
        {course?.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs rounded-full bg-gray-700/50 border border-gray-600 px-2 py-0.5 text-gray-300"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}