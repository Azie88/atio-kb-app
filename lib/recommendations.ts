import { Technology } from './supabase';

export interface UserProfile {
    region?: string;
    budget?: 'Low' | 'Medium' | 'High';
    farmSize?: 'Small' | 'Medium' | 'Large';
    priority?: 'cost' | 'efficiency' | 'sustainability';
}

export function getRecommendations(
    technologies: Technology[],
    profile: UserProfile,
    limit: number = 5
): Technology[] {
    return technologies
        .map(tech => ({
            tech,
            score: calculateScore(tech, profile)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.tech);
}

function calculateScore(tech: Technology, profile: UserProfile): number {
    let score = 0;

    // Region match (30 points)
    if (profile.region && tech.regions.includes(profile.region)) {
        score += 30;
    }

    // Budget match (25 points)
    if (profile.budget) {
        if (tech.cost === profile.budget) score += 25;
        else if (tech.cost === 'Low' && profile.budget === 'Medium') score += 15;
        else if (tech.cost === 'Medium' && profile.budget === 'High') score += 15;
    }

    // Maturity level (20 points for proven/mature)
    if (tech.maturity_level === 'Mature' || tech.maturity_level === 'Proven') {
        score += 20;
    }

    // Adoption rate (15 points - higher is better)
    const adoptionNum = parseInt(tech.adoption_rate);
    if (!isNaN(adoptionNum)) {
        score += (adoptionNum / 100) * 15;
    }

    // Priority-based scoring (10 points)
    if (profile.priority === 'cost' && tech.cost === 'Low') score += 10;
    if (profile.priority === 'efficiency' && adoptionNum > 30) score += 10;
    if (profile.priority === 'sustainability' && tech.category === 'Energy') score += 10;

    return score;
}