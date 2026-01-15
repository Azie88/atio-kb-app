# 🌾 ATIO Knowledge Base

A high-performance, persona-driven Next.js application designed to accelerate the discovery, comparison, and adoption of agrifood technologies. Optimized for low-bandwidth environments (2G/3G) and mobile devices.

## 🚀 Key Features

### 📈 Analytics & Comparison
- **Real-time Analytics**: Visualization of technology trends, cost distributions, and adoption rates.
- **Side-by-Side Comparison**: Evaluate up to 3 technologies simultaneously with a floating comparison bar.
- **AI Assistant**: Context-aware chatbot for natural language technology discovery.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript
- **Styling**: Tailwind CSS v4 (Mobile-first, Glassmorphic design)
- **Backend/DB**: Supabase (PostgreSQL)
- **Icons/Assets**: Emoji-based iconography (optimized for low-bandwidth)

## 📁 File Structure

```text
atio-knowledge-app/
├── app/                    # Next.js App Router
│   ├── admin/              # Management interface
│   ├── analytics/          # Researcher dashboard
│   ├── compare/            # Multi-tech comparison engine
│   ├── matcher/            # Technical Context Matcher page
│   ├── policy/             # Policy Maker strategic dashboard
│   ├── recommendations/    # Tailored farmer suggestions
│   ├── technology/         # Individual technology detail pages
│   ├── globals.css         # Tailwind 4 configuration & global styles
│   └── page.tsx            # Persona-driven Homepage
├── components/             # Reusable React components
│   ├── ChatBot.tsx         # AI Assistant interface
│   ├── ContextMatcher.tsx   # Core matching engine logic
│   └── Recommendations.tsx  # Dynamic filtering & suggestions
├── lib/                    # Shared utilities & configurations
│   ├── supabase.ts         # Client initialization & types
│   └── recommendations.ts  # Matching & scoring algorithm
├── .env.example            # Environment variables template
└── public/                 # Static assets
```

## 🌍 Optimization Details

- **Low Bandwidth**: Prioritizes system fonts and emojis over external images/icons. The Matcher runs logic on the client to minimize server requests.
- **Mobile First**: All layouts are built with responsive grids (`sm`, `md`, `lg`) and large touch targets.
- **Search & Filter**: Instant client-side filtering for zero-latency discovery.

## 🛠️ Getting Started

1. **Setup Env**: Copy `.env.example` to `.env.local` with your Supabase credentials.
2. **Install**: `npm install`
3. **Develop**: `npm run dev`
4. **Build**: `npm run build`

---

Built for the [**ATIO Knowledge Base Hackathon**](https://unfao.brightidea.com/ATIO) organized by FAO.
