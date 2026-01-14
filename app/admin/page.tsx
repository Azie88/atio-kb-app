'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../../lib/supabase';

export default function AdminPanel() {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Water Management',
        description: '',
        full_description: '',
        cost: 'Medium',
        cost_range: '',
        icon: '💧',
        maturity_level: 'Proven',
        adoption_rate: '0%',
        regions: '',
        benefits: '',
        challenges: '',
        suitable_for: '',
        evidence_links: ''
    });

    useEffect(() => {
        fetchTechnologies();
    }, []);

    async function fetchTechnologies() {
        setLoading(true);
        const { data, error } = await supabase
            .from('technologies')
            .select('*')
            .order('name');

        if (!error && data) {
            setTechnologies(data);
        }
        setLoading(false);
    }

    function resetForm() {
        setFormData({
            name: '',
            category: 'Water Management',
            description: '',
            full_description: '',
            cost: 'Medium',
            cost_range: '',
            icon: '💧',
            maturity_level: 'Proven',
            adoption_rate: '0%',
            regions: '',
            benefits: '',
            challenges: '',
            suitable_for: '',
            evidence_links: ''
        });
        setEditingId(null);
        setShowForm(false);
    }

    function handleEdit(tech: Technology) {
        setFormData({
            name: tech.name,
            category: tech.category,
            description: tech.description,
            full_description: tech.full_description || '',
            cost: tech.cost,
            cost_range: tech.cost_range || '',
            icon: tech.icon,
            maturity_level: tech.maturity_level || 'Proven',
            adoption_rate: tech.adoption_rate || '0%',
            regions: tech.regions.join(', '),
            benefits: tech.benefits.join(', '),
            challenges: tech.challenges.join(', '),
            suitable_for: tech.suitable_for.join(', '),
            evidence_links: tech.evidence_links.join(', ')
        });
        setEditingId(tech.id);
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const techData = {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            full_description: formData.full_description,
            cost: formData.cost,
            cost_range: formData.cost_range,
            icon: formData.icon,
            maturity_level: formData.maturity_level,
            adoption_rate: formData.adoption_rate,
            regions: formData.regions.split(',').map(s => s.trim()).filter(Boolean),
            benefits: formData.benefits.split(',').map(s => s.trim()).filter(Boolean),
            challenges: formData.challenges.split(',').map(s => s.trim()).filter(Boolean),
            suitable_for: formData.suitable_for.split(',').map(s => s.trim()).filter(Boolean),
            evidence_links: formData.evidence_links.split(',').map(s => s.trim()).filter(Boolean)
        };

        if (editingId) {
            // Update existing
            const { error } = await supabase
                .from('technologies')
                .update(techData)
                .eq('id', editingId);

            if (error) {
                alert('Error updating: ' + error.message);
                return;
            }
            alert('Technology updated successfully!');
        } else {
            // Insert new
            const { error } = await supabase
                .from('technologies')
                .insert([techData]);

            if (error) {
                alert('Error adding: ' + error.message);
                return;
            }
            alert('Technology added successfully!');
        }

        resetForm();
        fetchTechnologies();
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        const { error } = await supabase
            .from('technologies')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting: ' + error.message);
            return;
        }

        alert('Technology deleted successfully!');
        fetchTechnologies();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="text-green-600 hover:text-green-700 mb-2 inline-block">
                            ← Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-800">⚙️ Admin Panel</h1>
                        <p className="text-gray-600 mt-1">Manage ATIO technologies database</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold"
                    >
                        {showForm ? '✕ Cancel' : '+ Add New Technology'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingId ? 'Edit Technology' : 'Add New Technology'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Technology Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., Drip Irrigation"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option>Water Management</option>
                                        <option>Energy</option>
                                        <option>Crop Innovation</option>
                                        <option>Digital Tools</option>
                                        <option>Post-Harvest</option>
                                        <option>Soil Health</option>
                                    </select>
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Icon (Emoji) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="💧"
                                    />
                                </div>

                                {/* Cost */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost Level *
                                    </label>
                                    <select
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>

                                {/* Cost Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost Range
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cost_range}
                                        onChange={(e) => setFormData({ ...formData, cost_range: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., $500 - $2,000 per hectare"
                                    />
                                </div>

                                {/* Maturity Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maturity Level
                                    </label>
                                    <select
                                        value={formData.maturity_level}
                                        onChange={(e) => setFormData({ ...formData, maturity_level: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option>Emerging</option>
                                        <option>Proven</option>
                                        <option>Mature</option>
                                    </select>
                                </div>

                                {/* Adoption Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adoption Rate
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.adoption_rate}
                                        onChange={(e) => setFormData({ ...formData, adoption_rate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., 35%"
                                    />
                                </div>
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Description * (for cards)
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={2}
                                    placeholder="Brief description (1-2 sentences)"
                                />
                            </div>

                            {/* Full Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Description (for detail page)
                                </label>
                                <textarea
                                    value={formData.full_description}
                                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={4}
                                    placeholder="Detailed description with technical information..."
                                />
                            </div>

                            {/* Comma-separated lists */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Regions (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.regions}
                                        onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Sub-Saharan Africa, South Asia"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Suitable For (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.suitable_for}
                                        onChange={(e) => setFormData({ ...formData, suitable_for: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Vegetables, Fruits, Row crops"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Benefits (comma-separated)
                                </label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={2}
                                    placeholder="Reduces water usage by 30-60%, Increases crop yields, Low maintenance"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Challenges (comma-separated)
                                </label>
                                <textarea
                                    value={formData.challenges}
                                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={2}
                                    placeholder="High initial cost, Requires training, Limited availability"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Evidence Links (comma-separated URLs)
                                </label>
                                <input
                                    type="text"
                                    value={formData.evidence_links}
                                    onChange={(e) => setFormData({ ...formData, evidence_links: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="https://example.com/study1, https://example.com/study2"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold"
                                >
                                    {editingId ? '💾 Update Technology' : '✓ Add Technology'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Technologies List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Existing Technologies ({technologies.length})</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto"></div>
                        </div>
                    ) : technologies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No technologies yet. Add your first one above!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {technologies.map(tech => (
                                <div key={tech.id} className="border rounded-lg p-4 hover:border-green-500 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl">{tech.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-lg">{tech.name}</h3>
                                                    <div className="flex gap-2 text-xs mt-1">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            {tech.category}
                                                        </span>
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            {tech.cost}
                                                        </span>
                                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                            {tech.maturity_level}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{tech.description}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(tech)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tech.id, tech.name)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}