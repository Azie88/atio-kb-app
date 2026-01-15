'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../../lib/supabase';

export default function PolicyPage() {
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

    // Policy-focused filtering: High impact/maturity
    const highMaturityTech = technologies.filter(tech =>
        tech.category === 'Water Management' ||
        tech.category === 'Energy' ||
        tech.category === 'Soil Health'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <header className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
                    <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium mb-2 inline-block">
                        ← Back to Home
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                🏛️ Policy & Planning Dashboard
                            </h1>
                            <p className="text-gray-700 mt-1">
                                Evidence-based assessment for agricultural infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-12">
                {/* Policy KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Strategic Pillars</h3>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">7 Categories</p>
                        <p className="text-sm text-green-600 mt-1">Wide regional coverage</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">High Maturity Tech</h3>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{highMaturityTech.length} Solutions</p>
                        <p className="text-sm text-blue-600 mt-1">Ready for national scale-up</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 sm:col-span-2 md:col-span-1">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Impact Data</h3>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">100% Evidence</p>
                        <p className="text-sm text-emerald-600 mt-1">Verified case studies</p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 md:p-8 border-b-2 border-gray-50">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Strategic Technology Assessment</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] md:min-w-full">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b-2 border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-700">Technology</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Strategic Category</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Implementation Cost</th>
                                        <th className="px-6 py-4 font-bold text-gray-700 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {highMaturityTech.map(tech => (
                                        <tr key={tech.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{tech.icon}</span>
                                                    <span className="font-bold text-gray-900">{tech.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                                                    {tech.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {tech.cost}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/technology/${tech.id}`} className="text-purple-600 hover:text-purple-700 font-bold text-sm">
                                                    View Impact Report →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 md:hidden">
                        ← Scroll horizontally to see more details →
                    </div>
                </section>

                {/* Policy Matcher CTA */}
                <div className="mt-12">
                    <Link
                        href="/matcher"
                        className="group block bg-gradient-to-r from-purple-700 to-fuchsia-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    🏛️ Evaluate Regional Feasibility
                                </h3>
                                <p className="text-purple-100 opacity-90">
                                    Use the Matcher to assess how technologies align with local infrastructure and environmental constraints for national planning.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl text-white font-bold group-hover:bg-white group-hover:text-purple-900 transition-all">
                                Assess Feasibility →
                            </div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
