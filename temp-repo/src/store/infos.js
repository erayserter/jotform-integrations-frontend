import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

import Jotform from "../data/apps/Jotform";
import Telegram from "../data/apps/Telegram";
import ClickUp from "../data/apps/ClickUp";

export const infosSlice = createSlice({
  name: "infos",
  initialState: {
    appInfos: {
      source: {},
      destination: {},
    },
    apiInfo,
  },
  reducers: {},
});

export const {} = infosSlice.actions;

export default infosSlice.reducer;
