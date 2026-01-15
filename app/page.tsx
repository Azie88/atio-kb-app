'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRef } from 'react';
import { supabase, Technology } from '../lib/supabase';
import ChatBot from '../components/ChatBot';


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
  const catalogRef = useRef<HTMLDivElement>(null);

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

        // Check for comparison IDs in URL
        const params = new URLSearchParams(window.location.search);
        const compareIds = params.get('compare');
        if (compareIds) {
          const ids = compareIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
          setSelectedForComparison(ids.slice(0, 3));

          // Scroll to catalog after a short delay to ensure rendering
          setTimeout(() => {
            catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
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
    // Basic Filters
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;

    // Budget Filtering
    const matchesCost =
      maxCost === 'All' ? true :
        maxCost === 'Low' ? tech.cost === 'Low' :
          maxCost === 'Medium' ? (tech.cost === 'Low' || tech.cost === 'Medium') :
            maxCost === 'High' ? true : true;

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
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-700">
                ATIO Knowledge Base
              </h1>
              <p className="text-gray-700 text-sm mt-1">
                Discover, Compare & Adopt Agrifood Technologies
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/admin"
                className="flex-1 md:flex-none px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 h-[42px] flex items-center justify-center shadow-sm whitespace-nowrap"
              >
                ⚙️ Admin
              </Link>

              {/* Language Selector */}
              <div className="flex-1 md:flex-none relative">
                <select className="w-full px-4 py-2 pr-8 border-2 border-gray-400 rounded-lg bg-white hover:border-green-500 focus:ring-2 focus:ring-green-500 cursor-pointer text-gray-800 h-[42px] appearance-none shadow-sm capitalize">
                  <option value="en">🇬🇧 English</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="ar">🇸🇦 العربية</option>
                  <option value="sw">🇰🇪 Kiswahili</option>
                  <option value="hi">🇮🇳 हिन्दी</option>
                  <option value="zh">🇨🇳 中文</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Persona Portal */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Exploring as a...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer Portal Card */}
            <Link
              href="/recommendations?persona=Farmer"
              className="group relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🌾</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Farmer</h3>
                  <p className="text-green-50 text-sm opacity-90">
                    Find practical, affordable tools to optimize your farm.
                  </p>
                </div>
                <div className="mt-8 flex items-center text-white font-bold">
                  Get Recommendations <span className="ml-2 text-2xl transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform">
                🚜
              </div>
            </Link>

            {/* Researcher Portal Card */}
            <Link
              href="/analytics"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🔬</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Researcher</h3>
                  <p className="text-blue-50 text-sm opacity-90">
                    Explore data, technical specs, and clinical evidence.
                  </p>
                </div>
                <div className="mt-8 flex items-center text-white font-bold">
                  Explore Insights <span className="ml-2 text-2xl transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform">
                📊
              </div>
            </Link>

            {/* Policy Maker Portal Card */}
            <Link
              href="/policy"
              className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-fuchsia-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🏛️</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Policy Maker</h3>
                  <p className="text-purple-50 text-sm opacity-90">
                    Assess national impact and strategic infrastructure.
                  </p>
                </div>
                <div className="mt-8 flex items-center text-white font-bold">
                  View Strategy <span className="ml-2 text-2xl transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform">
                🌍
              </div>
            </Link>
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-700 text-lg">Loading technologies from database...</p>
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

            {/* Search Bar */}
            <div ref={catalogRef} id="catalog" className="max-w-2xl mx-auto mb-12 scroll-mt-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    className="w-full pl-11 pr-4 py-4 text-lg 
                             bg-white/95 text-gray-800 placeholder-gray-500
                             border-2 border-gray-200 rounded-2xl md:rounded-full shadow-sm
                             focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-green-600 text-white px-8 py-4 rounded-2xl md:rounded-full hover:bg-green-700 font-bold transition-all shadow-md active:scale-95">
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
            <div className="flex flex-col items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-3">
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
              <p className="text-center text-gray-700 text-sm font-medium">
                💡 Select 2 or more technologies (max 3) to compare them side-by-side.
              </p>
            </div>
            {/* Technology Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <div key={tech.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 relative group/card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedForComparison.includes(tech.id)}
                            onChange={() => toggleSelection(tech.id)}
                            disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(tech.id)}
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer disabled:opacity-30 transition-all"
                          />
                        </label>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${tech.category === 'Water Management' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          tech.category === 'Energy' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                            tech.category === 'Crop Innovation' ? 'bg-green-50 text-green-700 border border-green-100' :
                              tech.category === 'Digital Tools' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                'bg-gray-50 text-gray-700 border border-gray-100'
                          }`}>
                          {tech.category}
                        </span>
                      </div>
                      <span className="text-2xl transform group-hover/card:scale-110 transition-transform">{tech.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4">
                      {tech.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-semibold mr-2">Regions:</span>
                        <span>{tech.regions.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">💰 {tech.cost} Cost</span>
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
                  <p className="text-gray-700 text-lg">No technologies found. Try a different search!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      {/* Comparison Floating Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-green-500 p-6 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between pr-20 md:pr-24">
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
                className="text-sm text-gray-700 hover:text-gray-900"
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
      {!loading && !error && <ChatBot technologies={technologies} />}
    </div>
  );
}