import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";

export const webhooksSlice = createSlice({
  name: "webhooks",
  initialState: {
    webhooks: [],
    selectedWebhooks: [],
    oldContent: {},
  },
  reducers: {
    setWebhooks(state, { payload }) {
      state.webhooks = cloneDeep(payload.webhooks);
    },
    setSelectedWebhooks(state, { payload }) {
      state.selectedWebhooks = cloneDeep(payload.selectedWebhooks);
    },
    setOldContent(state, { payload }) {
      state.oldContent = cloneDeep(payload.oldContent);
    },
  },
});

export const { setWebhooks, setSelectedWebhooks, setOldContent } =
  webhooksSlice.actions;

export default webhooksSlice.reducer;
