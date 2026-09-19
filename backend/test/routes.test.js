import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("API Route Integration Tests", () => {
  describe("Health Check Endpoints", () => {
    it("GET /healthz returns status 200 with ok", async () => {
      const res = await request(app).get("/healthz");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.timestamp).toBeDefined();
    });

    it("GET /api/health returns status 200 with ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });

  describe("Protected Route Guards & Standard Error Structure", () => {
    it("rejects unauthorized access to /api/profile/me without token", async () => {
      const res = await request(app).get("/api/profile/me");
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized Access/i);
    });

    it("rejects unauthorized access to /api/dashboard/user without token", async () => {
      const res = await request(app).get("/api/dashboard/user");
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized Access/i);
    });

    it("rejects unauthorized access to /api/dashboard/organizer without token", async () => {
      const res = await request(app).get("/api/dashboard/organizer");
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized Access/i);
    });

    it("rejects unauthorized submission to /api/events without token", async () => {
      const res = await request(app).post("/api/events").send({
        title: "Test Hackathon",
      });
      expect(res.status).toBe(401);
    });

    it("rejects invalid event ID parameter format on GET /api/events/:id", async () => {
      const res = await request(app).get("/api/events/invalid-id-123");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid event ID format/i);
    });
  });

  describe("Authentication Flow Validation Handling", () => {
    it("rejects signin with empty credentials with 400 validation error", async () => {
      const res = await request(app).post("/api/auth/signin").send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/All fields are required/i);
    });

    it("rejects signup with missing required fields", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        email: "test@example.com",
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/All fields are required/i);
    });

    it("rejects signup with weak password", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        fullName: "Jane Doe",
        email: "janedoe@example.com",
        password: "weak",
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Password must be at least 8 characters/i);
    });
  });
});
