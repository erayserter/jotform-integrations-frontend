import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

import Jotform from "../data/apps/Jotform";
import Telegram from "../data/apps/Telegram";
import ClickUp from "../data/apps/ClickUp";

export const infosSlice = createSlice({
  name: "infos",
  initialState: {
    appInfo: {
      source: {},
      destination: {},
    },
    apiInfo: {
      source: false,
      destination: false,
    },
  },
  reducers: {
    setAppInfo(state, { payload }) {
      state.appInfo = cloneDeep(payload.appInfo);
    },
    setApiInfo(state, { payload }) {
      state.apiInfo = { ...payload.apiInfo };
    },
  },
});

export const { setAppInfo, setApiInfo } = infosSlice.actions;

export default infosSlice.reducer;
