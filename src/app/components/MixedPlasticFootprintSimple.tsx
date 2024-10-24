"use client";
import React from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "../common/colors";
import { Plastic, RecyclingRecord, MixedPlasticRecyclingData, RecyclingData } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToItems } from "../store/selectedPlasticsSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateMixedPlasticSummaries } from "../utils/calculateSummaries";
import { calculateItemRatios } from "../utils/calculateItemRatios";

const MixedPlasticFootprintSimple = () => {
  // Get the selected plastics from the Redux store
  const selectedPlastics = useSelector(
    (state: RootState) => state.selectedPlastics.selectedPlastics
  );

  // Get the selected partners from the Redux store
  const selectedPartners = useSelector(
    (state: RootState) => state.selectedPartners.selectedPartners
  );

  // Get the selected facilities from the Redux store
  const selectedFacilities = useSelector(
    (state: RootState) => state.selectedFacilities.selectedFacilities
  );

  // Get the selected partner facilities from the Redux store
  const selectedPartnerFacilities = useSelector(
    (state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities
  );

  // Get the recycling records from the Redux store
  const plastics = useSelector((state: RootState) => state.recyclingRecords);

  // Initialize the dispatch function from Redux
  const dispatch = useDispatch();

  // Check if the plastics data is still loading
  if (plastics.status === "loading") {
    return <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mr-6 h-[344px]">
    <div className="h4 w-[140px] rounded-full bg-neutral-300">&nbsp;</div>
  </div>;;
  }

  // Check if there was an error loading the plastics data
  if (plastics.status === "failed") {
    return <div>{`ERROR: ${plastics.error}`}</div>;
  }

  // Get the records from the plastics object
  const { records } = plastics;

  // Filter the records to only include those where the CompanyID is in the selectedPartners list,
  // and the FacilityID is in the selectedFacilities list,
  // and the PartnerFacilityID is in the selectedPartnerFacilities list

  
  const filteredRecords = records.filter((record: RecyclingRecord) => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(partnerFacility => partnerFacility.facilityID === record.PartnerFacilityID);
    return partnerMatch && facilityMatch && partnerFacilityMatch;
  });


  // Calculate summaries based on the filtered records
  // console.log(filteredRecords)

  const summaries = calculateMixedPlasticSummaries(filteredRecords);


  // Calculate the total quantity of all items in the summaries array
  const totalQuantity = summaries.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  //console.log(totalQuantity)

 // Filter the summaries to only include items that are in the selectedPlastics list
  // and have a quantity greater than 0
  const selectedData = summaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0 && item.label !== 'MixedPlastic',
  );

  // Filter the summaries to only include items that are in the selectedPlastics list
  // and have a quantity greater than 0
  const clickySummaries = summaries.filter(
    (item) => item.quantity > 0 && item.label !== 'MixedPlastic'
  );

  // Calculate the total quantity of the selected items
  const totalSelectedQuantity = selectedData.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  // Sort the selectedData by quantity in descending order
  const sortedSelectedData = [...selectedData].sort((a, b) => b.quantity - a.quantity);

  // Sort the clickySummaries by quantity in descending order
  const sortedClickySummaries = [...clickySummaries].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-3 overflow-hidden h-full">
      {/* <DashboardDisplayHeader
        headerText="Mixed Plastic Footprint"
      /> */}
        <div className="flex-grow flex gap-1 h-[128px]">
          {sortedSelectedData.map((item, index) => {
            const totalWidthPercentage =
              (item.quantity / totalSelectedQuantity) * 100;
            const rates = calculateItemRatios(item);
            const recycleRate = rates.get('recycleRate');
            const recyclingLossRate = rates.get('recyclingLossRate');
            const processingLossRate = rates.get('processingLossRate');
            const recyclingLossQuantity = rates.get('recyclingLossQuantity');
            const processingLoss = rates.get('processingLoss');

            return (
              <div
               key={index}
               className="relative flex flex-col items-center min-w-[40px] w-full text-white font-regular"
               style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
             >
            <div
                 className={`flex-grow flex-col items-end justify-left w-full min-h-[24px] rounded-sm ${
                  selectedPlastics.includes(item.label)
                    ? MAPPING_LIGHT[item.label]
                    : "bg-neutral-300" }`}
                style={{
                  height: `${processingLossRate.toFixed(1)}%`,
                  transition: "height 200ms ease, background-color 200ms ease",
                }}
              >
                <div className="p-2 flex flex-col justify-between overflow-hidden sm:flex-row">
                {item.label} 
                </div>
              </div>
            </div>
           );
         })}
       </div>
       <div className="flex gap-1 overflow-hidden ">
         {sortedClickySummaries.map((item, index) => {
           const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
           return (
             <div
               key={index}
               className={`flex items-end justify-left min-w-[40px] text-white rounded-sm text-sm font-regular cursor-pointer ${
                 selectedPlastics.includes(item.label)
                   ? MAPPING_LIGHT[item.label]
                   : "bg-neutral-300"
               }`}
               onClick={() => {
                 const newSelectedPlastics = selectedPlastics.includes(item.label)
                   ? selectedPlastics.filter((plastic) => plastic !== item.label)
                   : [...selectedPlastics, item.label];
                 dispatch(setToItems(newSelectedPlastics));
               }}
               style={{
                 width: `${(item.quantity / totalSelectedQuantity) * 100}%`,
                 transition: "background-color 200ms ease",
               }}
             >
               <div className="p-2 w-0 ">{item.label} {footprintPercentage.toFixed(1)}%</div>
             </div>
           );
         })}
       </div>
     </div>
   </div>
);
};


export default MixedPlasticFootprintSimple;
