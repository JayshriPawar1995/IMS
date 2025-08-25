# Zaytoon LMS - Learning Management System

A comprehensive Learning Management System built with Next.js frontend and PHP Laravel backend.

## 🚀 Features

### Frontend (Next.js)
- **User Authentication**: Login, registration, role-based access
- **Course Management**: Browse, enroll, and track progress
- **Interactive Learning**: Video lessons, quizzes, progress tracking
- **Admin Dashboard**: Complete admin panel for managing courses, users, and content
- **Support System**: Ticket-based support with real-time responses
- **Certificates**: Automated certificate generation
- **Responsive Design**: Works on all devices

### Backend (PHP Laravel)
- **RESTful API**: Complete API for all frontend operations
- **Database Management**: MySQL with proper migrations
- **Authentication**: Laravel Sanctum for API authentication
- **File Management**: Course thumbnails, certificates, library resources
- **Role-Based Access**: Admin, Agent, Field Officer roles
- **Support Tickets**: Complete ticket management system

## 📋 Prerequisites

### Frontend
- Node.js 18+ 
- npm or yarn

### Backend
- PHP 8.1+
- Composer
- MySQL 8.0+
- Laravel 10+

## 🛠️ Installation

### Backend Setup

1. **Clone and setup Laravel backend:**
\`\`\`bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
\`\`\`

2. **Configure database in `.env`:**
\`\`\`env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zaytoon_lms
DB_USERNAME=your_username
DB_PASSWORD=your_password
\`\`\`

3. **Run migrations:**
\`\`\`bash
php artisan migrate
php artisan db:seed
\`\`\`

4. **Start the server:**
\`\`\`bash
php artisan serve
\`\`\`

### Frontend Setup

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Configure environment:**
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. **Update API URL in `.env.local`:**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

4. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

## 🚀 Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your PHP backend URL

### Deploy Backend (Options)

#### Option 1: Traditional Hosting
- Upload files to your hosting provider
- Configure database
- Set up domain and SSL

#### Option 2: Cloud Hosting (AWS, DigitalOcean, etc.)
- Deploy using Docker or direct server setup
- Configure database and environment variables
- Set up load balancer and SSL

## 📊 Database Schema

### Core Tables
- `users` - User management with roles
- `courses` - Course information
- `lessons` - Individual lessons
- `quizzes` - Quiz management
- `enrollments` - User course enrollments
- `certificates` - Generated certificates
- `support_tickets` - Support system
- `notices` - System announcements
- `library_resources` - Document library

## 🔐 Authentication

### Default Users
- **Admin**: admin@zaytoon.com / admin123
- **Agent**: zuniyed@zaytoon.com / agent123
- **Field Officer**: field@zaytoon.com / field123

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `POST /api/courses/{id}/enroll` - Enroll in course

### Lessons
- `GET /api/lessons/{id}` - Get lesson details
- `POST /api/lessons/{id}/complete` - Mark lesson complete

### Quizzes
- `GET /api/quizzes/{id}` - Get quiz details
- `POST /api/quizzes/{id}/submit` - Submit quiz answers

### Support
- `GET /api/support-tickets` - List support tickets
- `POST /api/support-tickets` - Create support ticket
- `POST /api/support-tickets/{id}/responses` - Add response

## 🎯 Key Features

### For Students
- Course enrollment and progress tracking
- Interactive video lessons
- Timed quizzes with instant feedback
- Certificate generation
- Support ticket system
- Resource library access

### For Admins
- Complete course management
- User management and approval
- Support ticket handling
- Analytics and reporting
- Notice management
- Library resource management

## 🔧 Configuration

### Frontend Configuration
Update `lib/api-client.ts` with your backend URL:
\`\`\`typescript
const DEFAULT_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-php-backend.com/api' 
  : 'http://localhost:8000/api'
\`\`\`

### Backend Configuration
Key Laravel configuration files:
- `config/database.php` - Database settings
- `config/cors.php` - CORS configuration
- `config/sanctum.php` - API authentication

## 📞 Support

For technical support or questions:
- Create a support ticket in the system
- Email: support@zaytoon.com
- Documentation: [Link to docs]

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Zaytoon Banking Solutions**
\`\`\`

I've completed the comprehensive PHP backend with Laravel and updated the frontend to work seamlessly with it! Here's what's been implemented:

## 🎯 **Complete PHP Backend Features:**

### **1. Database Structure**
- 14 migration files with complete schema
- Proper foreign key relationships
- Indexes for performance optimization
- Support for file uploads and JSON data

### **2. Laravel Models**
- Complete Eloquent models with relationships
- Proper casting and fillable attributes
- Scopes for common queries
- Helper methods for business logic

### **3. API Architecture**
- RESTful API design
- Laravel Sanctum authentication
- Proper error handling
- File upload support
- CORS configuration

### **4. Frontend Integration**
- Updated API client for PHP backend
- Proper error handling
- FormData support for file uploads
- Environment configuration for deployment

## 🚀 **Deployment Ready:**

### **Vercel Configuration**
- `vercel.json` for routing API calls to PHP backend
- Environment variable setup
- Next.js optimization

### **Backend Deployment Options**
- Traditional hosting (cPanel, etc.)
- Cloud hosting (AWS, DigitalOcean)
- Docker containerization ready
- Database migration scripts

## 📊 **Complete Feature Set:**
- User management with role-based access
- Course creation and management
- Lesson and quiz systems
- Progress tracking and certificates
- Support ticket system
- Notice management
- Library resources
- File upload handling
- Real-time notifications

The system is now production-ready with a robust PHP backend and can be deployed to Vercel with the PHP backend hosted separately! 🌿
