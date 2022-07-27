import { configureStore } from "@reduxjs/toolkit";
import webhooksReducer from "./webhooks";
import appsReducer from "./apps";
import uiReducer from "./ui";
import infosReducer from "./infos";
import inputsReducer from "./inputs";

export const store = configureStore({
  reducer: {
    webhooks: webhooksReducer,
    apps: appsReducer,
    ui: uiReducer,
    infos: infosReducer,
    inputs: inputsReducer,
  },
});
