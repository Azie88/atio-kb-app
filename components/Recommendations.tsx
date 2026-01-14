'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Technology } from '../lib/supabase';
import { getRecommendations, UserProfile } from '../lib/recommendations';

interface Props {
    technologies: Technology[];
}

export default function Recommendations({ technologies }: Props) {
    const [profile, setProfile] = useState<UserProfile>({
        region: '',
        budget: undefined,
        priority: 'cost'
    });
    const [showResults, setShowResults] = useState(false);

    const recommendations = getRecommendations(technologies, profile);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Get Personalized Recommendations
            </h2>

            {!showResults ? (
                <div className="space-y-4">
                    {/* Region Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Region
                        </label>
                        <select
                            value={profile.region}
                            onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select region...</option>
                            <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
                            <option value="South Asia">South Asia</option>
                            <option value="East Africa">East Africa</option>
                            <option value="Southeast Asia">Southeast Asia</option>
                            <option value="Latin America">Latin America</option>
                            <option value="Middle East">Middle East</option>
                        </select>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Budget Level
                        </label>
                        <div className="flex gap-2">
                            {(['Low', 'Medium', 'High'] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setProfile({ ...profile, budget: level })}
                                    className={`flex-1 py-2 rounded-lg border-2 transition-colors ${profile.budget === level
                                            ? 'border-green-600 bg-green-50 text-green-800 font-bold'
                                            : 'border-gray-300 hover:border-green-300'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            What's Most Important?
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'cost', label: 'Low Cost' },
                                { value: 'efficiency', label: 'High Efficiency' },
                                { value: 'sustainability', label: 'Sustainability' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setProfile({ ...profile, priority: option.value as any })}
                                    className={`flex-1 py-2 rounded-lg border-2 transition-colors ${profile.priority === option.value
                                            ? 'border-green-600 bg-green-50 text-green-800 font-bold'
                                            : 'border-gray-300 hover:border-green-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowResults(true)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold"
                    >
                        Get My Recommendations →
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setShowResults(false)}
                        className="text-green-600 hover:text-green-700 mb-4"
                    >
                        ← Change preferences
                    </button>

                    <div className="space-y-3">
                        <h3 className="font-bold text-lg">Top Recommendations for You:</h3>
                        {recommendations.map((tech, idx) => (
                            <div key={tech.id} className="border rounded-lg p-4 hover:border-green-500 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl font-bold text-green-600">#{idx + 1}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">{tech.icon}</span>
                                            <h4 className="font-bold text-lg">{tech.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{tech.description}</p>
                                        <div className="flex gap-2 text-xs">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {tech.cost} Cost
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                {tech.adoption_rate} adoption
                                            </span>
                                        </div>
                                        <Link
                                            href={`/technology/${tech.id}`}
                                            className="text-green-600 text-sm font-medium mt-2 inline-block hover:text-green-700"
                                        >
                                            Learn more →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}