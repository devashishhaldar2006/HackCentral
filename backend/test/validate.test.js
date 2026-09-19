import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  ValidationError,
} from "../src/lib/validate.js";

describe("Validation Utility Tests", () => {
  describe("validateEmail", () => {
    it("accepts valid email addresses", () => {
      expect(() => validateEmail("dev@hackcentral.me")).not.toThrow();
      expect(() => validateEmail("user.name+tag@example.co.uk")).not.toThrow();
    });

    it("rejects invalid email formats", () => {
      expect(() => validateEmail("not-an-email")).toThrow(ValidationError);
      expect(() => validateEmail("missing@domain")).toThrow(ValidationError);
      expect(() => validateEmail("")).toThrow(ValidationError);
    });
  });

  describe("validatePassword", () => {
    it("accepts strong passwords meeting all criteria", () => {
      expect(() => validatePassword("StrongPass123!")).not.toThrow();
      expect(() => validatePassword("H@ckCentral2026")).not.toThrow();
    });

    it("rejects weak passwords lacking numbers or special chars", () => {
      expect(() => validatePassword("short")).toThrow(ValidationError);
      expect(() => validatePassword("OnlyLettersPassword")).toThrow(ValidationError);
      expect(() => validatePassword("NoSpecialChar123")).toThrow(ValidationError);
    });
  });
});
