import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, { payload }) {
      state.isLoggedIn = payload.isLoggedIn;
    },
  },
});

export const { setIsLoggedIn } = userSlice.actions;

export default userSlice.reducer;
