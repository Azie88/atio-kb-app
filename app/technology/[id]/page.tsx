'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase, Technology } from '../../../lib/supabase';

export default function TechnologyDetail() {
    const params = useParams();
    const id = parseInt(params.id as string);

    // Find the technology
    const [tech, setTech] = useState<Technology | null>(null);
    const [loading, setLoading] = useState(true);
    const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch the specific technology
                const { data: techData, error: techError } = await supabase
                    .from('technologies')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (techError) throw techError;
                setTech(techData);

                // Fetch all for "similar technologies"
                const { data: allData } = await supabase
                    .from('technologies')
                    .select('*');
                setAllTechnologies(allData || []);

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            </div>
        );
    }

    // If not found, show error
    if (!tech) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Technology Not Found</h1>
                    <Link href="/" className="text-green-600 hover:text-green-700">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/" className="text-green-600 hover:text-green-700 font-medium mb-2 inline-block">
                        ← Back to all technologies
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">{tech.name}</h1>
                            <p className="text-gray-600 mt-2">{tech.description}</p>
                        </div>
                        <span className="text-6xl">{tech.icon}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">Category</div>
                        <div className="font-bold text-lg text-gray-800">{tech.category}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">Cost Level</div>
                        <div className="font-bold text-lg text-gray-800">{tech.cost}</div>
                        <div className="text-xs text-gray-500 mt-1">{tech.cost_range}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">Maturity</div>
                        <div className="font-bold text-lg text-gray-800">{tech.maturity_level}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600 mb-1">Adoption Rate</div>
                        <div className="font-bold text-lg text-green-600">{tech.adoption_rate}</div>
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Full Description */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{tech.full_description}</p>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Benefits</h2>
                            <ul className="space-y-2">
                                {tech.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Challenges */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Challenges & Considerations</h2>
                            <ul className="space-y-2">
                                {tech.challenges.map((challenge, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-orange-500 mr-2">⚠</span>
                                        <span className="text-gray-700">{challenge}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Suitable For */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Suitable For</h3>
                            <div className="space-y-2">
                                {tech.suitable_for.map((item, index) => (
                                    <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Target Regions</h3>
                            <div className="space-y-2">
                                {tech.regions.map((region, index) => (
                                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm">
                                        🌍 {region}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Compare Button */}
                        <Link
                            href={`/compare?ids=${tech.id}`}
                            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Compare with Others
                        </Link>
                    </div>
                </div>
                {/* Similar Technologies */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Technologies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {allTechnologies
                            .filter(t => t.category === tech.category && t.id !== tech.id)
                            .slice(0, 3)
                            .map(similar => (
                                <div key={similar.id} className="border rounded-lg p-4 hover:border-green-500 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{similar.icon}</span>
                                        <h3 className="font-bold">{similar.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{similar.description}</p>
                                    <Link
                                        href={`/compare?ids=${tech.id},${similar.id}`}
                                        className="text-green-600 text-sm hover:text-green-700 font-medium"
                                    >
                                        Compare with {tech.name} →
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            </main>
        </div>
    );
}