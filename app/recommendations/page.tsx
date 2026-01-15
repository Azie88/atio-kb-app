'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase, Technology } from '../../lib/supabase';
import Recommendations from '../../components/Recommendations';

function RecommendationsContent() {
    const searchParams = useSearchParams();
    const persona = searchParams.get('persona');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <header className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <Link href="/" className="text-green-600 hover:text-green-700 font-medium mb-3 md:mb-2 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize leading-tight">
                        {persona ? `Recommendations for ${persona}s` : 'Get Personalized Recommendations'}
                    </h1>
                    <p className="text-gray-700 mt-2 md:mt-1 max-w-2xl">
                        {persona === 'Farmer'
                            ? 'Finding practical and affordable solutions to help you grow more with less.'
                            : persona === 'Researcher'
                                ? 'Exploring cutting-edge innovations and evidence-based technology reports.'
                                : 'Get AI-powered technology suggestions based on your budget, region, and priorities.'}
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-12">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
                        <p className="text-gray-700 text-lg">Loading database...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                        <h3 className="text-red-800 font-bold text-lg mb-2">⚠️ Error Loading Data</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <Recommendations technologies={technologies} />

                        {/* Farmer Matcher CTA */}
                        <div className="mt-12">
                            <Link
                                href="/matcher"
                                className="group block bg-gradient-to-r from-green-700 to-emerald-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            🚜 Find the Perfect Fit for Your Farm
                                        </h3>
                                        <p className="text-green-100 opacity-90">
                                            Not sure which tool is right? Use our deep-dive matcher to see what fits your soil, climate, and budget.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl text-white font-bold group-hover:bg-white group-hover:text-emerald-900 transition-all">
                                        Open Farm Matcher →
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function RecommendationsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            </div>
        }>
            <RecommendationsContent />
        </Suspense>
    );
}
