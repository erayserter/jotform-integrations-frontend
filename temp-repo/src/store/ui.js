import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentContent: "choice",
    isIntegrationContent: false,
  },
  reducers: {
    setCurrentContent(state, { payload }) {
      state.currentContent = payload.currentContent;
    },
    setIsIntegrationContent(state, { payload }) {
      state.isIntegrationContent = payload.isIntegrationContent;
    },
  },
});

export const { setCurrentContent, setIsIntegrationContent } = uiSlice.actions;

export default uiSlice.reducer;
