# Overview

CareerCompass is an AI-powered career guidance platform designed to help students discover their perfect career path. The application provides personalized career recommendations through profile analysis, skills assessment, and an interactive AI mentor chat system. Built as a modern full-stack web application, it combines React frontend with Express backend and PostgreSQL database to deliver comprehensive career counseling services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **State Management**: TanStack Query (React Query) for server state, React Context for UI state
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite with TypeScript support and path aliases

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM format
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage with interface abstraction for future database implementation
- **Error Handling**: Centralized error middleware with status code management
- **API Design**: RESTful endpoints with structured JSON responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Neon serverless driver
- **ORM**: Drizzle ORM with schema validation using drizzle-zod
- **Schema Management**: Code-first approach with migrations in dedicated directory
- **Data Models**: Student profiles, conversations, career analyses, and user entities with proper relationships

## Authentication and Authorization
- **Current Implementation**: Basic user model structure prepared for future auth implementation
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Prepared infrastructure for secure authentication workflows

## External Dependencies

### AI and Machine Learning
- **OpenAI API**: GPT-5 integration for career analysis and chat interactions
- **Career Analysis**: AI-powered profile assessment generating personalized recommendations
- **Chat System**: Conversational AI mentor for real-time career guidance

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Database Migrations**: Drizzle Kit for schema management and migrations

### Development and Deployment
- **Replit Integration**: Native Replit development environment with hot reloading
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **TypeScript**: Full-stack type safety with shared schema definitions

### UI and UX Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide Icons**: Modern icon system for consistent visual elements
- **Embla Carousel**: Touch-friendly carousel components for content display
- **Date-fns**: Date manipulation and formatting utilities

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and scalable patterns for future growth. The modular design allows for easy extension of features while maintaining code quality and developer experience.