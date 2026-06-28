# HackCentral API Documentation

Base URL: `http://localhost:7777` (Local Development)

## 🔐 Authentication (`/api/auth`)

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**: `201 Created` (Returns User object and JWT token)

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response**: `200 OK` (Returns User object and JWT token)

---

## 📅 Events (`/api/events`)

### 1. Get All Events
- **URL**: `/api/events`
- **Method**: `GET`
- **Query Params**: `?category=hackathon&status=upcoming`
- **Response**: `200 OK` (Array of event objects)

### 2. Get Event by ID
- **URL**: `/api/events/:id`
- **Method**: `GET`
- **Response**: `200 OK` (Single event object)

---

## 👤 Profile (`/api/profile`)

### 1. Get Current User Profile
- **URL**: `/api/profile/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (Returns detailed user profile)

---

## 🤖 Project Lab (AI Evaluator) (`/api/project-lab`)

### 1. Evaluate Project Idea
- **URL**: `/api/project-lab/evaluate`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "HackCentral",
    "description": "A centralized platform for hackathons..."
  }
  ```
- **Response**: `200 OK` (Returns AI evaluation metrics and feedback)

---

> **Note:** This document serves as a foundational template. As you continue building and modifying the backend routes in `backend/src/routes`, please update this document to accurately reflect your actual request payloads, response structures, and any new endpoints.
