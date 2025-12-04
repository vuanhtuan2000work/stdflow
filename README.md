# 📚 StudyFlow - Learning Platform

A modern web-based learning platform with flashcards and spaced repetition, built with Next.js 14, Supabase, and PWA support.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run setup-env
# Edit .env.local with your Supabase credentials

# 3. Verify setup
npm run verify

# 4. Start development
npm run dev
```

Visit `http://localhost:3000`

## 📋 Prerequisites

- Node.js >= 20.9.0
- npm or yarn
- Supabase account

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run verify       # Verify deployment readiness
npm run setup-env    # Setup environment variables
```

## 📁 Project Structure

```
StudyFlow/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   └── (main)/            # Main application pages
├── components/            # React components
│   ├── ui/               # UI components (atoms & molecules)
│   ├── layout/           # Layout components (organisms)
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── supabase/         # Supabase client setup
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static files
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── scripts/              # Helper scripts
├── supabase/            # Database migrations
└── __tests__/           # Test files
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Copy contents from `supabase/migrations/001_initial_schema.sql`
4. Run the migration
5. Create storage buckets: `avatars` and `attachments`

See `supabase/README.md` for detailed instructions.

## 🔐 Environment Variables

Required environment variables (add to `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PWA_NAME=StudyFlow
```

Get your keys from: [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api)

## 🚀 Deployment

### Pre-Deployment Checklist

1. ✅ Upgrade Node.js to >= 20.9.0
2. ✅ Run database migration
3. ✅ Replace PWA icons
4. ✅ Configure environment variables
5. ✅ Run `npm run verify`

### Deploy to Vercel

1. Push code to Git repository
2. Import project in Vercel
3. Configure environment variables
4. Set Node.js version to 20.x
5. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed steps.

## 📚 Documentation

- `QUICK_START.md` - Quick setup guide
- `DEPLOYMENT_GUIDE.md` - Full deployment guide
- `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `TESTING_CHECKLIST.md` - Testing guide
- `supabase/README.md` - Database setup guide

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🎨 Features

- ✅ User authentication (Email, Google OAuth)
- ✅ Subject management
- ✅ Flashcard CRUD
- ✅ Spaced repetition (SM-2 algorithm)
- ✅ Review mode with flip animation
- ✅ Dashboard with statistics
- ✅ PWA support
- ✅ Offline mode
- ✅ Responsive design

## 🛡️ Security

- Row Level Security (RLS) on all tables
- User data isolation
- Secure authentication
- Input validation

## 📱 PWA Support

- Installable on mobile and desktop
- Offline support
- Service worker caching
- App-like experience

## 🧩 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library
- **PWA**: @ducanh2912/next-pwa

## 📄 License

Private project

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

---

**Built with ❤️ for better learning**


