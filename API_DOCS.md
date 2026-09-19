# 📡 HackCentral API Specification & Documentation

Base URLs:
- **Local Development**: `http://localhost:7777`
- **Production API**: `https://hackcentral-backend.onrender.com`

---

## 📑 Table of Contents
1. [Authentication (`/api/auth`)](#1-authentication-apiauth)
2. [User Profile (`/api/profile`)](#2-user-profile-apiprofile)
3. [Events (`/api/events`)](#3-events-apievents)
4. [Dashboard Analytics (`/api/dashboard`)](#4-dashboard-analytics-apidashboard)
5. [Saved & Bookmarked Events (`/api/saved`)](#5-saved--bookmarked-events-apisaved)
6. [Resources (`/api/resources`)](#6-resources-apiresources)
7. [Notifications (`/api/notifications`)](#7-notifications-apinotifications)
8. [AI Project Lab (`/api/project-lab`)](#8-ai-project-lab-apiproject-lab)
9. [Socket.IO Real-Time Gateway](#9-socketio-real-time-gateway)
10. [Standard Error Envelope](#10-standard-error-envelope)

---

## 1. Authentication (`/api/auth`)

### 1.1 Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "fullName": "Jane Developer",
    "email": "jane@example.com",
    "password": "StrongPassword123!",
    "role": "user"
  }
  ```
  *(Role can be `"user"` or `"organizer"`)*
- **Response**: `200 OK` (sets HTTP-only `token` cookie)

### 1.2 Sign In
- **Endpoint**: `POST /api/auth/signin`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "StrongPassword123!",
    "role": "user"
  }
  ```
- **Response**: `200 OK` (sets HTTP-only `token` cookie)

### 1.3 Sign Out
- **Endpoint**: `POST /api/auth/signout`
- **Auth Required**: No
- **Response**: `200 OK` (clears cookie)

### 1.4 Social OAuth Sign-In
- **Endpoint**: `POST /api/auth/social-login`
- **Body**:
  ```json
  {
    "idToken": "<FIREBASE_ID_TOKEN>",
    "role": "user"
  }
  ```
- **Response**: `200 OK`

### 1.5 Send Reset OTP
- **Endpoint**: `POST /api/auth/send-otp`
- **Body**: `{"email": "jane@example.com"}`
- **Response**: `200 OK`

### 1.6 Verify OTP & Reset Password
- **Endpoint**: `POST /api/auth/verify-otp`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "otp": "123456",
    "newPassword": "BrandNewPassword123!"
  }
  ```
- **Response**: `200 OK`

---

## 2. User Profile (`/api/profile`)

### 2.1 Get Current User (`/me`)
- **Endpoint**: `GET /api/profile/me`
- **Auth Required**: Yes (Cookie `token`)
- **Response**: `200 OK` returns sanitized user details, stats, badges, and streaks.

### 2.2 Edit Profile
- **Endpoint**: `PATCH /api/profile/me/edit`
- **Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "gender": "female",
    "college": "MIT",
    "location": "Boston, MA",
    "skills": ["React", "Node.js"],
    "interests": ["Web3", "AI"],
    "github": "https://github.com/janedoe",
    "linkedin": "https://linkedin.com/in/janedoe"
  }
  ```
- **Response**: `200 OK`

### 2.3 Change Password
- **Endpoint**: `PATCH /api/profile/me/change-password`
- **Body**:
  ```json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword123!"
  }
  ```
- **Response**: `200 OK`

### 2.4 Upload Avatar
- **Endpoint**: `PATCH /api/profile/me/upload-avatar`
- **Content-Type**: `multipart/form-data` (Field name: `avatar`, max 5MB, JPG/PNG/WebP)
- **Response**: `200 OK`

### 2.5 Delete Avatar
- **Endpoint**: `DELETE /api/profile/me/avatar`
- **Response**: `200 OK`

---

## 3. Events (`/api/events`)

### 3.1 List Events
- **Endpoint**: `GET /api/events`
- **Query Params**:
  - `search`: string
  - `category`: `Conference` | `Hackathon` | `Workshop` | `Expo` | `Meetup` | `Entertainment` | `Competition`
  - `mode`: `Online` | `Offline` | `Hybrid`
  - `price`: `Free` | `Paid`
  - `tag`: string
  - `startDate`, `endDate`: ISO 8601 strings
  - `sort`: `newest` | `oldest` | `title`
  - `page`: integer (default 1)
  - `limit`: integer (default 12, max 50)
- **Response**: `200 OK` with paginated event array.

### 3.2 Get Event Details
- **Endpoint**: `GET /api/events/:id`
- **Response**: `200 OK` with single event object.

### 3.3 Get Event Categories
- **Endpoint**: `GET /api/events/categories`
- **Response**: `200 OK` with category counts.

### 3.4 Submit Event (Organizer Only)
- **Endpoint**: `POST /api/events`
- **Auth Required**: Yes (`role === "organizer"`)
- **Body**:
  ```json
  {
    "title": "Global AI Hackathon 2026",
    "description": "48-hour virtual hackathon building agents.",
    "startDate": "2026-11-01T09:00:00Z",
    "endDate": "2026-11-03T18:00:00Z",
    "category": "Hackathon",
    "mode": "Online",
    "price": "Free",
    "registrationLink": "https://hackathon.example.com",
    "tags": ["AI", "Agents", "OpenSource"]
  }
  ```
- **Response**: `201 Created`

### 3.5 Register for Event
- **Endpoint**: `POST /api/events/:id/register`
- **Auth Required**: Yes
- **Body**: `{"teamName": "ByteBusters"}`
- **Response**: `200 OK`

### 3.6 Post Announcement (Organizer Only)
- **Endpoint**: `POST /api/events/:id/announcements`
- **Auth Required**: Yes (Must be submitter of event)
- **Body**: `{"message": "Submissions deadline extended by 2 hours!"}`
- **Response**: `200 OK`

---

## 4. Dashboard Analytics (`/api/dashboard`)

### 4.1 User Dashboard
- **Endpoint**: `GET /api/dashboard/user`
- **Auth Required**: Yes
- **Response**: `200 OK` (registered events, saved events, XP, badges, recent activity).

### 4.2 Organizer Dashboard
- **Endpoint**: `GET /api/dashboard/organizer`
- **Auth Required**: Yes (`role === "organizer"`)
- **Response**: `200 OK` (submitted events, participant counts, views, metrics).

---

## 5. Saved & Bookmarked Events (`/api/saved`)

- `GET /api/saved`: Fetch all bookmarked events for the authenticated user.
- `POST /api/saved/save`: Body: `{"eventId": "<EVENT_ID>"}`
- `POST /api/saved/unsave`: Body: `{"eventId": "<EVENT_ID>"}`

---

## 6. Resources (`/api/resources`)

- `GET /api/resources`: Fetch curated developer guides, starter templates, and APIs.
- `GET /api/resources/:id`: Fetch single resource by ID.

---

## 7. Notifications (`/api/notifications`)

- `GET /api/notifications`: Get notification feed for current user.
- `PUT /api/notifications/:id/read`: Mark a notification as read.

---

## 8. AI Project Lab (`/api/project-lab`)

*Protected by strict per-user rate limit (15 req/15min) and structured Zod schema validation.*

### 8.1 Evaluate Project
- **Endpoint**: `POST /api/project-lab/evaluate`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "title": "HackCentral",
    "description": "Comprehensive aggregator and AI assistant for developer hackathons.",
    "techStack": "React, Node.js, Express, MongoDB, Socket.IO"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "result": {
      "innovationScore": 8,
      "technicalComplexity": 8,
      "marketPotential": 9,
      "presentationReadiness": 7,
      "strengths": ["Clear product need", "Real-time updates"],
      "weaknesses": ["Moderation overhead"],
      "improvements": ["Automated scraper verification"],
      "overallFeedback": "High market viability for collegiate developers."
    }
  }
  ```

### 8.2 Generate Pitch Deck
- **Endpoint**: `POST /api/project-lab/pitch-deck`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "title": "HackCentral",
    "problem": "Students struggle to find relevant hackathons across disconnected forums.",
    "solution": "A unified platform with real-time room communication and AI mentorship.",
    "targetAudience": "College developers and organizers",
    "techStack": "MERN + Socket.IO"
  }
  ```
- **Response**: `200 OK` (returns structured pitch deck slides)

---

## 9. Socket.IO Real-Time Gateway

- **Connection**: `wss://<HOST>/socket.io/?EIO=4&transport=websocket`
- **Authentication**: Verified via HTTP-only session cookie upon handshake.

### Client-to-Server Events:
- `join_event_room(eventId)`: Validates `eventId` format and verifies authorization (organizer, participant, or approved event).
- `leave_event_room(eventId)`: Leaves room.

### Server-to-Client Broadcasts:
- `new_event`: Triggered when an event is submitted.
- `new_registration`: Emitted directly to the event organizer.
- `participant_count_update`: Broadcast to `event_<id>` when registrations change.
- `new_announcement`: Broadcast to `event_<id>` when organizer posts an update.

---

## 10. Standard Error Envelope

All error responses across the backend conform to the following schema:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_SERVER_ERROR",
    "message": "Human-readable explanation of error"
  },
  "message": "Human-readable explanation of error"
}
```
Internal server errors in production environments will never expose database driver traces or sensitive stacks.
