# Auth Service Backend

Backend-only authentication service built using Node.js, Express.js, MongoDB, JWT authentication, refresh tokens, and session management.

---

## Features

- User Registration
- User Login
- JWT Authentication
- Refresh Token Flow
- Session Management
- Logout from Current Device
- Logout from All Devices
- Email OTP Verification
- Cookie-based Authentication
- Rate Limiting

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Nodemailer
- Express Rate Limit

---

## Folder Structure

```txt
src/
 ├── config
 ├── controllers
 ├── middlewares
 ├── models
 ├── routers
 ├── services
 ├── utils
```

---

## API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/register` | Register user |
| POST | `/api/user/login` | Login user |
| GET | `/api/user/get-me` | Get current user |
| GET | `/api/user/refresh-token` | Generate new access token |
| GET | `/api/user/log-out` | Logout current device |
| GET | `/api/user/log-out-all` | Logout from all devices |
| GET | `/api/user/verify-email` | Email Verification-OTP |

---

## Environment Variables

Create a `.env` file in the root directory.

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/har5h1tha/auth-service-backend.git
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

---

## Security Features

- Password hashing
- JWT-based authentication
- HTTP-only cookies
- Refresh token storage
- Refresh token hashing
- Session revocation
- Rate limiting

---

## Future Improvements

- Password Reset Flow
- Redis Caching
- Docker Support
- API Documentation
- Role-Based Authorization
- Refresh Token Rotation Detection

---
## API Testing

Tested using:
- Postman
- Thunder Client

---

## Author

Harshitha D
