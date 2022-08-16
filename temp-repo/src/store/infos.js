import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

export const infosSlice = createSlice({
  name: "infos",
  initialState: {
    appInfo: {
      source: {},
      destination: {},
      prefill: {},
    },
    apiInfo: {
      source: false,
      destination: false,
      prefill: false,
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
