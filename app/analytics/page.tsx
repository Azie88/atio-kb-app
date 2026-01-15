'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../../lib/supabase';

export default function AnalyticsPage() {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const { data } = await supabase.from('technologies').select('*');
            setTechnologies(data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    // Calculate analytics
    const totalTech = technologies.length;
    const byCategory = technologies.reduce((acc, tech) => {
        acc[tech.category] = (acc[tech.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const byCost = technologies.reduce((acc, tech) => {
        acc[tech.cost] = (acc[tech.cost] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const avgAdoption = technologies.reduce((sum, tech) =>
        sum + parseFloat(tech.adoption_rate), 0) / totalTech;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="text-green-600 hover:text-green-700 mb-4 inline-block font-medium">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-tight">
                    📊 ATIO Analytics Dashboard
                </h1>

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border-b-4 border-green-500">
                        <div className="text-3xl md:text-4xl font-bold text-green-600">{totalTech}</div>
                        <div className="text-sm text-gray-700 font-bold mt-1">Total Technologies</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border-b-4 border-blue-500">
                        <div className="text-3xl md:text-4xl font-bold text-blue-600">
                            {Object.keys(byCategory).length}
                        </div>
                        <div className="text-sm text-gray-700 font-bold mt-1">Categories</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border-b-4 border-purple-500">
                        <div className="text-3xl md:text-4xl font-bold text-purple-600">
                            {avgAdoption.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-700 font-bold mt-1">Avg Adoption</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border-b-4 border-orange-500">
                        <div className="text-3xl md:text-4xl font-bold text-orange-600">
                            {technologies.filter(t => t.maturity_level === 'Mature').length}
                        </div>
                        <div className="text-sm text-gray-700 font-bold mt-1">Mature Tech</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* By Category */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Technologies by Category</h3>
                        <div className="space-y-3">
                            {Object.entries(byCategory).map(([cat, count]) => (
                                <div key={cat}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-800">{cat}</span>
                                        <span className="text-sm text-gray-800">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${(count / totalTech) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* By Cost */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Cost Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(byCost).map(([cost, count]) => (
                                <div key={cost}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-800">{cost}</span>
                                        <span className="text-sm text-gray-800">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${cost === 'Low' ? 'bg-green-500' :
                                                cost === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${(count / totalTech) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Context Matcher CTA */}
                <div className="mt-12">
                    <Link
                        href="/matcher"
                        className="group block bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    🔬 Validate Technical Feasibility
                                </h3>
                                <p className="text-blue-100 opacity-90">
                                    Use the Technical Context Matcher to verify how these innovations perform in specific environmental variables.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl text-white font-bold group-hover:bg-white group-hover:text-blue-900 transition-all">
                                Run Technical Match →
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}