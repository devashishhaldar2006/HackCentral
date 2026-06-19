import axios from "axios";
import { BASE_URL } from "../lib/constants";

export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "All" &&
      value !== "All Modes"
    ) {
      query.append(key, value);
    }
  });

  try {
    const res = await axios.get(`${BASE_URL}/events`, {
      params: Object.fromEntries(query.entries()),
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch events");
  }
};

export const fetchEventById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/events/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch event");
  }
};

export const fetchEventCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/events/categories`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch categories",
    );
  }
};
