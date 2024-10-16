"use client";
import React, { useState } from "react";
import { COLORS_LIGHT } from "../common/colors";
import { RecyclingRecord } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import  setToFacility from "../store/selectedFacilitiesSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";

// Define the SortKey type
type SortKey = 'recycled' | 'quantity';

const FacilityFootprintSimple = () => {
  
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({ key: 'recycled', direction: 'descending' });

  if (plastics.status === "loading") {
    return <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mt-4 h-[114px]">
        <div className="h4 w-[180px] rounded-full bg-neutral-300">&nbsp;</div>
      </div>;
  }

  if (plastics.status === "failed") {
    return <div>{`ERROR: ${plastics.error}`}</div>;
  }

  const { records } = plastics;

  const filteredRecords = records.filter((record: RecyclingRecord) => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    return partnerMatch && facilityMatch;
  });

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getHeaderClass = (key: SortKey) => {
    return sortConfig.key === key ? 'text-black' : 'text-neutral-400';
  };

  const totalQuantity = filteredRecords.reduce((sum, record) => {
    const recordTotalQuantity = Object.values(record.RecyclingData).reduce((acc, data) => acc + data.Quantity, 0);
    return sum + recordTotalQuantity;
  }, 0);

  const sortedFacilities = [...selectedFacilities].map((facility, index) => {
    const facilityRecords = filteredRecords.filter(record => record.FacilityID === facility.facilityID);
    const facilityTotalQuantity = facilityRecords.reduce((sum, record) => {
      const recordTotalQuantity = Object.values(record.RecyclingData).reduce((acc, data) => acc + data.Quantity, 0);
      return sum + recordTotalQuantity;
    }, 0);
    const recycleRate = facilityTotalQuantity > 0 ? (facilityRecords.reduce((sum, record) => sum + Object.values(record.RecyclingData).reduce((acc, data) => acc + data.Recycled, 0), 0) / facilityTotalQuantity) * 100 : 0;

    return {
      ...facility,
      facilityTotalQuantity,
      recycleRate,
      color: COLORS_LIGHT[index % Object.keys(COLORS_LIGHT).length], // Assign color based on index
    };
  }).sort((a, b) => {
    switch (sortConfig.key) {
      case 'quantity':
        return sortConfig.direction === 'ascending' ? a.facilityTotalQuantity - b.facilityTotalQuantity : b.facilityTotalQuantity - a.facilityTotalQuantity;
      case 'recycled':
        return sortConfig.direction === 'ascending' ? a.recycleRate - b.recycleRate : b.recycleRate - a.recycleRate;
      default:
        return 0;
    }
  });

  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader
            headerText="Facility Breakdown"
          />
      <div className="flex mb-4 gap-1 rounded overflow-hidden min-h[70px]">
        {sortedFacilities.map((facility, index) => {
          const isSelected = selectedFacilities.some(f => f.facilityID === facility.facilityID);
          
          return (
            <div
              key={index}
              className={`flex items-end justify-left h-full min-w-[50px] text-white rounded-sm text-sm font-regular cursor-pointer ${
                isSelected 
                ? facility.color 
                : "bg-neutral-300"
              }`}
              onClick={() => {
                const newSelectedFacilities = isSelected
                  ? selectedFacilities.filter((f) => f.facilityID !== facility.facilityID)
                  : [...selectedFacilities, facility];
                dispatch(setToFacility(newSelectedFacilities));
              }}
              style={{
                width: `${facility.recycleRate}%`,
                transition: "background-color 200ms ease",
              }}
            >
              <div className="p-2  h-28">
                {facility.facilityName}
                <div>
                {facility.recycleRate.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto">
          <thead className="cursor-pointer text-xs text-right ">
            <tr className="h-12">
              <th className="text-neutral-400 text-xs text-left min-w-[100px] w-full font-normal">Facility</th>
              <th onClick={() => requestSort('recycled')} className={`min-w-[100px] font-normal ${getHeaderClass('recycled')}`}>Coverage</th>
              <th onClick={() => requestSort('recycled')} className={`min-w-[100px] font-normal ${getHeaderClass('recycled')}`}>Recycle Rate</th>
              <th onClick={() => requestSort('quantity')} className={`min-w-[100px] font-normal ${getHeaderClass('quantity')}`}>Tonnage</th>
            </tr>
          </thead>
          <tbody>
            {sortedFacilities.map((facility) => (
              <tr className="align-middle h-8 text-right" key={facility.facilityID}>
                <td>
                  <span className="flex items-center text-left">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${facility.color}`}></span>
                    {facility.facilityName}, {facility.city}
                  </span>
                </td>
                <td className="max-w-[60px]">--%</td>
                <td className="max-w-[60px]">{facility.recycleRate.toFixed(1)}%</td>
                <td className="max-w-[60px]">{facility.facilityTotalQuantity.toFixed(1)}&nbsp;Tn</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityFootprintSimple;