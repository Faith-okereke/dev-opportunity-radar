import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  skills: string[];
  wantsRemote: boolean;
  minSalary: number;
  personalModeActive: boolean;
}

const getInitialState = (): ProfileState => {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse profile", e);
    }
  }
  return {
    skills: [],
    wantsRemote: false,
    minSalary: 0,
    personalModeActive: false,
  };
};

const initialState: ProfileState = getInitialState();

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem("userProfile", JSON.stringify(newState));
      return newState;
    },
    togglePersonalMode: (state) => {
      state.personalModeActive = !state.personalModeActive;
      localStorage.setItem("userProfile", JSON.stringify(state));
    },
  },
});

export const { updateProfile, togglePersonalMode } = profileSlice.actions;

export default profileSlice.reducer;
