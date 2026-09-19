import { describe, it, expect } from "vitest";
import userReducer, { addUser, removeUser, setBookmarkedEvents } from "../lib/userSlice";

describe("Frontend userSlice Redux reducer", () => {
  it("initializes with null state", () => {
    expect(userReducer(undefined, { type: "@@INIT" })).toBeNull();
  });

  it("adds user upon successful login/restore", () => {
    const mockUser = {
      _id: "user123",
      fullName: "Test User",
      email: "test@hackcentral.me",
      role: "user",
      bookmarkedEvents: [],
    };
    const nextState = userReducer(null, addUser(mockUser));
    expect(nextState).toEqual(mockUser);
  });

  it("removes user upon logout", () => {
    const currentState = { _id: "user123", fullName: "Test User" };
    const nextState = userReducer(currentState, removeUser());
    expect(nextState).toBeNull();
  });

  it("updates bookmarkedEvents list correctly", () => {
    const currentState = { _id: "user123", bookmarkedEvents: [] };
    const nextState = userReducer(
      currentState,
      setBookmarkedEvents(["event1", "event2"])
    );
    expect(nextState.bookmarkedEvents).toEqual(["event1", "event2"]);
  });
});
