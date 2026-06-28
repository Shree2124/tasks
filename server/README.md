# To-Do List API (Node.js + Express + MongoDB)

A backend To-Do List API with authentication and persistent task storage using MongoDB (Mongoose).

## Features

- Create tasks with `title` and `description`
- View all tasks for the logged-in user
- Update task details
- Mark task as completed
- Delete tasks
- Persistent storage in MongoDB
- Validation and graceful error handling
- Bonus support:
  - Due dates (`dueDate`)
  - Categories (`category`)

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT auth

## Project Structure

- `src/index.js` - App bootstrap and database connection startup.
- `src/app.js` - Express app setup, route registration, and global error middleware.
- `src/db/connectionDB.js` - MongoDB connection logic.
- `src/models/user/user.model.js` - User schema and auth-related model methods.
- `src/models/task/task.model.js` - Task schema and task field validation.
- `src/controllers/user/user.controller.js` - Task CRUD + completion logic.
- `src/routes/user/user.routes.js` - Task API routes (protected).
- `src/middlewares/auth/auth.middleware.js` - JWT verification middleware.
- `src/middlewares/error/error.middleware.js` - 404 and centralized error handlers.
- `src/utils/` - Shared utilities (`ApiError`, `ApiResponse`, async wrapper).

## Key Decisions

- **User ownership enforcement:** Task update/delete/complete actions verify task ownership before mutating data.
- **Validation at API + model layer:** Title is validated in controller and schema to avoid empty task names.
- **Completion guard:** API blocks re-completing an already completed task with a meaningful `400` message.
- **Centralized errors:** Unhandled errors and unknown routes return consistent JSON error responses.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create/update `.env` in project root with required values:

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173
MONGODB_URL=mongodb://127.0.0.1:27017
DB_NAME=todo
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
JWT_SECRET=your_jwt_secret
BACKEND_URL=http://localhost:8000
```

3. Start development server:

```bash
npm run dev
```

Server runs on `http://localhost:<PORT>`.

## Authentication Notes

Task routes are protected and require a valid JWT access token:

- Cookie: `accessToken`
- Or header: `Authorization: Bearer <token>`

Use existing auth endpoints under `/api/v1/auth` to register/login and obtain tokens.

## Auth API Endpoints

Base path: `/api/v1/auth`

### 1) Register User

- **POST** `/register`
- Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

### 2) Login User

- **POST** `/login`
- Body:

```json
{
  "username": "john_doe",
  "password": "StrongPassword123"
}
```

You can also login using `email` + `password`.

### 3) Refresh Access Token

- **POST** `/refresh-token`
- Accepts `refreshToken` via cookie or request body.

### 4) Get Current User (Protected)

- **POST** `/get-user`
- Requires valid access token.

### 5) Logout User (Protected)

- **POST** `/logout`
- Requires valid access token.

## Task API Endpoints

Base path: `/api/v1/user`

### 1) Create Task

- **POST** `/add-task`
- Body:

```json
{
  "title": "Finish backend task",
  "description": "Implement validations",
  "priority": "high",
  "dueDate": "2026-04-10T18:30:00.000Z",
  "category": "work"
}
```

### 2) Get My Tasks

- **GET** `/get-tasks`

### 3) Update Task

- **PUT** `/update-task/:taskId`
- Body can include any of:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2026-04-11T18:30:00.000Z",
  "category": "personal"
}
```

### 4) Mark Task Completed

- **PATCH** `/complete-task/:taskId`
- Returns `400` if task is already completed.

### 5) Delete Task

- **DELETE** `/delete-task/:taskId`

## Validation & Error Handling

- Task title must be a non-empty string.
- Marking an already completed task again is blocked.
- Ownership violations return `403`.
- Not-found resources return `404`.
- All API errors return JSON with:

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

## Quick Manual Test Flow

1. Register/Login via `/api/v1/auth`.
2. Create task via `POST /api/v1/user/add-task`.
3. List tasks via `GET /api/v1/user/get-tasks`.
4. Update via `PUT /api/v1/user/update-task/:taskId`.
5. Complete via `PATCH /api/v1/user/complete-task/:taskId`.
6. Delete via `DELETE /api/v1/user/delete-task/:taskId`.
