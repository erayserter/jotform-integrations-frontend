import { createSlice } from "@reduxjs/toolkit";

export const inputsSlice = createSlice({
  name: "inputs",
  initialState: {
    appSelections: {
      webhookId: undefined,
      name: "Integration",
      source: {
        app: undefined,
        action: undefined,
        key: undefined,
        auth_id: undefined,
      },
      destination: {
        app: undefined,
        action: undefined,
        key: undefined,
        auth_id: undefined,
      },
      prefill: {
        app: undefined,
        action: undefined,
        key: undefined,
        auth_id: undefined,
      },
    },
    settingsSelections: { source: {}, destination: {}, prefill: {} },
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
