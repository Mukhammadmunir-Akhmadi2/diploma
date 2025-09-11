import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiClientSlice } from "../api/ApiClientSlice";
import themeReducer from "../slices/themeSlice"

const persistConfig = {
  key: "auth",
  storage,
};
const themePersistConfig = {
  key: "theme",
  storage,
};

const persistAuthReducer = persistReducer(persistConfig, authReducer);
const persistThemeReducer = persistReducer(themePersistConfig, themeReducer);


export const store = configureStore({
  reducer: {
    [apiClientSlice.reducerPath]: apiClientSlice.reducer,
    auth: persistAuthReducer,
    theme: persistThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiClientSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
