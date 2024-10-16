"use client";
import React, { useState } from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "../common/colors";
import { COLORS_PARTNERS_LIGHTER } from "../common/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { togglePartner } from "../store/selectedPartnersSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateItemRatios } from "../utils/calculateItemRatios";
import { calculateSummaries } from "../utils/calculateSummaries";
import { PartnersRecord, RecyclingRecord } from '../common/types';

type SortKey = 'percentage' | 'quantity' | 'recycled' | 'recyclingLossRate' | 'processingLossRate';

const PartnerFootprint = () => {
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();
  console.log(selectedPartners);



  const [sortConfig, setSortConfig] = useState({ key: 'percentage', direction: 'descending' });

  if (plastics.status === "loading") {
    return <LoadingComponent />;
  }

  if (plastics.status === "failed") {
    return <ErrorComponent error={plastics.error ?? "Unknown error"} />;
  }

  const { records } = plastics;
  const filteredRecords = filterRecords(records, selectedPartners, selectedPartnerFacilities);

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const totalCoverage = calculateTotalCoverage(selectedPartners, filteredRecords);
  const globalCoverage = calculateTotalCoverage(validPartners, records);

  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates Per Partner" />
      <CoverageBar partners={selectedPartners} filteredRecords={filteredRecords} totalCoverage={totalCoverage} clickable dispatch={dispatch} />
      <CoverageBar partners={validPartners} filteredRecords={records} selectedPartners={selectedPartners} totalCoverage={globalCoverage} clickable dispatch={dispatch} isValidPartners />
      {selectedPartners.map(partner => (
        <PartnerDetails
          key={partner.CompanyID}
          partner={partner}
          filteredRecords={filteredRecords}
          selectedPlastics={selectedPlastics}
          sortConfig={sortConfig}
          requestSort={requestSort}
          totalCoverage={totalCoverage}
          
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

const filterRecords = (records: RecyclingRecord[], selectedPartners: any[], selectedPartnerFacilities: any[]) => {
  return records.filter(record => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(facility => facility.facilityID === record.PartnerFacilityID);
    return partnerMatch && partnerFacilityMatch;
  });
};

const calculateTotalCoverage = (partners: any[], records: RecyclingRecord[]) => {
  return partners.reduce((sum, partner) => {
    const partnerRecords = records.filter(record => record.PartnerCompanyID === partner.CompanyID);
    const partnerSummaries = calculateSummaries(partnerRecords);
    return sum + partnerSummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  }, 0);
};
const CoverageBar = ({ partners, selectedPartners, filteredRecords, totalCoverage, clickable = false, dispatch, isValidPartners = false }: any) => (
  <div className={`flex gap-1 mb-2 ${clickable ? 'overflow-hidden' : 'rounded overflow-hidden min-h-[70px]'}`}>
    {partners.map((partner: { CompanyID: string, CompanyName: string }, index: number) => {
      const partnerRecords = filteredRecords.filter((record: { PartnerCompanyID: string }) => record.PartnerCompanyID === partner.CompanyID);
      const partnerSummaries = calculateSummaries(partnerRecords);
      const partnerCoverage = partnerSummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
      const coveragePercentage = (partnerCoverage / totalCoverage) * 100;

      // Debugging: Log the selectedPartners and partner.CompanyID
      console.log('Selected Partners:', selectedPartners);
      console.log('Current Partner CompanyID:', partner.CompanyID);

      // This line checks if the current partner is in the list of selected partners.
      // It uses the `some` method to see if any partner in `selectedPartners` has the same `CompanyID` as the current partner.
      // If `selectedPartners` is undefined or null, it defaults to `false`.
      const isSelected = selectedPartners?.some((p: { CompanyID: string }) => p.CompanyID === partner.CompanyID) ?? false;
      const displayLabel = partner.CompanyName === 'Mixed' ? 'MIXED' : partner.CompanyName;

      console.log('Is Selected:', isSelected);

      return (
        <div
          key={index}
          className={`flex h-20 items-end justify-left min-w-[50px] text-white rounded-sm text-sm font-regular ${clickable ? 'cursor-pointer' : ''} ${
            isValidPartners ? ` h-2 ${isSelected ? 'bg-neutral-500' : 'bg-neutral-300'}` : 'bg-black'
          }`}
          onClick={clickable ? () => dispatch(togglePartner(partner as unknown as PartnersRecord)) : undefined}
          style={{
            width: `${coveragePercentage}%`,
            transition: "background-color 200ms ease",
          }}
        >
          <div className={`p-2 w-0  ${isValidPartners ? 'hidden' : ''}`}>   
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

const PartnerDetails = ({ partner, filteredRecords, selectedPlastics, sortConfig, requestSort, totalCoverage }: any) => {
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
        <table className="min-w-full bg-white table-auto">
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
              <SummaryRow key={index} item={item} totalQuantity={totalQuantity} largestFootprintPercentage={largestFootprintPercentage} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryRow = ({ item, totalQuantity, largestFootprintPercentage }: any) => {
  const displayLabel = item.label === 'MixedPlastic' ? 'MIXED' : item.label;
  const rates = calculateItemRatios(item);
  const recycleRate = rates.get('recycleRate');
  const recyclingLossRate = rates.get('recyclingLossRate');
  const processingLossRate = rates.get('processingLossRate');
  const minWidth = item.quantity > 0 ? '10%' : '0';
  const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
  const normalizedWidth = (item.quantity / largestFootprintPercentage);

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

const getHeaderClass = (key: SortKey, sortConfig: any) => {
  return sortConfig.key === key ? 'text-black' : 'text-neutral-400';
};

const calculateStatistics = (summaries: ReturnType<typeof calculateSummaries>) => {
  const totalQuantity = summaries.reduce((sum, item) => sum + item.quantity, 0);
  const largestFootprintPercentage = summaries.reduce((max, item) => item.quantity > max.quantity ? item : max, summaries[0]);
  return { totalQuantity, largestFootprintPercentage };
};

export default PartnerFootprint;
