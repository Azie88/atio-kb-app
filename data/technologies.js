// data/technologies.js
export const technologies = [
    {
        id: 1,
        name: 'Drip Irrigation',
        category: 'Water Management',
        description: 'Water-efficient irrigation system that delivers water directly to plant roots, reducing waste by up to 60%.',
        fullDescription: 'Drip irrigation is a micro-irrigation system that saves water and fertilizer by allowing water to drip slowly to the roots of plants. This method can be very efficient if managed properly. Water is distributed through a network of valves, pipes, tubing, and emitters. It minimizes evaporation and runoff, making it ideal for regions with water scarcity.',
        cost: 'Medium',
        costRange: '$500 - $2,000 per hectare',
        icon: '💧',
        regions: ['Sub-Saharan Africa', 'South Asia', 'Middle East'],
        maturityLevel: 'Mature',
        adoptionRate: '35%',
        benefits: [
            'Reduces water usage by 30-60%',
            'Increases crop yields by 20-90%',
            'Reduces weed growth',
            'Minimizes fertilizer runoff'
        ],
        challenges: [
            'Initial setup costs',
            'Requires maintenance',
            'May clog without proper filtration'
        ],
        suitableFor: ['Vegetables', 'Fruits', 'Row crops'],
        evidenceLinks: [
            'https://www.fao.org/drip-irrigation',
            'https://www.worldbank.org/water-efficiency'
        ]
    },
    {
        id: 2,
        name: 'Solar Water Pumps',
        category: 'Energy',
        description: 'Off-grid solar-powered pumps for irrigation, eliminating fuel costs and reducing carbon footprint.',
        fullDescription: 'Solar water pumps use photovoltaic panels to power electric motors that pump water from wells, rivers, or storage tanks. They are ideal for remote areas without electricity access and can significantly reduce operational costs while being environmentally friendly.',
        cost: 'High',
        costRange: '$2,000 - $10,000 per system',
        icon: '☀️',
        regions: ['East Africa', 'South Asia', 'Latin America'],
        maturityLevel: 'Proven',
        adoptionRate: '18%',
        benefits: [
            'Zero fuel costs',
            'Low maintenance',
            'Environmentally friendly',
            'Long lifespan (20+ years)'
        ],
        challenges: [
            'High upfront investment',
            'Depends on sunlight availability',
            'Technical expertise needed for installation'
        ],
        suitableFor: ['All crop types', 'Livestock watering', 'Domestic use'],
        evidenceLinks: []
    },
    {
        id: 3,
        name: 'Drought-Resistant Seeds',
        category: 'Crop Innovation',
        description: 'Climate-adapted seed varieties that maintain yields during water stress conditions.',
        fullDescription: 'Drought-resistant crop varieties are developed through traditional breeding or genetic modification to withstand extended periods of low water availability. These seeds help farmers maintain productivity in the face of climate change and irregular rainfall patterns.',
        cost: 'Low',
        costRange: '$20 - $100 per hectare',
        icon: '🌱',
        regions: ['Sub-Saharan Africa', 'South Asia'],
        maturityLevel: 'Mature',
        adoptionRate: '42%',
        benefits: [
            'Maintains yields in dry conditions',
            'Reduces crop failure risk',
            'Often paired with other resilient traits',
            'Cost-effective solution'
        ],
        challenges: [
            'May require specific farming practices',
            'Seed availability in remote areas',
            'Some varieties may have lower yields in optimal conditions'
        ],
        suitableFor: ['Maize', 'Rice', 'Wheat', 'Sorghum'],
        evidenceLinks: []
    },
    {
        id: 4,
        name: 'Mobile Weather Apps',
        category: 'Digital Tools',
        description: 'Smartphone apps providing localized weather forecasts and farming advice via SMS or app.',
        fullDescription: 'Mobile weather applications provide farmers with hyperlocal weather forecasts, planting calendars, pest alerts, and agronomic advice. Many work via SMS for feature phones, making them accessible even in areas with limited smartphone penetration.',
        cost: 'Low',
        costRange: 'Free - $5/month subscription',
        icon: '📱',
        regions: ['Global'],
        maturityLevel: 'Proven',
        adoptionRate: '28%',
        benefits: [
            'Early warning for extreme weather',
            'Helps plan farming activities',
            'Reduces crop losses',
            'Low cost or free'
        ],
        challenges: [
            'Requires mobile network coverage',
            'Digital literacy needed',
            'Forecast accuracy varies by region'
        ],
        suitableFor: ['All farmers with mobile phones'],
        evidenceLinks: []
    },
    {
        id: 5,
        name: 'Cold Storage Units',
        category: 'Post-Harvest',
        description: 'Solar-powered refrigeration to reduce food waste and extend shelf life of produce.',
        fullDescription: 'Cold storage facilities maintain low temperatures to preserve perishable agricultural products. Solar-powered units are especially valuable in off-grid areas, helping farmers store produce until market prices are favorable and reducing post-harvest losses.',
        cost: 'High',
        costRange: '$5,000 - $50,000 depending on size',
        icon: '❄️',
        regions: ['South Asia', 'Southeast Asia', 'Africa'],
        maturityLevel: 'Proven',
        adoptionRate: '12%',
        benefits: [
            'Reduces post-harvest losses by up to 40%',
            'Enables market timing flexibility',
            'Increases farmer income',
            'Extends product shelf life'
        ],
        challenges: [
            'High capital investment',
            'Requires electricity or solar power',
            'Maintenance and technical support needed'
        ],
        suitableFor: ['Fruits', 'Vegetables', 'Dairy'],
        evidenceLinks: []
    },
    {
        id: 6,
        name: 'Precision Agriculture',
        category: 'Digital Tools',
        description: 'IoT sensors and drones for monitoring soil health, crop growth, and optimizing inputs.',
        fullDescription: 'Precision agriculture uses GPS, sensors, drones, and data analytics to optimize field-level management regarding crop farming. This technology helps farmers apply the right amount of inputs at the right time and place, maximizing efficiency and sustainability.',
        cost: 'High',
        costRange: '$10,000 - $100,000+ per farm',
        icon: '🛰️',
        regions: ['North America', 'Europe', 'Australia'],
        maturityLevel: 'Emerging',
        adoptionRate: '8%',
        benefits: [
            'Optimizes input usage (water, fertilizer)',
            'Increases yields by 10-30%',
            'Reduces environmental impact',
            'Data-driven decision making'
        ],
        challenges: [
            'Very high investment costs',
            'Requires technical expertise',
            'Data management complexity',
            'Limited applicability in LMICs'
        ],
        suitableFor: ['Large-scale commercial farms'],
        evidenceLinks: []
    },
    {
        id: 7,
        name: 'Rainwater Harvesting',
        category: 'Water Management',
        description: 'Collection and storage of rainwater for agricultural use during dry seasons.',
        fullDescription: 'Rainwater harvesting systems collect, store, and distribute rainwater for irrigation and other agricultural needs. These systems range from simple roof catchment to large-scale earth dams and are crucial for water security in rain-fed agriculture areas.',
        cost: 'Medium',
        costRange: '$200 - $5,000 depending on scale',
        icon: '🌧️',
        regions: ['Sub-Saharan Africa', 'South Asia', 'Australia'],
        maturityLevel: 'Mature',
        adoptionRate: '25%',
        benefits: [
            'Free water source',
            'Reduces dependency on groundwater',
            'Extends growing season',
            'Low operational costs'
        ],
        challenges: [
            'Seasonal variability',
            'Storage space required',
            'Water quality concerns'
        ],
        suitableFor: ['Smallholder farms', 'Kitchen gardens', 'Livestock'],
        evidenceLinks: []
    },
    {
        id: 8,
        name: 'Biogas Digesters',
        category: 'Energy',
        description: 'Convert animal waste into cooking fuel and organic fertilizer.',
        fullDescription: 'Biogas digesters are airtight containers where organic matter decomposes to produce methane gas for cooking and lighting, while also creating nutrient-rich slurry for fertilizer. This technology provides renewable energy while solving waste management challenges.',
        cost: 'Medium',
        costRange: '$300 - $2,000 per household system',
        icon: '♻️',
        regions: ['South Asia', 'East Africa', 'Southeast Asia'],
        maturityLevel: 'Mature',
        adoptionRate: '15%',
        benefits: [
            'Renewable cooking fuel',
            'Reduces deforestation',
            'Produces organic fertilizer',
            'Improves sanitation'
        ],
        challenges: [
            'Requires daily feeding',
            'Minimum livestock needed',
            'Climate sensitivity',
            'Initial investment'
        ],
        suitableFor: ['Mixed crop-livestock farms'],
        evidenceLinks: []
    },
    {
        id: 9,
        name: 'Composting Systems',
        category: 'Soil Health',
        description: 'Convert organic waste into nutrient-rich soil amendment.',
        fullDescription: 'Composting is the controlled decomposition of organic matter to create humus-rich soil amendment. It improves soil structure, water retention, and nutrient availability while reducing the need for chemical fertilizers.',
        cost: 'Low',
        costRange: '$0 - $500 (mostly labor)',
        icon: '🍂',
        regions: ['Global'],
        maturityLevel: 'Mature',
        adoptionRate: '45%',
        benefits: [
            'Free/low-cost fertilizer',
            'Improves soil health',
            'Reduces waste',
            'Increases water retention'
        ],
        challenges: [
            'Labor intensive',
            'Requires space and time',
            'Quality varies',
            'May attract pests if done incorrectly'
        ],
        suitableFor: ['All crop types', 'Organic farming'],
        evidenceLinks: []
    },
    {
        id: 10,
        name: 'Greenhouse Farming',
        category: 'Crop Innovation',
        description: 'Protected cultivation for year-round production and climate control.',
        fullDescription: 'Greenhouse farming involves growing crops in controlled environments using transparent structures. This allows for year-round production, protection from extreme weather, and efficient use of water and nutrients.',
        cost: 'High',
        costRange: '$5 - $50 per square meter',
        icon: '🏠',
        regions: ['Global'],
        maturityLevel: 'Mature',
        adoptionRate: '20%',
        benefits: [
            'Year-round production',
            'Higher yields per area',
            'Protection from pests and weather',
            'Better quality produce'
        ],
        challenges: [
            'High initial investment',
            'Requires technical knowledge',
            'Energy costs for climate control',
            'Disease can spread quickly'
        ],
        suitableFor: ['High-value crops', 'Vegetables', 'Flowers'],
        evidenceLinks: []
    }
];

export const categories = [
    'All',
    'Water Management',
    'Energy',
    'Crop Innovation',
    'Digital Tools',
    'Post-Harvest',
    'Soil Health'
];