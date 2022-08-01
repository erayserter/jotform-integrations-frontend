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
      state.settingsSelections = Object.assign({}, payload.settingsSelections);
    },
    newSettingsHandler(state, { payload }) {
      state.settingsSelections = {
        ...state.settingsSelections,
        [payload.type]: {
          ...state.settingsSelections[payload.type],
          [payload.label]: payload.value,
        },
      };
    },
  },
});

export const { setAppSelections, setSettingsSelections, newSettingsHandler } =
  inputsSlice.actions;

export default inputsSlice.reducer;
