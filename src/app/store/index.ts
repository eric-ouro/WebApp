'use client'
import { configureStore } from '@reduxjs/toolkit';
import recyclingRecordsSlice from './recyclingRecordsSlice';
import selectedPlasticsSlice from './selectedPlasticsSlice';
import selectedPartnersSlice from './selectedPartnersSlice';
import selectedFacilitiesSlice from './selectedFacilitiesSlice';
import selectedPartnerFacilitiesSlice from './selectedPartnerFacilitiesSlice';
import validPartnersSlice from './validPartnersSlice'; // Import the new slice
import validFacilitiesSlice from './validFacilitiesSlice';
import validPartnerFacilitiesSlice from './validPartnerFacilitiesSlice';
import selectedDateSlice from './selectedDateSlice';
// Create the store
export const store = configureStore({
  reducer: {
    selectedPlastics : selectedPlasticsSlice,
    selectedPartners : selectedPartnersSlice,
    selectedFacilities : selectedFacilitiesSlice,
    selectedPartnerFacilities: selectedPartnerFacilitiesSlice,
    selectedDate:selectedDateSlice,
    recyclingRecords : recyclingRecordsSlice,
    validPartners: validPartnersSlice, 
    validFacilities: validFacilitiesSlice, 
    validPartnerFacilities: validPartnerFacilitiesSlice,
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
