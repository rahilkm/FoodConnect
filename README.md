# FoodConnect 🍲🤝

An enterprise-grade, real-time surplus food redistribution and hunger relief network connecting food donors, verified NGOs, and volunteer logistics teams. Built as a high-performance monorepo using **Turborepo**, **NestJS**, and **Next.js 14**.

---

## 🌟 Mission & Overview

Every day, vast amounts of edible surplus food are wasted while vulnerable communities face food insecurity. **FoodConnect** bridges this gap through an automated, hyper-local logistics network:

1. **Surplus Food Rescue:** Restaurants, caterers, and corporate cafeterias post surplus meals before expiry.
2. **Algorithmic Matching Engine:** Pairs donations with verified recipient NGOs based on dietary requirements, capacity, and travel distance.
3. **Optimized Route Planning:** Clusters hunger hotspots into multi-stop volunteer delivery runs.
4. **Live Telemetry & Tracking:** Real-time location updates, status transitions, and dispatch alerts via WebSockets (Socket.IO).

---

## 👥 Multi-Role Ecosystem

```
┌──────────────┐          ┌───────────────────────┐          ┌──────────────┐
│ Food Donors  │          │ Algorithmic Matching  │          │ Recipient    │
│ Restaurants, │─────────▶│      & Routing        │─────────▶│ NGOs &       │
│ Caterers     │          │  Nearest NGO + Bounds │          │ Shelters     │
└──────────────┘          └───────────┬───────────┘          └──────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │ Volunteers / Couriers │
                          │ Live WebSocket GPS,   │
                          │ Multi-Stop Routes     │
                          └───────────────────────┘
```

| Role | Core Capabilities |
|---|---|
| **🍔 Donors** | Post food batches (Cooked Meals, Ration Kits, Fresh Produce), specify dietary tags (Veg, Non-Veg, Jain, Vegan), storage conditions, and expiry windows. |
| **🏢 NGO Managers** | Claim matched donations, register beneficiary counts, create hunger demand hotspots, and oversee distribution routes. |
| **🚴 Volunteers** | Accept pickup and drop-off dispatches, navigate ordered route stops, and stream real-time GPS locations. |
| **🛡️ Admins** | Review verification statuses (`UNVERIFIED` ➔ `VERIFIED` ➔ `TRUSTED`), inspect distribution analytics, and monitor food waste metrics. |

---

## 🏗️ Monorepo Architecture

```
FoodConnect/
├── apps/
│   ├── api/                    # NestJS 10 Modular REST & WebSocket Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT Access & Refresh token rotation + Passport
│   │   │   │   ├── users/      # User management & role access control
│   │   │   │   ├── donors/     # Donor profiles & organization settings
│   │   │   │   ├── ngos/       # NGO verification & capacity tracking
│   │   │   │   ├── volunteers/ # Volunteer fleet & availability
│   │   │   │   ├── donations/  # Donation lifecycle management
│   │   │   │   ├── matching/   # Geo-spatial donation matching engine
│   │   │   │   ├── hotspots/   # Hunger hotspot mapping & demand clustering
│   │   │   │   ├── routes/     # Multi-stop routing & dispatch optimization
│   │   │   │   └── tracking/   # Socket.IO Real-time GPS gateway
│   │   │   └── database/       # Mongoose schemas, seed scripts & indexes
│   │   └── package.json
│   │
│   └── web/                    # Next.js 14 App Router Frontend
│       ├── src/
│       │   ├── app/            # Next.js pages & layouts
│       │   ├── components/     # UI components & dashboard widgets
│       │   └── hooks/          # React Query hooks & WebSocket subscriptions
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared TypeScript domain contracts & enums
│   │   └── src/                # UserRole, DonationStatus, GeoPoint, RouteStop
│   └── tsconfig/               # Shared base TypeScript configs
│
├── turbo.json                  # Turborepo build pipeline configuration
├── pnpm-workspace.yaml         # PNPM workspace definition
└── env/
    └── .env.example            # Environment variables template
```

---

## 🔄 Donation Lifecycle State Machine

```
[ DRAFT ]
   │
   ▼
[ POSTED ] ──────▶ [ RECOMMENDED ]
                        │
                        ▼
                   [ ACCEPTED ]
                        │
                        ▼
             [ VOLUNTEER_ASSIGNED ]
                        │
                        ▼
              [ PICKUP_COMPLETE ]
                        │
                        ▼
                 [ DELIVERED ] ✅
```

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework:** Next.js 14 (App Router) + React 18
- **State & Data Fetching:** `@tanstack/react-query` + Zustand
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **Charts & Visualizations:** Recharts
- **Real-Time Client:** `socket.io-client`
- **Styling:** Tailwind CSS + Lucide React Icons

### Backend (`apps/api`)
- **Framework:** NestJS 10 + TypeScript
- **Database:** MongoDB + `@nestjs/mongoose`
- **Authentication:** Passport.js + `@nestjs/jwt` (Access & Refresh Tokens)
- **WebSockets:** `@nestjs/websockets` + Socket.IO
- **Rate Limiting:** `@nestjs/throttler`
- **Validation:** `class-validator` + `class-transformer`

### Workspace Tooling
- **Package Manager:** `pnpm` (v9+)
- **Build System:** `Turborepo`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **pnpm** (`corepack enable && corepack prepare pnpm@latest --activate`)
- **MongoDB** (Local instance or MongoDB Atlas URI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/rahilkm/FoodConnect.git
cd FoodConnect
```

---

### 2. Install Workspace Dependencies

```bash
pnpm install
```

---

### 3. Configure Environment Variables

Copy the example environment configuration:

```bash
cp env/.env.example apps/api/.env
```

Set the appropriate values in `apps/api/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/foodconnect

# Authentication Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Server Settings
PORT=4000
NODE_ENV=development
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:3000

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

### 4. Seed Development Data (Optional)

To populate the database with sample donors, NGOs, hotspots, and active donations:

```bash
pnpm --filter @foodconnect/api run seed
```

---

### 5. Start Development Servers

Run all applications in parallel with Turborepo:

```bash
# Start both Web and API concurrently
pnpm dev

# Or start individually:
pnpm dev:web    # Next.js running on http://localhost:3000
pnpm dev:api    # NestJS API running on http://localhost:4000
```

---

## 📡 API & Service Overview

| Service Module | Route Prefix | Description |
|---|---|---|
| `AuthModule` | `/api/v1/auth` | User registration, login, token refresh, and logout |
| `UsersModule` | `/api/v1/users` | User profile management & role assignment |
| `DonationsModule` | `/api/v1/donations` | CRUD for food donation posts and status updates |
| `MatchingModule` | `/api/v1/matching` | Query recommendations and pair donations with NGOs |
| `HotspotsModule` | `/api/v1/hotspots` | Manage hunger demand zones & geographic hotspots |
| `RoutesModule` | `/api/v1/routes` | Multi-stop routing and volunteer delivery itineraries |
| `TrackingGateway` | `ws://localhost:4000` | Real-time WebSocket gateway for driver GPS and live alerts |

---

## 📜 License

This project is private and licensed under the [ISC License](LICENSE).
