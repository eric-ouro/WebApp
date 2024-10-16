import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedDateState {
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

const initialState: SelectedDateState = {
  startMonth:3,
  startYear:2023,
  endMonth: 9,
  endYear: 2024,
};

const selectedDateSlice = createSlice({
  name: "selectedDate",
  initialState,
  reducers: {
    setStartMonth: (state, action: PayloadAction<number>) => {
      state.startMonth = action.payload;
    },
    setStartYear: (state, action: PayloadAction<number>) => {
      state.startYear = action.payload;
    },
    setEndMonth: (state, action: PayloadAction<number>) => {
      state.endMonth = action.payload;
    },
    setEndYear: (state, action: PayloadAction<number>) => {
      state.endYear = action.payload;
    },
  },
});

export const { setStartMonth, setStartYear, setEndMonth, setEndYear } = selectedDateSlice.actions;
export default selectedDateSlice.reducer;