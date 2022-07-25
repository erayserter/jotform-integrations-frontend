import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

import Jotform from "../data/apps/Jotform";
import Telegram from "../data/apps/Telegram";
import ClickUp from "../data/apps/ClickUp";

export const appsSlice = createSlice({
  name: "apps",
  initialState: {
    apps: {
      Jotform: new Jotform(),
      Telegram: new Telegram(),
      ClickUp: new ClickUp(),
    },
    options: { Jotform: {}, Telegram: {}, ClickUp: {} },
  },
  reducers: {
    setOptions(state, { payload }) {
      state.options = cloneDeep(payload.options);
    },
  },
});

export const { setOptions } = appsSlice.actions;

export default appsSlice.reducer;
