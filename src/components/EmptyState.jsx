import React from "react";

export default function EmptyState({ filters, onClearFilters }) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.level !== "all";

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
        <div className="text-6xl mb-4 opacity-50">
          {hasActiveFilters ? "🔍" : "📚"}
        </div>

        <h3 className="text-xl font-medium text-white mb-2">
          {hasActiveFilters ? "No courses found" : "No courses available"}
        </h3>

        <p className="text-white/70 mb-6">
          {hasActiveFilters
            ? "Try adjusting your search or filters to find what you're looking for."
            : "Check back later for new courses!"}
        </p>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="bg-blue-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-blue-500/80 transition-all border border-blue-500/50"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
