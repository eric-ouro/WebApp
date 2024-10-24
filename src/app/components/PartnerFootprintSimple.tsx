"use client";
import React, { useState } from "react";
import { MAPPING_DARK, MAPPING_LIGHT, COLORS_PARTNER, COLORS_PARTNERS_LIGHTER } from "../common/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { togglePartner } from "@/app/store/selectedPartnersSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateItemRatios } from "@/app/utils/calculateItemRatios";
import { calculateSummaries } from "@/app/utils/calculateSummaries";
import { PartnersRecord, RecyclingRecord } from '../common/types';

type SortKey = 'percentage' | 'quantity' | 'recycled' | 'recyclingLossRate' | 'processingLossRate';

const PartnerFootprintSimple = () => {
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
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

  

  const totalCoverage = calculateTotalCoverage(selectedPartners, filteredRecords);
  const globalCoverage = calculateTotalCoverage(validPartners, records);

  return (
    <div className="dashcomponent ">
    <div className="flex flex-col gap-3 h-full">
      {/* <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates / Partner" /> */}
      {/* <div className="flex-col flex-grow"> */}
      <CoverageBar partners={validPartners} filteredRecords={filteredRecords} totalCoverage={totalCoverage} clickable dispatch={dispatch} />
      <CoverageBar partners={validPartners} filteredRecords={records} selectedPartners={selectedPartners} totalCoverage={globalCoverage} clickable dispatch={dispatch} isBottom />
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

const CoverageBar = ({ partners, selectedPartners, filteredRecords, totalCoverage, clickable = false, dispatch, isBottom = false }: any) => (
    <div className={`flex  gap-1 
     ${clickable ? 'overflow-hidden' : 'rounded overflow-hidden min-h-[70px]'}` +
     `${isBottom ? 'h-[12px]' : 'h-full flex-grow'}`
     }
     >
      {partners.map((partner: { CompanyID: string, CompanyName: string }, index: number) => {
        const partnerRecords = filteredRecords.filter((record: { PartnerCompanyID: string }) => record.PartnerCompanyID === partner.CompanyID);
        const partnerSummaries = calculateSummaries(partnerRecords);
        const partnerCoverage = partnerSummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
        const coveragePercentage = (partnerCoverage / totalCoverage) * 100;

        const isSelected = selectedPartners?.some((p: { CompanyID: string }) => p.CompanyID === partner.CompanyID) ?? false;
        const displayLabel = partner.CompanyName === 'Mixed' ? 'MIXED' : partner.CompanyName;


        return (
          <div
            key={index}
            className={`flex justify-left min-w-[50px] text-white rounded-sm text-sm font-regular items-end justify-start ${clickable ? 'cursor-pointer' : ''} ${
              coveragePercentage === 0 ? 'hidden' :
              isBottom ? ` h-4  ${isSelected ? COLORS_PARTNER[partner.CompanyID] : COLORS_PARTNERS_LIGHTER[partner.CompanyID]}` : COLORS_PARTNER[partner.CompanyID]
              
            }`}
            onClick={clickable ? () => dispatch(togglePartner(partner as unknown as PartnersRecord)) : undefined}
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

const calculateTotalCoverage = (partners: any[], records: RecyclingRecord[]) => {
  return partners.reduce((sum, partner) => {
    const partnerRecords = records.filter(record => record.PartnerCompanyID === partner.CompanyID);
    const partnerSummaries = calculateSummaries(partnerRecords);
    return sum + partnerSummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  }, 0);
};

export default PartnerFootprintSimple;
