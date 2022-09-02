import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

import Jotform from "../data/apps/Jotform";
import Telegram from "../data/apps/Telegram";
import ClickUp from "../data/apps/ClickUp";
import GoogleContacts from "../data/apps/GoogleContacts";
import Excel from "../data/apps/Excel";

export const appsSlice = createSlice({
  name: "apps",
  initialState: {
    apps: {
      Jotform: new Jotform(),
      Telegram: new Telegram(),
      ClickUp: new ClickUp(),
      GoogleContacts: new GoogleContacts(),
      Excel: new Excel(),
    },
    options: {
      Jotform: {},
      Telegram: {},
      ClickUp: {},
      GoogleContacts: {},
      Excel: {},
    },
  },
  reducers: {
    setOptions(state, { payload }) {
      state.options = cloneDeep(payload.options);
    },
  },
});

export const { setOptions } = appsSlice.actions;

export default appsSlice.reducer;
