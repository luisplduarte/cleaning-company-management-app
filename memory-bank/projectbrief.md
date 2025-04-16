# Cleaning Services Company Management Application

## Project Overview
A web application for managing a cleaning services company's operations, including workforce management, client relationships, and job scheduling.

## Core Requirements

### User Management
- Authentication system with role-based access (admin/worker)
- User profiles with essential information
- Secure login/logout functionality

### Client Management
- Client database with contact information
- Address and location tracking
- Client history and preferences

### Job Management
- Scheduling system for cleaning jobs
- Assignment of workers to jobs
- Job type categorization
- Location and timing details

### System Features
- Dashboard views for different user roles
- Real-time schedule updates
- Job status tracking
- Worker availability management

## Technical Requirements

### Tech Stack
- Frontend: Next.js with React.js (TypeScript)
- Styling: Tailwind CSS
- Backend: Node.js
- Database: Supabase with Prisma ORM
- Deployment: Vercel with GitHub integration

### Database Schema

#### Users Table
- id: uuid (primary key)
- name: string
- email: string (unique)
- role: enum (admin/worker)

#### Clients Table
- id: uuid (primary key)
- name: string
- address: string
- contact: string

#### Jobs Table
- id: uuid (primary key)
- client_id: uuid (foreign key)
- description: string
- location: string
- type: enum
- date: date
- time: time

#### Job Assignments Table
- id: uuid (primary key)
- job_id: uuid (foreign key)
- worker_id: uuid (foreign key)

## Project Goals
1. Create an efficient system for managing cleaning services operations
2. Provide easy access to scheduling and assignment information
3. Enable real-time updates and notifications
4. Ensure secure and role-based access to system features
