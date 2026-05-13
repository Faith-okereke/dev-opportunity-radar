
import { createSlice } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
  name: "navbar",
  initialState: { isOpen: false },
  reducers: {
    openNav: (state) => { state.isOpen = true; },
    closeNav: (state) => { state.isOpen = false; },
    toggleNav: (state) => { state.isOpen = !state.isOpen; },
  },
});

export const { openNav, closeNav, toggleNav } = navbarSlice.actions;
export default navbarSlice.reducer;