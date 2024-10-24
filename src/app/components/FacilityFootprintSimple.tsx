"use client";
import React, { useState } from "react";
import { COLORS_FACILITIES, COLORS_FACILITIES_LIGHTER } from "../common/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { toggleFacility } from "@/app/store/selectedFacilitiesSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateItemRatios } from "@/app/utils/calculateItemRatios";
import { calculateSummaries } from "@/app/utils/calculateSummaries";
import { FacilitiesRecord, RecyclingRecord } from '../common/types';


const FacilityFootprintSimple = () => {
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
  const validFacilities = useSelector((state: RootState) => state.validFacilities.Facilities);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();


  if (plastics.status === "loading") {
    return <LoadingComponent />;
  }

  if (plastics.status === "failed") {
    return <ErrorComponent error={plastics.error ?? "Unknown error"} />;
  }

  const { records } = plastics;
  const filteredRecords = filterRecords(records, selectedPartners, selectedPartnerFacilities, selectedFacilities);

  

  const totalCoverage = calculateTotalCoverage(selectedFacilities, filteredRecords);
  const globalCoverage = calculateTotalCoverage(validFacilities, records);

  return (
    <div className="dashcomponent ">
    <div className="flex flex-col gap-3 h-full">
      {/* <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates / Partner" /> */}
      {/* <div className="flex-col flex-grow"> */}
      <CoverageBar facilities={validFacilities} filteredRecords={filteredRecords} totalCoverage={totalCoverage} clickable dispatch={dispatch} />
      <CoverageBar facilities={validFacilities} filteredRecords={records} selectedFacilities={selectedFacilities} totalCoverage={globalCoverage} clickable dispatch={dispatch} isBottom />
      {/* </div> */}
    </div>
    </div>
  );
};



const LoadingComponent = () => (
  <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 h-[214px]">
    <div className="h4 w-[180px] rounded-full bg-neutral-300">&nbsp;</div>
  </div>
);

const ErrorComponent = ({ error }: { error: string }) => (
  <div>{`ERROR: ${error}`}</div>
);

const CoverageBar = ({ facilities, selectedFacilities, filteredRecords, totalCoverage, clickable = false, dispatch, isBottom = false }: any) => (
    <div className={`flex  gap-1 
     ${clickable ? 'overflow-hidden' : 'rounded overflow-hidden min-h-[70px]'}` +
     `${isBottom ? 'h-[12px]' : 'h-full flex-grow'}`
     }
     >
      {facilities.map((facility: { facilityID: string, facilityName: string }, index: number) => {
        const facilityRecords = filteredRecords.filter((record: { FacilityID: string }) => record.FacilityID === facility.facilityID);
        const facilitySummaries = calculateSummaries(facilityRecords);
        const facilityCoverage = facilitySummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
        const coveragePercentage = (facilityCoverage / totalCoverage) * 100;

        const isSelected = selectedFacilities?.some((f: { facilityID: string }) => f.facilityID === facility.facilityID) ?? false;
        const displayLabel = facility.facilityName === 'Mixed' ? 'MIXED' : facility.facilityName;


        return (
          <div
            key={index}
            className={`flex justify-left min-w-[50px] text-white rounded-sm text-sm font-regular items-end justify-start ${clickable ? 'cursor-pointer' : ''} ${
              coveragePercentage === 0 ? 'hidden' :
              isBottom ? ` h-4  ${isSelected ? COLORS_FACILITIES[facility.facilityID] : COLORS_FACILITIES_LIGHTER[facility.facilityID]}` : COLORS_FACILITIES[facility.facilityID]
              
            }`}
            onClick={clickable ? () => dispatch(toggleFacility(facility as unknown as FacilitiesRecord)) : undefined}
            style={{
              width: `${coveragePercentage}%`,
              transition: "background-color 200ms ease",
            }}
          >
            <div className={`p-2 w-0 flex-col ${isBottom ? 'hidden' : ''}`}>   
              <div>{displayLabel}</div>
              <div>
                {coveragePercentage.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
);

const filterRecords = (records: RecyclingRecord[], selectedPartners: any[], selectedPartnerFacilities: any[], selectedFacilities: any[]) => {
  return records.filter(record => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(facility => facility.facilityID === record.PartnerFacilityID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    return partnerMatch && partnerFacilityMatch && facilityMatch;
  });
};

const calculateTotalCoverage = (facilities: any[], records: RecyclingRecord[]) => {
  return facilities.reduce((sum, facility) => {
    const facilityRecords = records.filter(record => record.FacilityID === facility.facilityID);
    const facilitySummaries = calculateSummaries(facilityRecords);
    return sum + facilitySummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  }, 0);
};

export default FacilityFootprintSimple;
