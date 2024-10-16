import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecyclingRecord } from "../common/types";

interface RecyclingRecordsState {
  records: RecyclingRecord[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RecyclingRecordsState = {
  records: [],
  status: "idle",
  error: null,
};

const recyclingRecordsSlice = createSlice({
  name: "recyclingRecords",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<RecyclingRecord[]>) => {
      state.records = action.payload;
      state.status = "succeeded";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setRecords, setLoading, setError } = recyclingRecordsSlice.actions;
export default recyclingRecordsSlice.reducer;