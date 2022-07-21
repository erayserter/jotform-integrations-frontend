import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentContent: "choice",
    isIntegrationContent: false,
    isUpdate: false,
  },
  reducers: {
    setCurrentContent(state, { payload }) {
      state.currentContent = payload.currentContent;
    },
    setIsIntegrationContent(state, { payload }) {
      state.isIntegrationContent = payload.isIntegrationContent;
    },
    setIsUpdate(state, { payload }) {
      state.isUpdate = payload.isUpdate;
    },
  },
});

export const { setCurrentContent, setIsIntegrationContent, setIsUpdate } =
  uiSlice.actions;

export default uiSlice.reducer;
