"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plastic } from "../common/types";

// Define the state type
interface SelectedPlasticsState {
  selectedPlastics: Plastic[];
}

// Initial state
const initialState: SelectedPlasticsState = {
  selectedPlastics: ["HDPE", "LDPE", "PET", "PP", "PS", "PVC", "MixedPlastic"], // Start with an empty array
};

// Define the slice
const selectedPlasticsSlice = createSlice({
  name: "selectedPlastics",
  initialState,
  reducers: {
    selectAllPlastics: (state) => {
      state.selectedPlastics = ["HDPE", "LDPE", "PET", "PP", "PS", "PVC", "MixedPlastic"];
    },
    selectNonePlastics: (state) => {
      if (state.selectedPlastics.length > 1) {
        state.selectedPlastics = [state.selectedPlastics[0]];
      }
    },
    togglePlastic: (state, action: PayloadAction<Plastic>) => {
      const index = state.selectedPlastics.findIndex(
        (plastic) => plastic === action.payload
      );
      if (index >= 0) {
        state.selectedPlastics.splice(index, 1);
      } else {
        state.selectedPlastics.push(action.payload);
      }
    },
    setToItems: (state, action: PayloadAction<Plastic[]>) => {
      state.selectedPlastics = action.payload;
    },
  },
});

// Export actions and reducer
export const { selectAllPlastics, selectNonePlastics, togglePlastic, setToItems } =
  selectedPlasticsSlice.actions;
export default selectedPlasticsSlice.reducer;
