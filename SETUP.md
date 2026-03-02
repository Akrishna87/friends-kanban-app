# Friends Kanban App - Setup Guide

## Project Overview
A collaborative Kanban board application with Google OAuth authentication, built following SDLC best practices.

## Technology Stack
- **Backend**: Node.js, Express.js, PostgreSQL, Socket.io
- **Frontend**: React, Tailwind CSS
- **Authentication**: Google OAuth 2.0, JWT
- **Deployment**: Render (Backend & Database), Netlify/Vercel (Frontend)
- **Monitoring**: UptimeRobot

## Complete Project Structure

```
friends-kanban-app/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   ├── columnController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Board.js
│   │   ├── Column.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boards.js
│   │   ├── columns.js
│   │   └── tasks.js
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── socket/
│   │   └── handlers.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Board/
│   │   │   ├── Column/
│   │   │   └── Task/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   ├── DEPLOYMENT_GUIDE.md
│   ├── TEST_PLAN.md
│   └── API_DOCUMENTATION.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- Google Cloud Console account (for OAuth)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Configure environment variables in .env:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/kanban_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Boards Table
```sql
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Columns Table
```sql
CREATE TABLE columns (
  id SERIAL PRIMARY KEY,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INTEGER REFERENCES users(id),
  position INTEGER NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
6. Add authorized JavaScript origins
7. Copy Client ID and Client Secret to .env file

## Deployment

Refer to the comprehensive [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Render and Netlify/Vercel.

## Testing

Refer to the [Test Plan](./docs/TEST_PLAN.md) for comprehensive testing procedures.

## Support

For issues and questions, please create an issue in this repository.
