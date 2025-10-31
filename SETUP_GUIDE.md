# StudyHub - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available at mongodb.com/cloud/atlas)

## Environment Variables Setup

Add these environment variables to your Vercel project or `.env.local` file:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_change_in_production
\`\`\`

### Getting MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" and select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add it to `MONGODB_URI`

### JWT Secret

Generate a secure JWT secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## Installation

1. Clone or download the project
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Add environment variables to `.env.local`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open http://localhost:3000 in your browser

## First Time Setup

1. You'll be redirected to `/auth` page
2. Click "Sign up" to create a new account
3. Enter your email, name, and password
4. You'll be logged in and redirected to the dashboard
5. Start adding subjects, tasks, and assignments!

## Features

- **Authentication**: Email/password signup and login with JWT tokens
- **Tasks**: Create tasks with priority levels and subject assignment
- **Assignments**: Track assignments with descriptions and status updates
- **Subjects**: Organize subjects with teacher info and credits
- **Notes**: Create study notes for each subject
- **Focus Mode**: Pomodoro timer with customizable durations
- **Progress**: Real-time analytics and performance tracking
- **Dark/Light Mode**: Toggle between themes

## Database Schema

The app uses MongoDB with the following collections:

- **Users**: Stores user accounts with hashed passwords
- **Tasks**: User tasks with priority and subject
- **Assignments**: User assignments with status tracking
- **Subjects**: User subjects with teacher and credits
- **Notes**: Study notes for each subject
- **FocusSessions**: Track focus mode sessions

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify the database password is correct

### "Invalid token"
- Clear localStorage and log in again
- Check JWT_SECRET is set correctly

### "Subject not found when creating tasks"
- Create at least one subject before adding tasks
- Ensure the subject name matches exactly

## Deployment

To deploy to Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy!

## Support

For issues or questions, check the code comments or create an issue in your repository.
