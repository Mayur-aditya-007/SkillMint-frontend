import React from 'react';
import CourseCard from './CourseCard';

const PinterestGrid = ({ courses }) => {
  return (
    <div className="pinterest-grid">
      {courses.map((course, index) => (
        <div key={`${course._id}-${index}`} className="pinterest-item">
          <CourseCard course={course} />
        </div>
      ))}
      
      <style jsx>{`
        .pinterest-grid {
          column-count: 1;
          column-gap: 1rem;
          padding: 0;
        }
        
        @media (min-width: 640px) {
          .pinterest-grid {
            column-count: 2;
          }
        }
        
        @media (min-width: 768px) {
          .pinterest-grid {
            column-count: 3;
          }
        }
        
        @media (min-width: 1024px) {
          .pinterest-grid {
            column-count: 4;
          }
        }
        
        @media (min-width: 1280px) {
          .pinterest-grid {
            column-count: 5;
          }
        }
        
        .pinterest-item {
          break-inside: avoid;
          margin-bottom: 1rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default PinterestGrid;