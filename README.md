# Paystack Multi-Currency Frontend

A React frontend for Paystack multi-currency payment integration.

## Environment Setup

### Local Development

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your local configuration:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
   VITE_FRONTEND_URL=http://localhost:5173
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Production Build

1. For production deployment, use:
   ```bash
   npm run build:production
   ```

2. Or manually copy production environment:
   ```bash
   cp env.production .env
   npm run build
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | `pk_test_sample_key` |
| `VITE_FRONTEND_URL` | Frontend URL for callbacks | `http://localhost:5173` |

## Development Proxy

The development server includes a proxy configuration that automatically forwards `/api` requests to `http://localhost:8000`, so you can use relative URLs in your API calls during development.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:production` - Build with production environment
- `npm run build:local` - Build with local environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint 