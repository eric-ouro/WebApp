"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PartnersRecord } from "../common/types";

interface PartnerState {
  selectedPartners: PartnersRecord[];
}

const initialState: PartnerState = {
  selectedPartners: [],
};

const partnerSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    selectAllPartners: (state, action: PayloadAction<PartnersRecord[]>) => {
      state.selectedPartners = action.payload;
    },
    selectNonePartners: (state) => {
      if (state.selectedPartners.length > 1) {
        state.selectedPartners = [state.selectedPartners[0]];
      }
    },
    togglePartner: (
      state, action: PayloadAction<PartnersRecord>
    ) => {
      const index = state.selectedPartners.findIndex(
        (partner) => partner.CompanyID === action.payload.CompanyID
      );
      if (index >= 0) {
        if (state.selectedPartners.length > 1) {
          state.selectedPartners.splice(index, 1);
        }
      } else {
        state.selectedPartners.push(action.payload);
      }
    },
    setToPartner: (state, action: PayloadAction<PartnersRecord[]>) => {
      state.selectedPartners = action.payload;
    },
  },
});

export const { selectAllPartners, selectNonePartners, togglePartner, setToPartner } =
  partnerSlice.actions;
export default partnerSlice.reducer;
