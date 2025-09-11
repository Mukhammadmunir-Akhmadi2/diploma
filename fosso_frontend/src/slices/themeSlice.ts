import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
}

function getInitialState(): ThemeState {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? { theme: "dark" }
    : { theme: "light" };
}

const initialState: ThemeState = getInitialState();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) =>
      state.theme === "light" ? { theme: "dark" } : { theme: "light" },
    setTheme: (_, action: PayloadAction<ThemeState>) => action.payload,
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
