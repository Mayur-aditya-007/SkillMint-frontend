// src/pages/Explore.jsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import CourseModal from '../components/CourseModal';

const API_BASE = import.meta.env.VITE_BASE_URL || '/api';

const Explore = () => {
  const { user } = useContext(UserContext);

  const [rawCourses, setRawCourses] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All Categories' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filters + pagination
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    search: '',
    sortBy: 'name',   // default A–Z for predictable left→right
    sortOrder: 'asc',
  });

  // live bound search
  const [searchText, setSearchText] = useState('');

  // related searches
  const [related, setRelated] = useState([]);

  // modal
  const [selectedCourse, setSelectedCourse] = useState(null);
  const openCourse = (course) => setSelectedCourse(course);
  const closeCourse = () => setSelectedCourse(null);

  // debounce util
  const useDebounce = (value, delay = 250) => {
    const [v, setV] = useState(value);
    useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
    return v;
  };
  const debouncedSearch = useDebounce(searchText, 250);

  // normalize
  const normalizeList = (list) => list.map((c) => ({
    ...c,
    id: c.id || c._id,
    title: c.title || c.name || 'Untitled Course',
    name: c.name || c.title || 'Untitled Course',
    description: c.description || c.about || '',
    about: c.about || c.description || '',
    thumbnail: c.thumbnail || '',
    createdAt: c.createdAt || c.updatedAt || new Date().toISOString(),
    rating: typeof c.rating === 'number' ? c.rating : 0,
    enrollmentCount: typeof c.enrollmentCount === 'number' ? c.enrollmentCount : 0,
    price: typeof c.price === 'number' ? c.price : 0,
  }));

  // fetchers
  const fetchCourses = async (signal) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '120', // grab more so both horizontal + grid have enough
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        searchIn: 'name', // strict name-only search
      });
      if (filters.search) params.set('q', filters.search);
      if (filters.category && filters.category !== 'all') params.set('category', filters.category);
      if (filters.level && filters.level !== 'all') params.set('level', filters.level);

      const res = await axios.get(`${API_BASE}/courses?${params.toString()}`, { signal });
      const payload = res.data;
      const list = payload?.data?.courses || payload?.data || payload?.courses || [];
      setRawCourses(normalizeList(list));
      setError('');
    } catch (err) {
      if (axios.isCancel?.(err)) return;
      setError(err?.response?.data?.message || err.message || 'Failed to load courses');
      setRawCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/courses/categories`);
      const raw = res.data?.data || res.data || [];
      const toObj = (v) =>
        typeof v === 'string'
          ? { _id: v, name: v.charAt(0).toUpperCase() + v.slice(1), count: 0 }
          : { _id: v._id ?? v.value ?? v.name ?? 'unknown', name: v.name ?? String(v._id ?? v.value ?? 'Unknown'), count: v.count ?? 0 };
      setCategories([{ _id: 'all', name: 'All Categories', count: 0 }, ...raw.map(toObj)]);
    } catch { setCategories([{ _id: 'all', name: 'All Categories', count: 0 }]); }
  };

  // effects
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    setFilters((p) => ({ ...p, search: debouncedSearch.trim() }));
  }, [debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.level, filters.search, filters.sortBy, filters.sortOrder]);

  // related chips (live)
  useEffect(() => {
    const term = debouncedSearch.trim();
    if (!term) { setRelated([]); return; }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/courses/related`, { params: { q: term, limit: 16 }, signal: controller.signal });
        setRelated(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch {}
    })();
    return () => controller.abort();
  }, [debouncedSearch]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const onSubmitSearch = (term) => setSearchText(term);

  // strict client filter (name only) to mirror backend
  const visibleCourses = useMemo(() => {
    const t = (filters.search || '').toLowerCase();
    if (!t) return rawCourses;
    return rawCourses.filter((c) => String(c.name || c.title || '').toLowerCase().includes(t));
  }, [rawCourses, filters.search]);

  // client sort fallback (guarantees ordering)
  const sortedCourses = useMemo(() => {
    const list = [...visibleCourses];
    const { sortBy, sortOrder } = filters;
    const cmpTxt = (a, b, k) =>
      (a?.[k] || '').toString().localeCompare((b?.[k] || '').toString(), 'en', { sensitivity: 'base' });
    const map = {
      name: (a, b) => cmpTxt(a, b, 'name') || cmpTxt(a, b, 'title'),
      createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      rating: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
      enrollmentCount: (a, b) => (a.enrollmentCount ?? 0) - (b.enrollmentCount ?? 0),
      price: (a, b) => (a.price ?? 0) - (b.price ?? 0),
    };
    const sorter = map[sortBy] || map.name;
    list.sort(sorter);
    if (sortOrder === 'desc') list.reverse();
    return list;
  }, [visibleCourses, filters]);

  const patternSVG =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  const hasSearch = !!filters.search;

  return (
    <div className="min-h-screen w-full relative bg-gray-900">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("${patternSVG}")` }} />

      <Navbar user={user} />

      <div className="relative z-10 w-full mx-auto px-6 py-11" style={{ maxWidth: 'calc(65vw + 10px)' }}>
        {/* Sticky header with heading + search + filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl sticky top-20 z-40 mb-11">
          <div className="px-6 py-6 space-y-4 lg:space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
              <div className="shrink-0">
                <h1 className="text-3xl font-bold text-white leading-tight">Explore Courses</h1>
                <p className="text-white/70 text-sm mt-1">Discover amazing courses to boost your skills</p>
              </div>

              <div className="mt-4 lg:mt-0 flex-1 w-full">
                <SearchBar
                  value={searchText}
                  onChange={setSearchText}           // real-time
                  onSubmitSearch={onSubmitSearch}
                  onSelectCourse={openCourse}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="bg-gray-800">{c.name}</option>
                  ))}
                </select>

                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  {['all', 'beginner', 'intermediate', 'advanced'].map((v) => (
                    <option key={v} value={v} className="bg-gray-800">
                      {v === 'all' ? 'All Levels' : v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  <option value="name" className="bg-gray-800">A–Z</option>
                  <option value="createdAt" className="bg-gray-800">Newest</option>
                  <option value="rating" className="bg-gray-800">Rating</option>
                  <option value="enrollmentCount" className="bg-gray-800">Popular</option>
                  <option value="price" className="bg-gray-800">Price</option>
                </select>

                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  <option value="asc" className="bg-gray-800">Asc</option>
                  <option value="desc" className="bg-gray-800">Desc</option>
                </select>
              </div>

              <button
                onClick={() => { setSearchText(''); setFilters({ category: 'all', level: 'all', search: '', sortBy: 'name', sortOrder: 'asc' }); }}
                className="bg-white/10 backdrop-blur-sm text-white/80 py-2 px-4 rounded-xl hover:bg-white/20 transition-all text-sm font-medium border border-white/20"
              >
                Clear
              </button>
            </div>

            {/* Related searches (chips) */}
            {debouncedSearch && related.length > 0 && (
              <div className="pt-2">
                <div className="text-white/70 text-sm mb-2">Related searches</div>
                <div className="flex flex-wrap gap-2">
                  {related.map((r, i) => (
                    <button
                      key={`${r.name}-${i}`}
                      onClick={() => onSubmitSearch(r.name)}
                      className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition"
                      title={`${r.count || ''} result${r.count === 1 ? '' : 's'}`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== RESULTS ===================== */}

        {/* 1) Horizontal row FIRST when searching */}
        {hasSearch && (
          <>
            <div className="mb-3 text-white/70">
              {sortedCourses.length > 0 && <>Found <span className="text-white font-semibold">{sortedCourses.length}</span> courses</>}
            </div>

            <div className="relative mb-8">
              <div className="horizontal-row snap-x snap-mandatory overflow-x-auto overflow-y-hidden no-scrollbar flex gap-4 pr-2">
                {sortedCourses.map((course, idx) => (
                  <button
                    key={`${course.id || course._id || idx}`}
                    onClick={() => openCourse(course)}
                    className="snap-start shrink-0 w-72"
                    title={course.name}
                  >
                    <CourseCard course={course} />
                  </button>
                ))}
              </div>
            </div>

            {/* 2) Then a 3-per-row grid (clean rows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course, idx) => (
                <button key={`${course.id || course._id || idx}-grid`} onClick={() => openCourse(course)} className="text-left">
                  <CourseCard course={course} />
                </button>
              ))}
            </div>
          </>
        )}

        {/* 3) When NOT searching: Pinterest-style grid “like before” */}
        {!hasSearch && (
          <>
            <div className="mb-3 text-white/70">
              {sortedCourses.length > 0 && <>Found <span className="text-white font-semibold">{sortedCourses.length}</span> courses</>}
            </div>

            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-6">
                <p className="font-medium">Error loading courses:</p>
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {loading && sortedCourses.length === 0 ? (
              <div className="pinterest-grid animate-pulse">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="pinterest-item">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
                      <div className="bg-white/10" style={{ height: ['180px', '210px', '240px'][i % 3] }} />
                      <div className="bg-gray-900 p-5">
                        <div className="h-4 bg-white/10 rounded-lg mb-2" />
                        <div className="h-4 bg-white/10 rounded-lg mb-2 w-3/4" />
                        <div className="h-3 bg-white/10 rounded-lg mb-1 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedCourses.length > 0 ? (
              <div className="pinterest-grid">
                {sortedCourses.map((course, index) => (
                  <div
                    key={`${course.id || course._id || index}-${index}`}
                    className="pinterest-item"
                    onClick={() => openCourse(course)}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                filters={filters}
                onClearFilters={() => { setSearchText(''); setFilters({ category: 'all', level: 'all', search: '', sortBy: 'name', sortOrder: 'asc' }); }}
              />
            )}
          </>
        )}
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={closeCourse}
          onAddCourse={() => {}}
          isAddedToProfile={false}
        />
      )}

      <footer className="relative z-10 bg-black/70 backdrop-blur-sm text-white py-6 px-6 text-center mt-16">
        &copy; 2025 Skill Mint. All rights reserved.
      </footer>

      <style>{`
        .horizontal-row { scroll-snap-type: x mandatory; padding-bottom: .25rem; }
        .horizontal-row > * { scroll-snap-align: start; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Pinterest-style (no search) */
        .pinterest-grid { column-count: 1; column-gap: 1.5rem; padding: 0; }
        @media (min-width: 640px) { .pinterest-grid { column-count: 2; } }
        @media (min-width: 1024px) { .pinterest-grid { column-count: 3; } }
        .pinterest-item { break-inside: avoid; margin-bottom: 1.5rem; width: 100%; }
      `}</style>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const title = course.title || course.name || 'Untitled Course';
  const description = course.description || course.about || '';
  const thumbnail = course.thumbnail || '';

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative h-40">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/60 text-3xl bg-gray-800">📚</div>
        )}
      </div>
      <div className="bg-gray-900 p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{title}</h3>
        <p className="text-xs text-white/70 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ filters, onClearFilters }) => {
  const hasActive = filters.search || filters.category !== 'all' || filters.level !== 'all';
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
        <div className="text-6xl mb-4 opacity-50">{hasActive ? '🔍' : '📚'}</div>
        <h3 className="text-xl font-medium text-white mb-2">
          {hasActive ? 'No courses found' : 'No courses available'}
        </h3>
        <p className="text-white/70 mb-6">
          {hasActive ? "Try adjusting your search or filters to find what you're looking for." : 'Check back later for new courses!'}
        </p>
        {hasActive && (
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
};

export default Explore;
