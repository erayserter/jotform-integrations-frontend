import { createSlice } from "@reduxjs/toolkit";

export const prefillsSlice = createSlice({
  name: "prefills",
  initialState: {
    prefills: [],
  },
  reducers: {
    setPrefills(state, { payload }) {
      state.prefills = [...payload.prefills];
    },
  },
});

export const { setPrefills } = prefillsSlice.actions;

export default prefillsSlice.reducer;
