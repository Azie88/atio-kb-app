'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Technology } from '../../lib/supabase';

export default function AdminPanel() {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loginLoading, setLoginLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Navigation and View State
    const [currentView, setCurrentView] = useState<'overview' | 'technologies' | 'users'>('overview');
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userForm, setUserForm] = useState({ email: '', role: 'Admin' });
    const [userError, setUserError] = useState('');

    // Panel view states
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
        checkSession();
    }, []);

    async function checkSession() {
        setAuthLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                await fetchTechnologies();
            }
        } catch (err) {
            console.error('Session check error:', err);
        } finally {
            setAuthLoading(false);
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        console.log('Login attempt started...');
        setLoginError('');
        setLoginLoading(true);

        // Safety timeout: 10 seconds
        const timeout = setTimeout(() => {
            setLoginLoading(false);
            setLoginError('Request timed out. Please check your connection or Supabase settings.');
        }, 15000); // 15s for slower connections

        try {
            console.log('Calling Supabase signIn...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            clearTimeout(timeout);
            console.log('Supabase responded:', { hasData: !!data, hasError: !!error });

            if (error) {
                setLoginError(error.message);
                return;
            }

            if (data.session) {
                console.log('Login successful, session found.');
                setIsAuthenticated(true);
                fetchTechnologies();
            } else {
                console.log('No session returned after login');
                setLoginError('No session created. Please check if your account is confirmed.');
            }
        } catch (err: any) {
            console.error('Critical Login Error:', err);
            setLoginError('A critical system error occurred: ' + (err.message || 'Unknown error'));
        } finally {
            console.log('Login process finished.');
            setLoginLoading(false);
            clearTimeout(timeout);
        }
    }

    async function handleLogout() {
        try {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setTechnologies([]);
            setCurrentView('overview');
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

    async function fetchUsers() {
        setUsersLoading(true);
        setUserError('');
        try {
            // Attempt to fetch from profiles table
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error('Fetch users error:', err);
            setUserError('User management requires a "profiles" table with Row Level Security enabled.');
        } finally {
            setUsersLoading(false);
        }
    }

    async function handleAddUser(e: React.FormEvent) {
        e.preventDefault();
        setUsersLoading(true);
        setUserError('');
        try {
            const { error } = await supabase
                .from('profiles')
                .insert([{
                    email: userForm.email,
                    role: userForm.role,
                    created_at: new Error().stack // Simple way to generate a timestamp if not automatic
                }]);

            if (error) throw error;
            setUserForm({ email: '', role: 'Admin' });
            fetchUsers();
        } catch (err: any) {
            setUserError(err.message);
        } finally {
            setUsersLoading(false);
        }
    }

    async function handleDeleteUser(id: any) {
        if (!confirm('Are you sure you want to remove this user from the dashboard?')) return;
        setUsersLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchUsers();
        } catch (err: any) {
            setUserError(err.message);
        } finally {
            setUsersLoading(false);
        }
    }

    async function fetchTechnologies() {
        setDataLoading(true);
        try {
            const { data, error } = await supabase
                .from('technologies')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) {
                setTechnologies(data);
            }
        } catch (error: any) {
            console.error('Error fetching technologies:', error);
        } finally {
            setDataLoading(false);
        }
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

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-2">🔐</div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-gray-600">Authorized personnel only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 font-medium">
                                ⚠️ {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loginLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Login to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t pt-6">
                        <Link href="/" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
                            ← Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <header className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        {currentView === 'overview' ? (
                            <Link href="/" className="text-green-600 hover:text-green-700 mb-2 inline-block font-medium">
                                ← Back to Home
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    setCurrentView('overview');
                                    setShowForm(false);
                                    setEditingId(null);
                                }}
                                className="text-green-600 hover:text-green-700 mb-2 inline-block font-medium"
                            >
                                ← Back to Overview
                            </button>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {currentView === 'overview' && '⚙️ Admin Panel'}
                            {currentView === 'technologies' && '📚 Technology Management'}
                            {currentView === 'users' && '👥 User Management'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {currentView === 'overview' && 'Select an administrative task to begin.'}
                            {currentView === 'technologies' && 'Add, edit, or remove technologies from the ATIO database.'}
                            {currentView === 'users' && 'Manage dashboard access and user permissions.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-bold transition-all active:scale-95"
                        >
                            Logout
                        </button>
                        {currentView === 'technologies' && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-bold shadow-md transition-all active:scale-95"
                            >
                                {showForm ? '✕ Cancel' : '+ Add New Technology'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-12">
                {/* 1. OVERVIEW VIEW */}
                {currentView === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Technology Management Card */}
                        <button
                            onClick={() => setCurrentView('technologies')}
                            className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all text-left flex items-start gap-6 border-b-8 border-b-green-500"
                        >
                            <div className="text-5xl group-hover:scale-110 transition-transform">📚</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Technologies</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    Update the central database of agrifood technologies, including descriptions, costs, and maturity levels.
                                </p>
                                <div className="mt-4 text-green-600 font-bold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                                    Open Manager <span>→</span>
                                </div>
                            </div>
                        </button>

                        {/* User Management Card */}
                        <button
                            onClick={() => {
                                setCurrentView('users');
                                fetchUsers();
                            }}
                            className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all text-left flex items-start gap-6 border-b-8 border-b-blue-500"
                        >
                            <div className="text-5xl group-hover:scale-110 transition-transform">👥</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Users</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    Control who has access to the admin dashboard and manage authorized personnel profiles.
                                </p>
                                <div className="mt-4 text-blue-600 font-bold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                                    Open List <span>→</span>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* 2. TECHNOLOGIES VIEW */}
                {currentView === 'technologies' && (
                    <>
                        {/* Add/Edit Form */}
                        {
                            showForm && (
                                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-green-50 animate-slide-up">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                                        {editingId ? 'Edit Technology' : 'Add New Technology'}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Technology Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                    placeholder="e.g., Drip Irrigation"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Category *
                                                </label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900 appearance-none bg-white"
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
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Icon (Emoji) *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.icon}
                                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                    placeholder="💧"
                                                />
                                            </div>

                                            {/* Cost */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Cost Level *
                                                </label>
                                                <select
                                                    value={formData.cost}
                                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900 appearance-none bg-white font-medium"
                                                >
                                                    <option>Low</option>
                                                    <option>Medium</option>
                                                    <option>High</option>
                                                </select>
                                            </div>

                                            {/* Cost Range */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Cost Range
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.cost_range}
                                                    onChange={(e) => setFormData({ ...formData, cost_range: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                    placeholder="e.g., $500 - $2,000 per hectare"
                                                />
                                            </div>

                                            {/* Maturity Level */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Maturity Level
                                                </label>
                                                <select
                                                    value={formData.maturity_level}
                                                    onChange={(e) => setFormData({ ...formData, maturity_level: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900 appearance-none bg-white font-medium"
                                                >
                                                    <option>Emerging</option>
                                                    <option>Proven</option>
                                                    <option>Mature</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Short Description */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Short Description * (for cards)
                                            </label>
                                            <textarea
                                                required
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800 leading-relaxed font-normal"
                                                rows={2}
                                                placeholder="Brief description (1-2 sentences)"
                                            />
                                        </div>

                                        {/* Full Description */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Full Description (for detail page)
                                            </label>
                                            <textarea
                                                value={formData.full_description}
                                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800 leading-relaxed"
                                                rows={4}
                                                placeholder="Detailed description with technical information..."
                                            />
                                        </div>

                                        {/* Comma-separated lists */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Target Regions (comma-separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.regions}
                                                    onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                    placeholder="Sub-Saharan Africa, South Asia"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Suitable For (comma-separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.suitable_for}
                                                    onChange={(e) => setFormData({ ...formData, suitable_for: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                    placeholder="Vegetables, Fruits, Row crops"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Benefits (comma-separated)
                                                </label>
                                                <textarea
                                                    value={formData.benefits}
                                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800"
                                                    rows={3}
                                                    placeholder="Reduces water usage by 30-60%, Increases crop yields..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Challenges (comma-separated)
                                                </label>
                                                <textarea
                                                    value={formData.challenges}
                                                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800"
                                                    rows={3}
                                                    placeholder="High initial cost, Requires training..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Evidence Links (comma-separated URLs)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.evidence_links}
                                                onChange={(e) => setFormData({ ...formData, evidence_links: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900"
                                                placeholder="https://example.com/study1, https://example.com/study2"
                                            />
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 text-lg"
                                            >
                                                {editingId ? '💾 Update Technology' : '✓ Add Technology'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }

                        {/* Technologies List */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                                Existing Technologies ({technologies.length})
                            </h2>

                            {dataLoading ? (
                                <div className="text-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-medium">Refreshing database contents...</p>
                                </div>
                            ) : technologies.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="text-5xl mb-4">📂</div>
                                    <h3 className="text-xl font-bold text-gray-700">No technologies found</h3>
                                    <p className="text-gray-500 mt-2">Start by adding a new solution using the button above.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {technologies.map(tech => (
                                        <div key={tech.id} className="group border-2 border-gray-50 rounded-2xl p-6 hover:border-green-200 hover:bg-green-50/10 transition-all">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div className="flex-1 flex items-start gap-4">
                                                    <span className="text-4xl bg-gray-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">{tech.icon}</span>
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2">{tech.name}</h3>
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                                                                {tech.category}
                                                            </span>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${tech.cost === 'Low' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                tech.cost === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                                    'bg-red-50 text-red-700 border-red-100'
                                                                }`}>
                                                                {tech.cost} Cost
                                                            </span>
                                                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100">
                                                                {tech.maturity_level}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">{tech.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col gap-2">
                                                    <button
                                                        onClick={() => handleEdit(tech)}
                                                        className="flex-1 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 text-sm font-bold transition-all active:scale-95 border border-blue-100"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tech.id, tech.name)}
                                                        className="flex-1 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 text-sm font-bold transition-all active:scale-95 border border-red-100"
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
                    </>
                )}

                {/* 3. USERS VIEW */}
                {currentView === 'users' && (
                    <div className="space-y-8 animate-slide-up">
                        {/* Add User Form */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-50">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">👤</span>
                                <h2 className="text-2xl font-bold text-gray-900">Add Authorized User</h2>
                            </div>
                            <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all text-gray-900"
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none appearance-none bg-white font-medium"
                                    >
                                        <option>Admin</option>
                                        <option>Editor</option>
                                        <option>Viewer</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={usersLoading}
                                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {usersLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Add User'}
                                </button>
                            </form>
                            {userError && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                                    ⚠️ {userError}
                                </div>
                            )}
                        </div>

                        {/* Users List */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="p-8 border-b bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-gray-900">Registered Dashboard Personnel</h2>
                                <p className="text-gray-500 mt-1">Users listed below have access to manage the ATIO knowledge base.</p>
                            </div>

                            {usersLoading && users.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">User Account</th>
                                            <th className="px-8 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Permission Rank</th>
                                            <th className="px-8 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Access Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-16 text-center">
                                                    <div className="text-gray-400 mb-2 text-4xl">👥</div>
                                                    <p className="text-gray-500 font-medium">No external users configured in the "profiles" table.</p>
                                                </td>
                                            </tr>
                                        ) : users.map(user => (
                                            <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                            {user.email?.[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2.5 bg-gray-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm border border-gray-100"
                                                        title="Revoke Access"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}