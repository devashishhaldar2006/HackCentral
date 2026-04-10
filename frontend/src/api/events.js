import { BASE_URL } from "../lib/constants";

export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All" && value !== "All Modes") {
      query.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/events?${query.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch events");
  }

  return res.json();
};

export const fetchEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch event");
  }

  return res.json();
};

export const fetchEventCategories = async () => {
  const res = await fetch(`${BASE_URL}/events/categories`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch categories");
  }

  return res.json();
};
