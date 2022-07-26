import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

import Jotform from "../data/apps/Jotform";
import Telegram from "../data/apps/Telegram";
import ClickUp from "../data/apps/ClickUp";

export const inputsSlice = createSlice({
  name: "inputs",
  initialState: {
    appSelections: {
      source: {
        name: "Integration",
        app: null,
        key: null,
        auth_id: null,
      },
      destination: {
        name: "Integration",
        app: null,
        key: null,
        auth_id: null,
      },
    },
    settingsSelections: {},
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
