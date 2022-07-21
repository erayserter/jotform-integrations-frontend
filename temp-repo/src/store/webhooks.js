import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

export const webhooksSlice = createSlice({
  name: "webhooks",
  initialState: {
    webhooks: [],
    selectedWebhooks: [],
  },
  reducers: {
    setWebhooks(state, { payload }) {
      state.webhooks = cloneDeep(payload.webhooks);
    },
    setSelectedWebhooks(state, { payload }) {
      state.selectedWebhooks = [...payload.selectedWebhooks];
    },
  },
});

export const { setWebhooks, setSelectedWebhooks } = webhooksSlice.actions;

export default webhooksSlice.reducer;
