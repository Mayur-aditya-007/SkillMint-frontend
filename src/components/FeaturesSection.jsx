import React from "react";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-12">Our Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4">Interactive Learning</h3>
            <p>Engage with hands-on projects and real-world scenarios.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4">Expert Instructors</h3>
            <p>Learn from industry professionals with years of experience.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4">Flexible Learning Paths</h3>
            <p>Choose courses that fit your schedule and career goals.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
