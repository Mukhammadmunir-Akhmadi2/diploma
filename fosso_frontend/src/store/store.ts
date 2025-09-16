import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import themeReducer from "../slices/themeSlice";
import languageReducer from "../slices/languageSlice";
import wishlistReducer from "../slices/wishlistSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiClientSlice } from "../api/ApiClientSlice";

const persistConfig = {
  key: "auth",
  storage,
};
const themePersistConfig = {
  key: "theme",
  storage,
};

const languagePersistConfig = {
  key: "language",
  storage,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const persistAuthReducer = persistReducer(persistConfig, authReducer);
const persistThemeReducer = persistReducer(themePersistConfig, themeReducer);
const persistLanguageReducer = persistReducer(
  languagePersistConfig,
  languageReducer
);
const persistWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);


export const store = configureStore({
  reducer: {
    [apiClientSlice.reducerPath]: apiClientSlice.reducer,
    auth: persistAuthReducer,
    theme: persistThemeReducer,
    language: persistLanguageReducer,
    wishlist: persistWishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiClientSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
