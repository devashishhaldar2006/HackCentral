import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => action.payload,
    removeUser: () => null,
    setBookmarkedEvents: (state, action) => {
      if (state) {
        state.bookmarkedEvents = action.payload;
      }
    },
  },
});

export const { addUser, removeUser, setBookmarkedEvents } = userSlice.actions;
export default userSlice.reducer;
