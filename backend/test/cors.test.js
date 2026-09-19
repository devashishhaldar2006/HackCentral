import { describe, it, expect } from "vitest";
import { checkAllowedOrigin } from "../src/lib/cors.js";

describe("CORS Validator", () => {
  it("allows non-origin requests (e.g. mobile apps, curl)", () => {
    let resultErr = null;
    let allowed = false;

    checkAllowedOrigin(undefined, (err, ok) => {
      resultErr = err;
      allowed = ok;
    });

    expect(resultErr).toBeNull();
    expect(allowed).toBe(true);
  });

  it("allows production hackcentral.me domains", () => {
    let resultErr = null;
    let allowed = false;

    checkAllowedOrigin("https://hackcentral.me", (err, ok) => {
      resultErr = err;
      allowed = ok;
    });

    expect(resultErr).toBeNull();
    expect(allowed).toBe(true);
  });

  it("blocks random external origins", () => {
    let resultErr = null;
    let allowed = false;

    checkAllowedOrigin("https://malicious-site.example.com", (err, ok) => {
      resultErr = err;
      allowed = ok;
    });

    expect(resultErr).toBeDefined();
    expect(allowed).toBeFalsy();
  });

  it("blocks arbitrary unassociated vercel deployments", () => {
    let resultErr = null;
    let allowed = false;

    checkAllowedOrigin("https://random-scam-app.vercel.app", (err, ok) => {
      resultErr = err;
      allowed = ok;
    });

    expect(resultErr).toBeDefined();
    expect(allowed).toBeFalsy();
  });
});
