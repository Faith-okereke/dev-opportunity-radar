// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./navSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;