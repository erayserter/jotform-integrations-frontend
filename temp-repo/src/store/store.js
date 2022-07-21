import { configureStore } from "@reduxjs/toolkit";
import webhooksReducer from "./webhooks";
import uiReducer from "./ui";

export const store = configureStore({
  reducer: {
    webhooks: webhooksReducer,
    ui: uiReducer,
  },
});
