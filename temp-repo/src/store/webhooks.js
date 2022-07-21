import { createSlice } from "@reduxjs/toolkit";

export const webhooksSlice = createSlice({
  name: "webhooks",
  initialState: {
    webhooks: [],
  },
  reducers: {
    setWebhooks(state, { payload }) {
      state.webhooks = [...payload.webhooks];
    },
  },
});

export const { setWebhooks } = webhooksSlice.actions;

export default webhooksSlice.reducer;
