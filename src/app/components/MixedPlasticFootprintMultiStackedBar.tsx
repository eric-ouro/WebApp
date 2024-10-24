"use client";
import React, { useState } from "react";
import { MAPPING_DARK, MAPPING_LIGHT } from "../common/colors";
import { Plastic, RecyclingRecord } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToItems } from "../store/selectedPlasticsSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateSummaries } from "../utils/calculateSummaries";
import { calculateItemRatios } from "../utils/calculateItemRatios";
import { calculateMixedPlasticSummaries } from "../utils/calculateSummaries";

// Define the SortKey type excluding 'label'
type SortKey = 'percentage' | 'quantity' | 'recycled' | 'recyclingLossRate' | 'processingLossRate';

const MixedPlasticFootprintMultiStackedBar = () => {
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

  // **Moved useState hook here**
  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: 'percentage', direction: 'descending' });

  // Check if the plastics data is still loading
  if (plastics.status === "loading") {
    return <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mr-6 h-[214px]">
        <div className="h4 w-[180px] rounded-full bg-neutral-300">&nbsp;</div>
      </div>;
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

  const summaries = calculateMixedPlasticSummaries(filteredRecords);

  const filteredSummaries = summaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0 && item.label !== 'MixedPlastic',
  );

  // Sort summaries by recycling rate in descending order
  filteredSummaries.sort((a, b) => b.percentage - a.percentage);

  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortKey) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? 'text-black' : 'text-neutral-400';
  };

  // Calculate the total quantity of selected plastics
  const totalQuantity = filteredSummaries.reduce((sum, item) => sum + item.quantity, 0);

  // Identify the largest footprint percentage
  const largestFootprintPercentage = Math.max(...filteredSummaries.map(item => (item.quantity / totalQuantity) * 100));

  return (
    <div className="dashcomponent">
      {/* <DashboardDisplayHeader
      headerText="Mixed Plastic Footprint & Recycle Rates"
      /> */}
      <div className="overflow-x-auto m-4">
        <table className="min-w-full table-auto">
          <thead className="cursor-pointer text-xs text-right ">
            <tr className="">
              <th className="text-neutral-400 text-xs text-left min-w-[80px] font-normal ">Plastic</th>
              <th onClick={() => requestSort('percentage')} className={` text-left min-w-[60px] font-normal ${getHeaderClass('percentage')}`}>Footprint</th>
              <th  className={` min-w-[60px] font-normal ${getHeaderClass('percentage')}`}> </th>
              <th  className={`text-left font-normal ${getHeaderClass('percentage')}`}> </th>
              <th onClick={() => requestSort('recycled')} className={`  min-w-[60px] font-normal ${getHeaderClass('recycled')}`}>Recycled</th>
              <th onClick={() => requestSort('recyclingLossRate')} className={` min-w-[60px] font-normal ${getHeaderClass('recyclingLossRate')}`}>R Loss</th>
              <th onClick={() => requestSort('processingLossRate')} className={` min-w-[60px] font-normal ${getHeaderClass('processingLossRate')}`}>P Loss</th>
            </tr>
          </thead>
          <tbody>
            {sortedSummaries.map((item, index) => {
              const rates = calculateItemRatios(item);
              const recycleRate = rates.get('recycleRate');
              const recyclingLossRate = rates.get('recyclingLossRate');
              const processingLossRate = rates.get('processingLossRate');
              const minWidth = item.quantity > 0 ? '10%' : '0';
              const footprintPercentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
              const normalizedWidth = (footprintPercentage / largestFootprintPercentage) * 100;
              const displayLabel = item.label === 'MixedPlastic' ? 'Mixed' : item.label;

              return (
                <tr className="align-middle h-[44px]" key={index}>
                    <td>
                  <span className="flex items-center ">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${MAPPING_LIGHT[item.label]}`}
                    ></span>
                    {displayLabel}
                  </span>
                  </td>
                  <td className=" max-w-[60px]">{footprintPercentage.toFixed(1).padStart(4, '0')}%</td>
                  <td className="text-left max-w-[60px] text-neutral-400">{item.quantity.toFixed(1).padStart(4, '0')}Tn</td>
                  
                  
                  <td className="w-[100%] px-[10px]">
                    <div
                      className="h-[34px]  text-left overflow-hidden rounded-sm  flex ]"
                      style={{ width: `${Math.max(normalizedWidth, 10)}%`, minWidth }}
                    >
                      <div
                        className={`h-full flex items-center justify-start ${MAPPING_LIGHT[item.label]}`}
                        style={{ width: `${Math.max(recycleRate, 10)}%`, minWidth }}
                      >
                        <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.38-3.36L23 10M1 14l5.09 5.09A9 9 0 0020.49 15" /></svg> */}
                          {/* <span>{recycleRate.toFixed(1)}%</span> */}
                        </div>
                      </div>
                      <div
                        className={`h-full flex items-center justify-start  ${MAPPING_DARK[item.label]}`}
                        style={{ width: `${Math.max(recyclingLossRate, 10)}%`, minWidth }}
                      >
                        <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg> */}
                          {/* <span>{recyclingLossRate.toFixed(1)}%</span> */}
                        </div>
                      </div>  
                      <div
                        className={`h-full flex items-center justify-start  bg-neutral-500`}
                        style={{ width: `${Math.max(processingLossRate, 10)}%`, minWidth }}
                      >
                        <div className="text-white text-xs ml-1 opacity-60 flex items-center">
                          {/* <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M1 6h22" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg> */}
                          {/* <span>{processingLossRate.toFixed(1)}%</span> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className=" text-right max-w-[60px]">{recycleRate.toFixed(1)}%</td>
                  <td className=" text-right max-w-[60px]">{recyclingLossRate.toFixed(1)}%</td>
                  <td className=" text-right max-w-[60px]">{processingLossRate.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MixedPlasticFootprintMultiStackedBar;
