import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentContent: "choice",
  },
  reducers: {
    setCurrentContent(state, { payload }) {
      state.currentContent = payload.currentContent;
    },
  },
});

export const { setCurrentContent } = uiSlice.actions;

export default uiSlice.reducer;
