"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesRecord } from "../common/types";

interface SelectedFacilitiesState {
  selectedFacilities: FacilitiesRecord[];
}

const initialState: SelectedFacilitiesState = {
  selectedFacilities: [], // Start with an empty array
};

const selectedFacilitiesSlice = createSlice({
  name: "selectedFacilities",
  initialState,
  reducers: {
    selectAllFacilities: (state, action: PayloadAction<FacilitiesRecord[]>) => {
      state.selectedFacilities = action.payload;
    },
    selectNoneFacilities: (state) => {
      if (state.selectedFacilities.length > 1) {
        state.selectedFacilities = [state.selectedFacilities[0]];
      }
    },
    toggleFacility: (state, action: PayloadAction<FacilitiesRecord>) => {
      const index = state.selectedFacilities.findIndex(
        (facility) => facility.facilityID === action.payload.facilityID
      );
      if (index >= 0) {
        if (state.selectedFacilities.length > 1) {
          state.selectedFacilities.splice(index, 1);
        }
      } else {
        state.selectedFacilities.push(action.payload);
      }
    },
    setToFacility: (state, action: PayloadAction<FacilitiesRecord[]>) => {
      state.selectedFacilities = action.payload;
    },
  },
});

// Export actions and reducer
export const { selectAllFacilities, selectNoneFacilities, toggleFacility} =
  selectedFacilitiesSlice.actions;
export default selectedFacilitiesSlice.reducer;
