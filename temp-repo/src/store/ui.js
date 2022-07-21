import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentContent: "choice",
    isIntegrationContent: false,
    isUpdate: false,
    isTemplate: false,
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
    setIsTemplate(state, { payload }) {
      state.isTemplate = payload.isTemplate;
    },
  },
});

export const {
  setCurrentContent,
  setIsIntegrationContent,
  setIsUpdate,
  setIsTemplate,
} = uiSlice.actions;

export default uiSlice.reducer;
