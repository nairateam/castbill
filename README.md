# SaaS Invoice System

A multi-tenant invoice management system built with Next.js App Router, Prisma, PostgreSQL, and NextAuth. The system is designed for generating, managing, and exporting invoices with secure authentication and user-level data isolation.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials Provider)
- Puppeteer (PDF generation)
- pnpm (package manager)

---

## Features

### Authentication
- Email and password authentication using NextAuth
- JWT-based session strategy
- Secure password hashing with bcrypt
- Protected API routes with session validation

### Invoice Management
- Create invoices with multiple line items
- Automatic calculation of subtotal, tax, discount, and total
- Invoice status workflow: DRAFT, SENT, PAID
- Update and manage invoice status securely
- Fetch single or multiple invoices per authenticated user

### Data Security
- All invoices are scoped to authenticated users
- Ownership validation on every invoice operation
- Server-side validation for all business logic

### PDF Generation
- Server-side invoice PDF generation using Puppeteer
- Downloadable invoice documents
- Consistent formatting using HTML templates

---

## Project Structure
