"use client";
import React from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "../common/colors";
import { Plastic, RecyclingRecord, MixedPlasticRecyclingData, RecyclingData } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToItems } from "../store/selectedPlasticsSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateSummaries } from "../utils/calculateSummaries";

const PlasticFootprintSimple = () => {
  const selectedPlastics = useSelector(
    (state: RootState) => state.selectedPlastics.selectedPlastics
  );
  const selectedPartners = useSelector(
    (state: RootState) => state.selectedPartners.selectedPartners
  );
  const selectedFacilities = useSelector(
    (state: RootState) => state.selectedFacilities.selectedFacilities
  );
  const selectedPartnerFacilities = useSelector(
    (state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities
  );

  const plastics = useSelector((state: RootState) => state.recyclingRecords);

  const dispatch = useDispatch();

  if (plastics.status === "loading") {
    return <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mr-6 h-[344px]">
    <div className="h4 w-[140px] rounded-full bg-neutral-300">&nbsp;</div>
  </div>;
  }

  if (plastics.status === "failed") {
    return <div>{`ERROR: ${plastics.error}`}</div>;
  }

  const { records } = plastics;

  const filteredRecords = records.filter((record: RecyclingRecord) => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(partnerFacility => partnerFacility.facilityID === record.PartnerFacilityID);
    return partnerMatch && facilityMatch && partnerFacilityMatch;
  });

  const summaries = calculateSummaries(filteredRecords);

  const totalQuantity = summaries.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const selectedData = summaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0,
  );

  const clickySummaries = summaries.filter(
    (item) => item.quantity > 0
  );

  const totalSelectedQuantity = selectedData.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const sortedSelectedData = [...selectedData].sort((a, b) => b.quantity - a.quantity);

  const sortedClickySummaries = [...clickySummaries].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="dashcomponent">
      <div className="flex flex-col gap-3 overflow-hidden h-full">
       {/* <DashboardDisplayHeader
       headerText="Plastic Footprint"
       /> */}
       <div className="flex-grow flex gap-1 h-[64px]">
          {sortedSelectedData.map((item, index) => {
            const totalWidthPercentage =
              (item.quantity / totalSelectedQuantity) * 100;
              const processingLossRate = item.percentage
            const displayLabel = item.label === 'MixedPlastic' ? 'MIXED' : item.label;
            return (
               <div
                key={index}
                className="relative flex flex-col justify-left  min-w-[40px] w-full text-white font-regular"
                style={{ width: `${totalWidthPercentage.toFixed(1)}%` }}
              >
                <div
                  className={`flex-grow flex-col w-full min-h-[24px] items-end rounded-sm ${
                    selectedPlastics.includes(item.label)
                      ? MAPPING_LIGHT[item.label]
                      : "bg-neutral-300" }`}
                  style={{
                    height: `${processingLossRate.toFixed(1)}%`,
                    transition: "height 200ms ease, background-color 200ms ease",
                  }}
                >
                  <div className="p-2 flex flex-col justify-between overflow-hidden sm:flex-row">
                    <div>
                    
                  {displayLabel} 
                
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 overflow-hidden">
          {sortedClickySummaries.map((item, index) => {
            const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
            const displayLabel = item.label === 'MixedPlastic' ? 'MIXED' : item.label;
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
                  width: `${footprintPercentage}%`,
                  transition: "background-color 200ms ease",
                }}
              >
                <div className="p-2 w-0 ">
                  {displayLabel} {footprintPercentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
);
};


export default PlasticFootprintSimple;