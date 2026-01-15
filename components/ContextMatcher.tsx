'use client';

import { useState } from 'react';
import { Technology } from '../lib/supabase';

interface Props {
    technologies: Technology[];
}

export default function ContextMatcher({ technologies }: Props) {
    const [userContext, setUserContext] = useState({
        region: '',
        incomeLevel: '',
        environment: ''
    });
    const [showResults, setShowResults] = useState(false);

    const matchedTechs = technologies.filter(tech => {
        if (!userContext.region && !userContext.incomeLevel && !userContext.environment) {
            return false;
        }

        let matches = true;

        // Region match
        if (userContext.region && !tech.regions.includes(userContext.region)) {
            matches = false;
        }

        // Income level (cost matching)
        if (userContext.incomeLevel === 'Low-income' && tech.cost === 'High') {
            matches = false;
        }
        if (userContext.incomeLevel === 'Lower-middle-income' && tech.cost === 'High') {
            matches = false;
        }

        // Environment (simplified - you can expand this)
        if (userContext.environment === 'Water-scarce' &&
            !tech.category.includes('Water') &&
            !tech.name.toLowerCase().includes('drought')) {
            // Prefer water-related tech in water-scarce areas
        }

        return matches;
    });

    const suitabilityScore = (tech: Technology) => {
        let score = 0;
        if (userContext.region && tech.regions.includes(userContext.region)) score += 40;
        if (userContext.incomeLevel === 'Low-income' && tech.cost === 'Low') score += 30;
        if (userContext.incomeLevel === 'Lower-middle-income' && tech.cost !== 'High') score += 20;

        const adoptionNum = parseInt(tech.adoption_rate);
        if (!isNaN(adoptionNum)) score += adoptionNum / 3;

        return Math.min(100, score);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-md p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                🎯 Contextual Technology Matcher
            </h2>
            <p className="text-gray-700 mb-4">
                Find technologies suitable for your specific context
            </p>

            {!showResults ? (
                <div className="space-y-4">
                    {/* Region */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Your Region / Target Area
                        </label>
                        <select
                            value={userContext.region}
                            onChange={(e) => setUserContext({ ...userContext, region: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select region...</option>
                            <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
                            <option value="East Africa">East Africa</option>
                            <option value="West Africa">West Africa</option>
                            <option value="South Asia">South Asia</option>
                            <option value="Southeast Asia">Southeast Asia</option>
                            <option value="Latin America">Latin America</option>
                            <option value="Middle East">Middle East</option>
                            <option value="North America">North America</option>
                            <option value="Europe">Europe</option>
                        </select>
                    </div>

                    {/* Income Level */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Country Income Level (World Bank Classification)
                        </label>
                        <select
                            value={userContext.incomeLevel}
                            onChange={(e) => setUserContext({ ...userContext, incomeLevel: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select income level...</option>
                            <option value="Low-income">Low-income (LIC)</option>
                            <option value="Lower-middle-income">Lower-middle-income (LMIC)</option>
                            <option value="Upper-middle-income">Upper-middle-income (UMIC)</option>
                            <option value="High-income">High-income (HIC)</option>
                        </select>
                    </div>

                    {/* Environment */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Primary Environmental Challenge
                        </label>
                        <select
                            value={userContext.environment}
                            onChange={(e) => setUserContext({ ...userContext, environment: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select challenge...</option>
                            <option value="Water-scarce">Water scarcity / Drought</option>
                            <option value="Flooding">Flooding / Excess water</option>
                            <option value="Poor-soil">Poor soil quality</option>
                            <option value="Extreme-heat">Extreme heat</option>
                            <option value="Limited-energy">Limited energy access</option>
                            <option value="Post-harvest">Post-harvest losses</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowResults(true)}
                        disabled={!userContext.region && !userContext.incomeLevel && !userContext.environment}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🔍 Find Suitable Technologies
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setShowResults(false)}
                        className="text-blue-600 hover:text-blue-700 mb-4 font-medium"
                    >
                        ← Modify context
                    </button>

                    <div className="bg-white rounded-lg p-4 mb-4">
                        <h3 className="font-bold mb-2">Your Context:</h3>
                        <div className="flex flex-wrap gap-2">
                            {userContext.region && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    📍 {userContext.region}
                                </span>
                            )}
                            {userContext.incomeLevel && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    💰 {userContext.incomeLevel}
                                </span>
                            )}
                            {userContext.environment && (
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                    🌍 {userContext.environment}
                                </span>
                            )}
                        </div>
                    </div>

                    {matchedTechs.length === 0 ? (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                            <p className="text-yellow-800">
                                No exact matches found. Try adjusting your context or browse all technologies.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">
                                {matchedTechs.length} Suitable Technologies Found
                            </h3>
                            {matchedTechs
                                .sort((a, b) => suitabilityScore(b) - suitabilityScore(a))
                                .map(tech => {
                                    const score = suitabilityScore(tech);
                                    return (
                                        <div key={tech.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{tech.icon}</span>
                                                    <h4 className="font-bold text-lg">{tech.name}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-700">Suitability Score</div>
                                                    <div className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' :
                                                        score >= 40 ? 'text-yellow-600' : 'text-orange-600'
                                                        }`}>
                                                        {score}%
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">{tech.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {tech.category}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${tech.cost === 'Low' ? 'bg-green-100 text-green-800' :
                                                    tech.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {tech.cost} Cost
                                                </span>
                                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                                    {tech.adoption_rate} adoption
                                                </span>
                                            </div>

                                            <div className="text-xs text-gray-700 mb-2">
                                                <strong>Why it matches:</strong>
                                                <ul className="list-disc list-inside mt-1">
                                                    {userContext.region && tech.regions.includes(userContext.region) && (
                                                        <li>Proven success in {userContext.region}</li>
                                                    )}
                                                    {userContext.incomeLevel && tech.cost !== 'High' && (
                                                        <li>Affordable for {userContext.incomeLevel} countries</li>
                                                    )}
                                                    {tech.maturity_level === 'Mature' && (
                                                        <li>Mature technology with established track record</li>
                                                    )}
                                                </ul>
                                            </div>

                                            <a
                                                href={`/technology/${tech.id}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                View full details →
                                            </a>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}