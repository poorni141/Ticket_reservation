# CampusTix - College Event Ticket Reservation System

CampusTix is an enterprise-grade college event ticketing and pass reservation platform built with React, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL with Prisma ORM.

---

## 🚀 Key Features

### 1. Student Features
- **Browse & Search**: Live keyword search, multi-category filtering (Culturals, Symposium, Hackathons, Music Pro-nites, Dance, Sports, Workshops), price filtering (Free vs. Paid), and date sorting.
- **Seat & Ticket Selection**: Select multiple passes across tiers (General, VIP, Early Bird, Student Delegate) with per-user limits and real-time inventory validation.
- **10-Minute Hold Engine**: Locks seats in the database atomically for 10 minutes. A live countdown timer is displayed across the app. If unpurchased within 10 minutes, seats are automatically released back to the event inventory.
- **Demo Payments**: Simulated UPI (Google Pay, PhonePe, Paytm, custom UPI ID) and Demo Card sandbox without collecting real card credentials.
- **Digital QR Tickets**: Boarding pass-style digital tickets with dynamic QR codes generated using cryptographic verification tokens. Includes print and download capabilities.
- **My Bookings & Cancellation**: View active and past passes; cancel bookings with immediate atomic seat release back to the event pool.

### 2. Organizer Features
- **Assigned Events Management**: View live occupancy rates and tier capacities.
- **Gate Entry Scanner**: Interactive simulator to scan QR verification tokens or ticket codes, validating admissions and preventing duplicate entry.
- **Live Attendee Rosters**: Searchable list of students with check-in timestamps.

### 3. Admin Features
- **Executive Analytics**: Total revenue, tickets sold, average occupancy rate, and active event statistics.
- **Interactive Visual Charts**: 7-day revenue trend bar chart and category sales breakdown.
- **Event Management**: Create, edit, and delete events with custom ticket tiers and capacity controls.
- **CSV Data Export**: One-click download of `campustix-attendees.csv` with full attendee details, college roll numbers, and payment references.
- **User Role Management**: Inspect student and staff credentials with instant role preview switching.

---

## 🛠️ Tech Stack & Database Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, QRCode
- **Backend**: Node.js, Express, Tsx
- **Database & ORM**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`)
- **Inventory Engine**: Atomic reservation holds, transactional inventory updates, and periodic background hold-sweeper.

### Prisma Schema (`prisma/schema.prisma`)
Includes the following relational models:
- `User`: Handles Students, Organizers, and Admins with role-based permissions.
- `Event`: Multi-tier college events with venue details, dates, and capacities.
- `TicketTier`: General, VIP, Early Bird tiers with pricing and individual quotas.
- `ReservationHold`: 10-minute hold records with atomic lock status (`ACTIVE`, `EXPIRED`, `CONVERTED`, `RELEASED`).
- `Booking`: Confirmed orders with unique booking numbers (`CT-2026-XXXXX`) and cryptographic QR tokens.
- `Ticket`: Individual passes with unique verification codes (`CT-TKT-XXXXXX`).
- `Payment`: Transaction reference, payment method (UPI/Card/Free), and status.

---

## 📦 Setup & Local Development (PostgreSQL + Prisma)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/campustix?schema=public"
PORT=3000
```

### 3. Run Prisma Migrations & Seed
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 💡 AI Studio Live Preview & Sandbox Behavior

In the hosted preview environment where an external PostgreSQL instance is not attached, CampusTix automatically executes a high-fidelity **Atomic In-Memory & Storage-Synced Inventory Engine** that mirrors the PostgreSQL schema and Prisma models. 

This guarantees:
1. Every button, booking flow, ticket selection, payment simulation, and QR generator works immediately without errors.
2. The 10-minute reservation hold timer runs and automatically returns expired seats to the available pool.
3. Bookings and cancellations atomically increment and decrement ticket counts.
4. Organizer QR scanning accurately marks tickets as checked-in and alerts on duplicate scans.
5. The full Prisma schema (`prisma/schema.prisma`) is included for seamless export to any external PostgreSQL cluster.
