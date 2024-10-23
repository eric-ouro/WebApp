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

const PartnerFootprint = () => {
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();


  const [sortConfig, setSortConfig] = useState({ key: 'percentage', direction: 'descending' });

  if (plastics.status === "loading") {
    return <LoadingComponent />;
  }

  if (plastics.status === "failed") {
    return <ErrorComponent error={plastics.error ?? "Unknown error"} />;
  }

  const { records } = plastics;
  const filteredRecords = filterRecords(records, selectedPartners, selectedPartnerFacilities, selectedFacilities);

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };
  const largestQuantity = selectedPartners.reduce((max, partner) => {
    const partnerRecords = filteredRecords.filter(record => record.PartnerCompanyID === partner.CompanyID);
    const partnerSummaries = calculateSummaries(partnerRecords);
    const partnerMaxQuantity = partnerSummaries.reduce((maxQuantity, summary) => {
      return summary.quantity > maxQuantity ? summary.quantity : maxQuantity;
    }, 0);
    return partnerMaxQuantity > max ? partnerMaxQuantity : max;
  }, 0);


  const totalCoverage = calculateTotalCoverage(selectedPartners, filteredRecords);
  const globalCoverage = calculateTotalCoverage(validPartners, records);

  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates Per Partner" />
      <CoverageBar partners={validPartners} filteredRecords={filteredRecords} totalCoverage={totalCoverage} clickable dispatch={dispatch} />
      <CoverageBar partners={validPartners} filteredRecords={records} selectedPartners={selectedPartners} totalCoverage={globalCoverage} clickable dispatch={dispatch} isBottom />
      {selectedPartners.map(partner => (
        <PartnerDetails
          key={partner.CompanyID}
          partner={partner}
          filteredRecords={filteredRecords}
          selectedPlastics={selectedPlastics}
          sortConfig={sortConfig}
          requestSort={requestSort}
          totalCoverage={totalCoverage}
          largestQuantity={largestQuantity}
        />
      ))}
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
  <div className={`flex gap-1 mb-2 ${clickable ? 'overflow-hidden' : 'rounded overflow-hidden min-h-[70px]'}`}>
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
          className={`flex items-end justify-left min-w-[50px] text-white rounded-sm text-sm font-regular  ${clickable ? 'cursor-pointer' : ''} ${
            coveragePercentage === 0 ? 'hidden' :
            isBottom ? ` h-4 ${isSelected ? COLORS_PARTNER[partner.CompanyID] : COLORS_PARTNERS_LIGHTER[partner.CompanyID]}` : COLORS_PARTNER[partner.CompanyID]
            
          }`}
          onClick={clickable ? () => dispatch(togglePartner(partner as unknown as PartnersRecord)) : undefined}
          style={{
            width: `${coveragePercentage}%`,
            transition: "background-color 200ms ease",
          }}
        >
          <div className={`p-2 w-0  ${isBottom ? 'hidden' : ''}`}>   
            {displayLabel}
            <div>
              {coveragePercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const PartnerDetails = ({ partner, filteredRecords, selectedPlastics, sortConfig, requestSort, totalCoverage, largestQuantity }: any) => {
  const partnerRecords = filteredRecords.filter((record: { PartnerCompanyID: string }) => record.PartnerCompanyID === partner.CompanyID);
  const partnerSummaries = calculateSummaries(partnerRecords);
  const partnerCoverage = partnerSummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  const coveragePercentage = (partnerCoverage / totalCoverage) * 100;
  const filteredSummaries = partnerSummaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0
  );
  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const { totalQuantity, largestFootprintPercentage } = calculateStatistics(filteredSummaries);

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center mb-2">
        <h3 className="mr-4">{partner.CompanyName}</h3>
        <div className="flex-grow border-t border-neutral-200 mx-4" style={{ height: '1px' }}></div>
        <h3 className="ml-4">{coveragePercentage.toFixed(1)}%</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="cursor-pointer text-xs text-right">
            <tr className="h-12">
              <th className="text-neutral-400 text-xs text-left min-w-[80px] font-normal">Plastic</th>
              <th onClick={() => requestSort('percentage')} className={`text-left min-w-[60px] font-normal ${getHeaderClass('percentage', sortConfig)}`}>Footprint</th>
              <th className={`min-w-[80px] font-normal ${getHeaderClass('percentage', sortConfig)}`}></th>
              <th className={`text-left font-normal ${getHeaderClass('percentage', sortConfig)}`}></th>
              <th onClick={() => requestSort('recycled')} className={`min-w-[60px] font-normal ${getHeaderClass('recycled', sortConfig)}`}>Recycled</th>
              <th onClick={() => requestSort('recyclingLossRate')} className={`min-w-[60px] font-normal ${getHeaderClass('recyclingLossRate', sortConfig)}`}>R Loss</th>
              <th onClick={() => requestSort('processingLossRate')} className={`min-w-[60px] font-normal ${getHeaderClass('processingLossRate', sortConfig)}`}>P Loss</th>
            </tr>
          </thead>
          <tbody>
            {sortedSummaries.map((item, index) => (
              <SummaryRow key={index} item={item} totalQuantity={totalQuantity} largestFootprintPercentage={largestFootprintPercentage} largestQuantity={largestQuantity} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryRow = ({ item, totalQuantity, largestQuantity}: any) => {
  const displayLabel = item.label === 'MixedPlastic' ? 'MIXED' : item.label;
  const rates = calculateItemRatios(item);
  const recycleRate = rates.get('recycleRate');
  const recyclingLossRate = rates.get('recyclingLossRate');
  const processingLossRate = rates.get('processingLossRate');
  const minWidth = item.quantity > 0 ? '10%' : '0';
  const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
  const normalizedWidth = (item.quantity / largestQuantity);
  // const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
  // const normalizedWidth = (footprintPercentage / largestFootprintPercentage) * 100;

  return (
    <tr className="align-middle text-right h-[44px]">
      <td>
        <span className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${MAPPING_LIGHT[item.label]}`}></span>
          {displayLabel}
        </span>
      </td>
      <td className="text-left max-w-[60px]">{footprintPercentage.toFixed(1)}%</td>
      <td className="text-right w-[80px]">{item.quantity.toFixed(1)}&nbsp;Tn</td>
      <td className="w-[100%] px-[20px]">
        <div
          className="h-[34px] text-left overflow-hidden rounded-sm flex"
          style={{ width: `${Math.max(normalizedWidth * 100, 10)}%`, minWidth }}
        >
          <div
            className={`h-full text-left flex items-center justify-start ${MAPPING_LIGHT[item.label]}`}
            style={{ width: `${Math.max(recycleRate, 10)}%`, minWidth }}
          >
            <div className="text-white text-xs ml-1 opacity-60 flex items-center"></div>
          </div>
          <div
            className={`h-full flex items-center justify-start ${MAPPING_DARK[item.label]}`}
            style={{ width: `${Math.max(recyclingLossRate, 10)}%`, minWidth }}
          >
            <div className="text-white text-xs ml-1 opacity-60 flex items-center"></div>
          </div>
          <div
            className={`h-full flex items-center justify-start bg-neutral-500`}
            style={{ width: `${Math.max(processingLossRate, 10)}%`, minWidth }}
          >
            <div className="text-white text-xs ml-1 opacity-60 flex items-center"></div>
          </div>
        </div>
      </td>
      <td className="max-w-[60px]">{recycleRate.toFixed(1)}%</td>
      <td className="max-w-[60px]">{recyclingLossRate.toFixed(1)}%</td>
      <td className="max-w-[60px]">{processingLossRate.toFixed(1)}%</td>
    </tr>
  );
};


// HELPER FUNCTIONS
const getHeaderClass = (key: SortKey, sortConfig: any) => {
  return sortConfig.key === key ? 'text-black' : 'text-neutral-400';
};

const calculateStatistics = (summaries: ReturnType<typeof calculateSummaries>) => {
  const totalQuantity = summaries.reduce((sum, item) => sum + item.quantity, 0);
  const largestFootprintPercentage = summaries.reduce((max, item) => item.quantity > max.quantity ? item : max, summaries[0]);
  return { totalQuantity, largestFootprintPercentage };
};

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

export default PartnerFootprint;
