# Task Management MERN Stack Application

This is a full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). It includes user authentication with JWT, role-based access control (admin and regular user), and features for managing users and tasks.

## Features

- **User Authentication**: Secure user registration and login with JSON Web Tokens (JWT).
- **Role-Based Access Control**:
  - **Admin**: Can view all users, change user status, view all tasks, and perform bulk actions on tasks.
  - **Regular User**: Can view the task dashboard, and perform actions on tasks
- **User Management (Admin)**:
  - View a paginated list of all registered users.
  - Change a user's status (active/inactive). When a user's status is changed, their session is immediately invalidated for enhanced security.
  - View a paginated list of all tasks.
  - Select multiple tasks across different pages and perform bulk status updates (e.g., change to 'pending', 'in-progress', 'completed').
  - A running count of selected tasks is displayed.
- **Task Management (User)**:
  - View a paginated list of all tasks.
  - See who created each task and when, and who last updated it and when, directly in the dashboard.
  - Select multiple tasks across different pages and perform bulk status updates (e.g., change to 'pending', 'in-progress', 'completed').
  - A running count of selected tasks is displayed.
- **Responsive UI**: The application is designed to be fully responsive for both desktop and mobile devices using Tailwind CSS.
- **Dummy Data**: The application automatically populates the database with dummy tasks on the first run.
- **Audit Trail**: Each task records who created it, when it was created, who last updated it, and when it was last updated.
- **Autopopulate Users**: On first start, the backend will automatically create a default admin user (admin@example.com / admin123) and two regular users (john@example.com / password123, jane@example.com / password123) if no users exist.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs

## Prerequisites

- Node.js and npm
- MongoDB

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd project_webguru
```

### 2. Backend Setup

```bash
cd server
npm install

# Create a .env file in the server directory and add the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

npm run dev
```

The backend server will be running on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd ../client
npm install
npm start
```

The frontend development server will be running on `http://localhost:3000`.

## How to Use

1.  **Register a new user**: Navigate to `http://localhost:3000/register` and create a new account.
2.  **Login**: Use the credentials you just created to log in at `http://localhost:3000/login`.
3.  **Task Dashboard**: After logging in, you will be redirected to the task dashboard, where you can see a list of tasks.
4.  **Admin User**: To access the admin features, you can either change a user's role to 'admin' directly in your MongoDB database or register a user and then update their role.
5.  **Admin Dashboard**: Log in as an admin user and navigate to `http://localhost:3000/admin`. Here you can:
    *   View all users and toggle their active/inactive status.
    *   View all tasks and perform bulk status updates.
6.  **Dummy Data**:
    *   **Tasks**: The first time you visit the task dashboard, the application will automatically create 10 dummy tasks.
    *   **Users**: You can register multiple users to see them in the admin user management list.

## Security Note

This application implements a versioned JWT strategy. If an admin changes a user's status, the `jwtVersion` for that user is incremented in the database. The JWT includes this version number, and the authentication middleware validates it on every protected request. If the token's version does not match the user's current `jwtVersion`, the token is considered invalid, and the user is effectively logged out. This ensures that session control is immediate without needing a database query on every single request. 