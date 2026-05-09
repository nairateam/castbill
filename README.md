CastBill

CastBill is a modern invoice management platform built for freelancers, agencies, consultants, and small businesses to create, manage, and share professional invoices efficiently.

The platform provides a clean dashboard experience for generating invoices, managing invoice items, tracking payment statuses, and exporting invoices as downloadable PDF documents.

Features
User authentication and protected dashboard
Create and manage invoices
Dynamic invoice item management
Invoice status tracking
Draft
Sent
Paid
PDF invoice generation
Currency support
Sender and client information management
Invoice notes and due dates
Per-user invoice numbering system
Responsive dashboard interface
Secure PostgreSQL database integration
Server-side invoice calculations
Prisma ORM integration
Production deployment support with Vercel and Neon
Tech Stack
Frontend
Next.js 16
React 19
Tailwind CSS 4
Backend
Next.js Route Handlers
Prisma ORM
PostgreSQL
Authentication
NextAuth.js
Database
Neon PostgreSQL
PDF Generation
@react-pdf/renderer
Deployment
Vercel
Project Structure
/app
  /api
  /dashboard
  /auth
/components
/lib
/prisma
/public
Environment Variables

Create a .env file in the root directory:

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

RESEND_API_KEY=
Installation

Clone the repository:

git clone <repository-url>

Install dependencies:

pnpm install
Database Setup

Run Prisma migrations:

npx prisma migrate dev

Generate Prisma client:

npx prisma generate
Running the Development Server
pnpm dev

Application runs on:

http://localhost:3000
Production Build
pnpm build
Prisma Production Deployment

The production build process automatically runs Prisma migrations before deployment:

"build": "prisma migrate deploy && prisma generate && next build"

This ensures the production database schema remains synchronized during deployment.

Invoice Numbering

CastBill uses a per-user invoice numbering system.

Example:

INV-0001
INV-0002
INV-0003

Invoice numbers are uniquely scoped to each user using a composite database constraint:

@@unique([userId, invoiceNumber])
Authentication

Authentication is handled using NextAuth.js with session-based protection for dashboard routes and API endpoints.

Protected actions include:

Invoice creation
Invoice retrieval
Invoice export
Dashboard access
PDF Generation

Invoices are rendered into downloadable PDF documents using @react-pdf/renderer.

Generated PDFs include:

Invoice metadata
Sender information
Client information
Invoice items
Pricing breakdown
Notes
Status and due date
Database Schema Overview
User

Stores authenticated user information.

Invoice

Stores invoice metadata and totals.

InvoiceItem

Stores line items attached to invoices.

Deployment

CastBill is optimized for deployment on Vercel with Neon PostgreSQL.

Recommended production workflow:

Push changes to GitHub
Vercel automatically triggers deployment
Prisma migrations are deployed automatically
Application rebuilds with updated schema
Scripts
{
  "dev": "next dev",
  "build": "prisma migrate deploy && prisma generate && next build",
  "start": "next start",
  "lint": "eslint",
  "postinstall": "prisma generate"
}
Future Improvements
Multi-currency formatting
Invoice analytics
Email invoice delivery
Client management
Recurring invoices
Payment gateway integration
Team collaboration
Invoice templates
Tax presets
Dark mode refinements
License

Private project. All rights reserved.