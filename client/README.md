# Northstar Frontend

**Author:** Arman Hazrati  
**License:** MIT

Modern Next.js 14 frontend application for the Northstar service platform.

## 🚀 Features

- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Query** for efficient data fetching and caching
- **Zustand** for lightweight state management
- **React Hook Form + Zod** for form validation
- **Axios** with interceptors for API communication
- **Socket.io** client for real-time features
- **Playwright** for E2E testing
- **Jest + Testing Library** for unit testing

## 📦 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Testing:** Jest, Testing Library, Playwright
- **Icons:** Lucide React

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`.

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_APP_NAME=Northstar
```

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home/Landing page
│   │   ├── providers.tsx      # Context providers
│   │   └── dashboard/         # Dashboard pages
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and helpers
│   │   └── api.ts           # API client configuration
│   ├── store/               # Zustand stores
│   │   └── auth.ts         # Authentication store
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run e2e             # Run E2E tests
npm run e2e:ui          # Run E2E tests with UI

# Code Quality
npm run lint            # Lint code
npm run lint:fix        # Lint and fix
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # TypeScript type checking
```

## 🎨 Key Features

### Authentication
- Login/Register with JWT
- Persistent sessions with local storage
- Automatic token refresh
- Role-based access control (ADMIN, BUSINESS, STAFF, CUSTOMER)

### Dashboard
- Real-time statistics
- Activity feed
- Service request management
- User management (admin)
- Responsive design

### Real-time Features
- WebSocket integration
- Live notifications
- Instant updates

### UI/UX
- Modern, clean design
- Responsive mobile-first approach
- Smooth animations and transitions
- Toast notifications
- Loading states and error handling

## 🔒 Security

- Secure token storage with Zustand persist
- XSS protection with Next.js built-in features
- CSRF protection
- Secure headers configuration
- Input validation with Zod

## 📊 Performance

- Server-side rendering (SSR)
- Static site generation (SSG) where applicable
- Image optimization
- Code splitting and lazy loading
- Optimized bundle size

## 🧩 Architecture

The frontend follows a modular architecture:

1. **App Router**: Next.js 14 App Router for routing
2. **Component Library**: Reusable UI components
3. **State Management**: Zustand for global state
4. **Data Layer**: React Query for server state
5. **API Layer**: Axios with interceptors
6. **Real-time**: Socket.io for live updates

## 📖 API Integration

The frontend communicates with the backend via:

- REST API endpoints (`/api/*`)
- WebSocket for real-time features
- Automatic token refresh
- Error handling and retry logic

## 🤝 Contributing

This is a portfolio project by **Arman Hazrati**. For inquiries or contributions, please reach out.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by Arman Hazrati**
