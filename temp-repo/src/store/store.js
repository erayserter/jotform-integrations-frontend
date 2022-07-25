import { configureStore } from "@reduxjs/toolkit";
import webhooksReducer from "./webhooks";
import appsReducer from "./apps";

export const store = configureStore({
  reducer: {
    webhooks: webhooksReducer,
    apps: appsReducer,
  },
});
