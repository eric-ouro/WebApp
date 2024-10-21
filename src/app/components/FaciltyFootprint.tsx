"use client";
import React, { useState } from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "@/app/common/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { toggleFacility } from "@/app/store/selectedFacilitiesSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateItemRatios } from "@/app/utils/calculateItemRatios";
import { calculateSummaries } from "@/app/utils/calculateSummaries";
import { FacilitiesRecord, RecyclingRecord } from '@/app/common/types';

type SortKey = 'percentage' | 'quantity' | 'recycled' | 'recyclingLossRate' | 'processingLossRate';

const FacilityFootprint = () => {
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const validFacilities = useSelector((state: RootState) => state.validFacilities.Facilities);
  
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();
  // console.log(selectedFacilities);

  const [sortConfig, setSortConfig] = useState({ key: 'percentage', direction: 'descending' });

  if (plastics.status === "loading") {
    return <LoadingComponent />;
  }

  if (plastics.status === "failed") {
    return <ErrorComponent error={plastics.error ?? "Unknown error"} />;
  }

  const { records } = plastics;
  const filteredRecords = filterRecords(records, selectedFacilities );

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const totalCoverage = calculateTotalCoverage(selectedFacilities, filteredRecords);
  const globalCoverage = calculateTotalCoverage(validFacilities, records);

  const largestQuantity = selectedFacilities.reduce((max, facility) => {
    const facilityRecords = filteredRecords.filter(record => record.FacilityID === facility.facilityID);
    const facilitySummaries = calculateSummaries(facilityRecords);
    const facilityMaxQuantity = facilitySummaries.reduce((maxQuantity, summary) => {
      return summary.quantity > maxQuantity ? summary.quantity : maxQuantity;
    }, 0);
    return facilityMaxQuantity > max ? facilityMaxQuantity : max;
  }, 0);

  // console.log(largestQuantity)



  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader headerText="Plastic Footprint & Recycle Rates Per Facility" />
      <CoverageBar facilities={selectedFacilities} filteredRecords={filteredRecords} totalCoverage={totalCoverage} clickable dispatch={dispatch} />
      <CoverageBar facilities={validFacilities} filteredRecords={records} selectedFacilities={selectedFacilities} totalCoverage={globalCoverage} clickable dispatch={dispatch} isValidFacilities />
      {selectedFacilities.map(facility => (
        <FacilityDetails
          key={facility.facilityID}
          facility={facility}
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

const filterRecords = (records: RecyclingRecord[], selectedFacilities: any[]) => {
  return records.filter(record => {
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    return facilityMatch 
  });
};

const calculateTotalCoverage = (facilities: any[], records: RecyclingRecord[]) => {
  return facilities.reduce((sum, facility) => {
    const facilityRecords = records.filter(record => record.FacilityID === facility.facilityID);
    const facilitySummaries = calculateSummaries(facilityRecords);
    return sum + facilitySummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  }, 0);
};

const CoverageBar = ({ facilities, selectedFacilities, filteredRecords, totalCoverage, clickable = false, dispatch, isValidFacilities = false }: any) => (
  <div className={`flex gap-1 ${clickable ? 'mb-2 overflow-hidden' : 'rounded overflow-hidden min-h-[70px] mb-2'}`}>
    {facilities.map((facility: { facilityID: string, facilityName: string }, index: number) => {
      const facilityRecords = filteredRecords.filter((record: { FacilityID: string }) => record.FacilityID === facility.facilityID);
      const facilitySummaries = calculateSummaries(facilityRecords);
      const facilityCoverage = facilitySummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
      const coveragePercentage = (facilityCoverage / totalCoverage) * 100;
 
      const isSelected = selectedFacilities?.some((f: { facilityID: string }) => f.facilityID === facility.facilityID) ?? false;
      const displayLabel = facility.facilityName === 'Mixed' ? 'MIXED' : facility.facilityName;

      // console.log('Is Selected:', isSelected);

      return (
        <div
          key={index}
          className={`flex h-20 items-end justify-left min-w-[50px] text-white rounded-sm text-sm font-regular ${clickable ? 'cursor-pointer' : ''} ${
            isValidFacilities ? `h-4 ${isSelected ? 'bg-neutral-500' : 'bg-neutral-300'}` : 'bg-black'
          }`}
          onClick={clickable ? () => dispatch(toggleFacility(facility as unknown as FacilitiesRecord)) : undefined}
          style={{
            width: `${coveragePercentage}%`,
            transition: "background-color 200ms ease",
          }}
        >
          <div className={`p-2 w-0  ${isValidFacilities ? 'hidden' : ''}`}>  
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

const FacilityDetails = ({ facility, filteredRecords, selectedPlastics, sortConfig, requestSort, totalCoverage, largestQuantity }: any) => {
  const facilityRecords = filteredRecords.filter((record: { FacilityID: string }) => record.FacilityID === facility.facilityID);
  const facilitySummaries = calculateSummaries(facilityRecords);
  const facilityCoverage = facilitySummaries.reduce((coverage, summary) => coverage + summary.quantity, 0);
  const coveragePercentage = (facilityCoverage / totalCoverage) * 100;
  const filteredSummaries = facilitySummaries.filter(
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
        <h3 className="mr-4">{facility.facilityName}</h3>
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

const SummaryRow = ({ item, totalQuantity, largestQuantity }: any) => {
  const displayLabel = item.label === 'MixedPlastic' ? 'MIXED' : item.label;
  const rates = calculateItemRatios(item);
  const recycleRate = rates.get('recycleRate');
  const recyclingLossRate = rates.get('recyclingLossRate');
  const processingLossRate = rates.get('processingLossRate');
  const minWidth = item.quantity > 0 ? '10%' : '0';
  const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
  const normalizedWidth = (item.quantity / largestQuantity);

  return (
    <tr className="align-middle text-right h-[44px]">
      <td>
        <span className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${MAPPING_LIGHT[item.label]}`}></span>
          {displayLabel}
        </span>
      </td>
      <td className="text-left max-w-[60px]">{footprintPercentage.toFixed(1)}%</td>
      <td className="text-right min-w-[80px]">{item.quantity.toFixed(1)}&nbsp;Tn</td>
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

export default FacilityFootprint;
