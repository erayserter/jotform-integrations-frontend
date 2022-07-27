import { createSlice } from "@reduxjs/toolkit";

export const inputsSlice = createSlice({
  name: "inputs",
  initialState: {
    appSelections: {
      webhookId: null,
      name: "Integration",
      source: {
        app: null,
        action: null,
        key: null,
        auth_id: null,
      },
      destination: {
        app: null,
        action: null,
        key: null,
        auth_id: null,
      },
    },
    settingsSelections: { source: {}, destination: {} },
  },
  reducers: {
    setAppSelections(state, { payload }) {
      state.appSelections = { ...payload.appSelections };
    },
    setSettingsSelections(state, { payload }) {
      state.settingsSelections = { ...payload.settingsSelections };
    },
  },
});

export const { setAppSelections, setSettingsSelections } = inputsSlice.actions;

export default inputsSlice.reducer;
