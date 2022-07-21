import { configureStore } from "@reduxjs/toolkit";
import webhooksReducer from "./webhooks";

export const store = configureStore({
  reducer: {
    webhooks: webhooksReducer,
  },
});
