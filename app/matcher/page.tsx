'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../../lib/supabase';
import ContextMatcher from '../../components/ContextMatcher';

export default function MatcherPage() {
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
            <header className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/" className="text-green-600 hover:text-green-700 font-medium mb-2 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Contextual Technology Matcher
                    </h1>
                    <p className="text-gray-700 mt-1">
                        Find the perfect agrifood solutions tailored to your specific environment and needs.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 pb-12">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
                        <p className="text-gray-700 text-lg">Loading technologies...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                        <h3 className="text-red-800 font-bold text-lg mb-2">⚠️ Error Loading Data</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <ContextMatcher technologies={technologies} />
                )}
            </main>
        </div>
    );
}
