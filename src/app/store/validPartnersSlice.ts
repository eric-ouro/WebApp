import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartnersRecord } from '../common/types';

type ValidPartnersState = {
  partners: PartnersRecord[];
};

const initialState: ValidPartnersState = {
  partners: [],
};

const validPartnersSlice = createSlice({
  name: 'validPartners',
  initialState,
  reducers: {
    setValidPartners(state, action: PayloadAction<PartnersRecord[]>) {
      state.partners = action.payload;
    },
  },
});

export const { setValidPartners } = validPartnersSlice.actions;
export default validPartnersSlice.reducer;