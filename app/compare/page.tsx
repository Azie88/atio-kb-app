'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { supabase, Technology } from '../../lib/supabase';

function CompareContent() {
    const searchParams = useSearchParams();

    // Get IDs from URL
    const idsParam = searchParams.get('ids');
    const ids = idsParam ? idsParam.split(',').map(id => parseInt(id)) : [];

    // Get technologies to compare
    const [techsToCompare, setTechsToCompare] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTechnologies() {
            if (ids.length === 0) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('technologies')
                .select('*')
                .in('id', ids);

            setTechsToCompare(data || []);
            setLoading(false);
        }

        fetchTechnologies();
    }, [idsParam]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (techsToCompare.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">No Technologies Selected</h1>
                    <p className="text-gray-700 mb-6">Please select technologies to compare from the homepage.</p>
                    <Link href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/" className="text-green-600 hover:text-green-700 font-medium mb-2 inline-block">
                        ← Back to all technologies
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Technology Comparison</h1>
                    <p className="text-gray-700 mt-1">Compare {techsToCompare.length} technologies side by side</p>
                </div>
            </header>

            {/* Comparison Table */}
            <main className="max-w-7xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-green-600 text-white">
                                    <th className="px-6 py-4 text-left font-bold sticky left-0 bg-green-600 z-10">Feature</th>
                                    {techsToCompare.map(tech => (
                                        <th key={tech.id} className="px-6 py-4 text-left min-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">{tech.icon}</span>
                                                <div>
                                                    <div className="font-bold">{tech.name}</div>
                                                    <div className="text-sm font-normal opacity-90">{tech.category}</div>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Description */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Description</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">{tech.description}</td>
                                    ))}
                                </tr>

                                {/* Cost */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Cost Level</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${tech.cost === 'Low' ? 'bg-green-100 text-green-800' :
                                                tech.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {tech.cost}
                                            </div>
                                            <div className="text-sm text-gray-700 mt-1">{tech.cost_range}</div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Maturity */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Maturity Level</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {tech.maturity_level}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Adoption Rate */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Adoption Rate</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: tech.adoption_rate }}
                                                    />
                                                </div>
                                                <span className="font-bold text-green-600 min-w-[3rem]">{tech.adoption_rate}</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Regions */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Target Regions</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {tech.regions.map((region, idx) => (
                                                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        🌍 {region}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Benefits */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Key Benefits</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <ul className="space-y-2">
                                                {tech.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="text-sm flex items-start">
                                                        <span className="text-green-500 mr-2 font-bold">✓</span>
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>

                                {/* Challenges */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Main Challenges</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <ul className="space-y-2">
                                                {tech.challenges.map((challenge, idx) => (
                                                    <li key={idx} className="text-sm flex items-start">
                                                        <span className="text-orange-500 mr-2 font-bold">⚠</span>
                                                        <span>{challenge}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>

                                {/* Suitable For */}
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold bg-gray-50 sticky left-0 z-10">Suitable For</td>
                                    {techsToCompare.map(tech => (
                                        <td key={tech.id} className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {tech.suitable_for.map((item, idx) => (
                                                    <span key={idx} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {techsToCompare.map(tech => (
                        <Link
                            key={tech.id}
                            href={`/technology/${tech.id}`}
                            className="bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                        >
                            View {tech.name} Details →
                        </Link>
                    ))}
                </div>

                {/* Export Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        📄 Export as PDF
                    </button>
                </div>
            </main>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Comparison...</h2>
                    <p className="text-gray-700">Preparing side-by-side analysis</p>
                </div>
            </div>
        }>
            <CompareContent />
        </Suspense>
    );
}