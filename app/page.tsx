'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../lib/supabase';

const categories = [
  'All',
  'Water Management',
  'Energy',
  'Crop Innovation',
  'Digital Tools',
  'Post-Harvest',
  'Soil Health'
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [maxCost, setMaxCost] = useState('All');

  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('technologies')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        setTechnologies(data || []);
      } catch (error: any) {
        console.error('Error fetching technologies:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTechnologies();
  }, []);

  const toggleSelection = (id: number) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(techId => techId !== id));
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  // Filter technologies based on search and category
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;
    const matchesCost =
      maxCost === 'All' ? true :  // ← If "All", don't filter by cost at all
        maxCost === 'Low' ? tech.cost === 'Low' :
          maxCost === 'Medium' ? (tech.cost === 'Low' || tech.cost === 'Medium') :
            maxCost === 'High' ? true : // ← "High" shows all cost levels
              true;
    return matchesSearch && matchesCategory && matchesCost;
  });

  // Calculate statistics
  const stats = {
    total: technologies.length,
    displayed: filteredTechnologies.length,
    categories: new Set(technologies.map(t => t.category)).size,
    regions: new Set(technologies.flatMap(t => t.regions)).size
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-700">
            ATIO Knowledge Base
          </h1>
          <p className="text-gray-600 mt-1">
            Discover agrifood technologies for sustainable farming
          </p>
        </div>
      </header>

      {/* Main content will go here */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading technologies from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-bold text-lg mb-2">⚠️ Error Loading Data</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-2">Check your Supabase connection and try again.</p>
          </div>
        )}

        {/* Only show content if not loading and no error */}
        {!loading && !error && (
          <>
            {/* Your existing stats, filters, and cards go here */}
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Technologies</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.categories}</div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.regions}</div>
                <div className="text-sm text-gray-600 mt-1">Regions</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.displayed}</div>
                <div className="text-sm text-gray-600 mt-1">Showing</div>
              </div>
            </div>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search technologies... (e.g., irrigation, solar)"
                  className="w-full px-6 py-4 text-lg 
             bg-white/95 text-gray-600 placeholder-gray-400
             border-2 border-gray-200 rounded-full shadow-sm
             focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
                  Search
                </button>
              </div>
            </div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-gray-700 font-medium">Max Budget:</span>
              <div className="flex gap-2">
                {['All', 'Low', 'Medium', 'High'].map(cost => (
                  <button
                    key={cost}
                    onClick={() => setMaxCost(cost)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${maxCost === cost
                      ? cost === 'Low' ? 'bg-green-600 text-white' :
                        cost === 'Medium' ? 'bg-yellow-500 text-white' :
                          cost === 'High' ? 'bg-red-600 text-white' :
                            'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                  >
                    💰 {cost}
                  </button>
                ))}
              </div>
            </div>
            {/* Technology Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <div key={tech.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 relative">
                    <div className="absolute top-3 left-3">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(tech.id)}
                        onChange={() => toggleSelection(tech.id)}
                        disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(tech.id)}
                        className="w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-start justify-between mb-3 pl-8">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tech.category === 'Water Management' ? 'bg-blue-100 text-blue-800' :
                        tech.category === 'Energy' ? 'bg-yellow-100 text-yellow-800' :
                          tech.category === 'Crop Innovation' ? 'bg-green-100 text-green-800' :
                            tech.category === 'Digital Tools' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {tech.category}
                      </span>
                      <span className="text-2xl">{tech.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {tech.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="font-semibold mr-2">Regions:</span>
                        <span>{tech.regions.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">💰 {tech.cost} Cost</span>
                      <Link
                        href={`/technology/${tech.id}`}
                        className="text-green-600 font-semibold hover:text-green-700"
                      >
                        Learn more →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">No technologies found. Try a different search!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      {/* Comparison Floating Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-green-500 p-6 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-800">
                {selectedForComparison.length} selected for comparison
              </span>
              {selectedForComparison.length >= 3 && (
                <span className="text-sm text-orange-600 font-medium">
                  (Maximum 3 technologies)
                </span>
              )}
              <button
                onClick={() => setSelectedForComparison([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>
            <Link
              href={`/compare?ids=${selectedForComparison.join(',')}`}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Compare Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}