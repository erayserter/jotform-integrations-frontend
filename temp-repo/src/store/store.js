import { configureStore } from "@reduxjs/toolkit";
import webhooksReducer from "./webhooks";
import appsReducer from "./apps";
import uiReducer from "./ui";

export const store = configureStore({
  reducer: {
    webhooks: webhooksReducer,
    apps: appsReducer,
    ui: uiReducer,
  },
});
