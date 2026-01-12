# Velocity SaaS

A modern, full-stack SaaS subscription management platform with premium UI design.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Paystack](https://img.shields.io/badge/Paystack-Payments-blue)

## Features

- 🔐 **User Authentication** - Sign up, login, and secure sessions via Supabase
- 💳 **Subscription Billing** - Integrated Paystack payments for Pro & Enterprise plans
- 📊 **User Dashboard** - Track usage, plan status, and account settings
- 👤 **Admin Panel** - Business metrics and user management
- 🎨 **Premium UI** - Glassmorphism design with smooth animations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14, React, CSS Modules
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/velocity-saas.git
cd velocity-saas
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase and Paystack credentials
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `NEXT_PUBLIC_BASE_URL` | Your app's base URL |

## Deployment

Deploy easily to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT
