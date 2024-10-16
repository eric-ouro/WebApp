"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesRecord } from "../common/types";

// Define the state type
interface SelectedPartnerFacilitiesState {
  selectedPartnerFacilities: FacilitiesRecord[];
}

// Initial state
const initialState: SelectedPartnerFacilitiesState = {
  selectedPartnerFacilities: [], // Start with an empty array
};

// Define the slice
const selectedPartnerFacilitiesSlice = createSlice({
  name: "selectedPartnerFacilities",
  initialState,
  reducers: {
    selectAllPartnerFacilities: (state, action: PayloadAction<FacilitiesRecord[]>) => {
      state.selectedPartnerFacilities = action.payload;
    },
    selectNonePartnerFacilities: (state) => {
      if (state.selectedPartnerFacilities.length > 1) {
        state.selectedPartnerFacilities = [state.selectedPartnerFacilities[0]];
      }
    },
    togglePartnerFacility: (state, action: PayloadAction<FacilitiesRecord>) => {
      const index = state.selectedPartnerFacilities.findIndex(
        (facility) => facility.facilityID === action.payload.facilityID
      );
      if (index >= 0) {
        if (state.selectedPartnerFacilities.length > 1) {
          state.selectedPartnerFacilities.splice(index, 1);
        }
      } else {
        state.selectedPartnerFacilities.push(action.payload);
      }
    },
    setToPartnerFacilities: (state, action: PayloadAction<FacilitiesRecord[]>) => {
      state.selectedPartnerFacilities = action.payload;
      // unused
    },
  },
});

// Export actions and reducer
export const { selectAllPartnerFacilities, selectNonePartnerFacilities, togglePartnerFacility, setToPartnerFacilities } =
  selectedPartnerFacilitiesSlice.actions;
export default selectedPartnerFacilitiesSlice.reducer;
