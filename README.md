# Home Asset & Service Tracker

A personal web application to manage home assets including vehicles, electronics, furniture, and other valuable items. Track warranty, service history, and sales history for each asset.

## Features

- **Dashboard**: Overview with statistics and recent activity
- **Asset Management**: Full CRUD for assets with image uploads
- **Service Tracking**: Record and track service/repair history
- **Warranty Management**: Monitor warranty status and expiration
- **Sales History**: Track sold assets with profit/loss calculation
- **Secure Authentication**: Email & password authentication via Supabase

## Tech Stack

- **Frontend**: [Astro](https://astro.build/) with server-side rendering
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Hosting**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd home-asset-service-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Run the storage setup from `supabase/storage_setup.sql`
   - Create a user in Supabase Auth (Authentication > Users > Add user)

4. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```
   PUBLIC_SUPABASE_URL=your_supabase_project_url
   PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:4321](http://localhost:4321) in your browser

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Database Schema

### Tables

- **assets**: Main asset information (name, category, brand, model, etc.)
- **warranties**: Warranty information linked to assets
- **services**: Service/repair records for assets
- **asset_sales**: Sales records for sold assets
- **asset_images**: Image storage references for assets

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Deployment

### Vercel

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)

2. Import the project in Vercel:
   - Connect your repository
   - Framework will be auto-detected as Astro

3. Add environment variables in Vercel:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

### Manual Build

```bash
npm run build
```

The built output will be in the `dist` directory.

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utilities and Supabase client
│   ├── pages/           # Astro pages and API routes
│   │   ├── api/         # API endpoints
│   │   ├── assets/      # Asset pages
│   │   ├── services/    # Service pages
│   │   ├── warranties/  # Warranty pages
│   │   └── sales/       # Sales pages
│   └── middleware.ts    # Auth middleware
├── supabase/
│   └── migrations/      # Database migrations
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── vercel.json          # Vercel deployment config
```

## License

This is a personal project for private use.

## Support

This is a single-user personal application with no multi-user support, notifications, or AI features.

