import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import { io as Client } from "socket.io-client";
import jwt from "jsonwebtoken";
import { initializeSocket } from "../src/lib/socket.js";
import { ENV } from "../src/lib/env.js";

import Event from "../src/models/Event.js";
import { vi } from "vitest";

describe("Socket.IO Gateway & Room Authorization Tests", () => {
  let server;
  let serverPort;
  const mockUserId = "66d8e0f11122334455667788";
  const validToken = jwt.sign({ _id: mockUserId }, ENV.JWT_SECRET || "fallback_secret");

  beforeAll(async () => {
    // Stub Event.findById to isolate socket testing without waiting for live MongoDB connection
    vi.spyOn(Event, "findById").mockImplementation(() => ({
      select: vi.fn().mockResolvedValue(null),
    }));

    server = http.createServer();
    initializeSocket(server);
    await new Promise((resolve) => {
      server.listen(0, () => {
        serverPort = server.address().port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it("rejects socket connection when no authentication token is provided", async () => {
    const client = Client(`http://localhost:${serverPort}`, {
      transports: ["websocket"],
      reconnection: false,
    });

    const errorPromise = new Promise((resolve) => {
      client.on("connect_error", (err) => {
        resolve(err.message);
      });
    });

    const errorMsg = await errorPromise;
    expect(errorMsg).toMatch(/Authentication error/i);
    client.disconnect();
  });

  it("accepts socket connection with valid JWT cookie", async () => {
    const client = Client(`http://localhost:${serverPort}`, {
      transports: ["websocket"],
      extraHeaders: {
        cookie: `token=${validToken}`,
      },
    });

    await new Promise((resolve) => {
      client.on("connect", () => {
        expect(client.connected).toBe(true);
        client.disconnect();
        resolve();
      });
    });
  });

  it("rejects joining event room with invalid eventId format", async () => {
    const client = Client(`http://localhost:${serverPort}`, {
      transports: ["websocket"],
      extraHeaders: {
        cookie: `token=${validToken}`,
      },
    });

    await new Promise((resolve) => {
      client.on("connect", () => {
        client.emit("join_event_room", "invalid-id");
      });

      client.on("error", (err) => {
        expect(err.message).toMatch(/Invalid event ID for room/i);
        client.disconnect();
        resolve();
      });
    });
  });

  it("rejects joining event room when event does not exist", async () => {
    const client = Client(`http://localhost:${serverPort}`, {
      transports: ["websocket"],
      extraHeaders: {
        cookie: `token=${validToken}`,
      },
    });

    const nonExistentId = "507f1f77bcf86cd799439011";

    await new Promise((resolve) => {
      client.on("connect", () => {
        client.emit("join_event_room", nonExistentId);
      });

      client.on("error", (err) => {
        expect(err.message).toMatch(/Event does not exist/i);
        client.disconnect();
        resolve();
      });
    });
  });
});
