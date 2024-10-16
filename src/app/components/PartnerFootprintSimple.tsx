"use client";
import React, { useState } from "react";
import { COLORS_PARTNERS_LIGHTER } from "../common/colors";
import { Plastic, RecyclingRecord } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToPartner } from "../store/selectedPartnersSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateItemRatios } from "./PlasticFootprint";

// Define the SortKey type excluding 'label'
type SortKey = 'percentage' | 'quantity' | 'recycled' | 'recyclingLossRate'  | 'processingLossRate' | 'coverage';

const PartnerFootprintSimple = () => {
  
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({ key: 'percentage', direction: 'descending' });

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
    const partnerFacilityMatch = selectedPartnerFacilities.some(partnerFacility => partnerFacility.facilityID === record.PartnerFacilityID);
    return partnerMatch && facilityMatch && partnerFacilityMatch;
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

  const calculateStatistics = (summaries: ReturnType<typeof calculateSummaries>) => {
    const totalQuantity = summaries.reduce((sum, item) => sum + item.quantity, 0);
    const largestFootprintPercentage = Math.max(...summaries.map(item => (item.quantity / totalQuantity) * 100), 0);
    return { totalQuantity, largestFootprintPercentage };
  };

  const calculateCoverage = (partnerQuantity: number, totalQuantity: number) => {
    return totalQuantity > 0 ? (partnerQuantity / totalQuantity) * 100 : 0;
  };

  const totalQuantity = filteredRecords.reduce((sum, record) => {
    const recordTotalQuantity = Object.values(record.RecyclingData).reduce((acc, data) => acc + data.Quantity, 0);
    // console.log(`Record Total Quantity for Partner ${record.PartnerCompanyID}:`, recordTotalQuantity);
    return sum + recordTotalQuantity;
  }, 0);

  // console.log("Total Quantity:", totalQuantity);

  const sortedPartners = [...selectedPartners].map((partner, index) => {
    const partnerRecords = filteredRecords.filter(record => record.PartnerCompanyID === partner.CompanyID);
    const partnerTotalQuantity = partnerRecords.reduce((sum, record) => {
      const recordTotalQuantity = Object.values(record.RecyclingData).reduce((acc, data) => acc + data.Quantity, 0);
      return sum + recordTotalQuantity;
    }, 0);
    const partnerSummaries = calculateSummaries(partnerRecords);
    
    const rates = calculateItemRatios(partnerSummaries);
    
    const recyclingLossRate = rates.get('recyclingLossRate');
    const processingLossRate = rates.get('processingLossRate');
    const recyclingLossQuantity = rates.get('recyclingLossQuantity');
    const processingLoss = rates.get('processingLoss');

    const recycleRate = partnerTotalQuantity > 0 ? (partnerSummaries.reduce((sum, item) => sum + item.recycled, 0) / partnerTotalQuantity) * 100 : 0;
    const wasteRate = partnerTotalQuantity > 0 ? 100 - recycleRate : 0;
    const coverage = calculateCoverage(partnerTotalQuantity, totalQuantity);

    // console.log(`Partner: ${partner.CompanyName}, Partner Total Quantity: ${partnerTotalQuantity}, Coverage: ${coverage}`);

    return {
      ...partner,
      partnerTotalQuantity,
      recycleRate,
      wasteRate,
      coverage,
      color: COLORS_PARTNERS_LIGHTER[index % Object.keys(COLORS_PARTNERS_LIGHTER).length], // Assign color based on index
    };
  }).sort((a, b) => {
    switch (sortConfig.key) {
      case 'quantity':
        return sortConfig.direction === 'ascending' ? a.partnerTotalQuantity - b.partnerTotalQuantity : b.partnerTotalQuantity - a.partnerTotalQuantity;
      case 'recycled':
        return sortConfig.direction === 'ascending' ? a.recycleRate - b.recycleRate : b.recycleRate - a.recycleRate;
      case 'processingLossRate':
        return sortConfig.direction === 'ascending' ? a.processingLossRate - b.processingLossRate : b.processingLossRate - a.processingLossRate;
      case 'recyclingLossRate':
        return sortConfig.direction === 'ascending' ? a.recyclingLossRate - b.recyclingLossRate : b.recyclingLossRate - a.recyclingLossRate;
      case 'coverage':
        return sortConfig.direction === 'ascending' ? a.coverage - b.coverage : b.coverage - a.coverage;
      default:
        return 0;
    }
  });

  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader
            headerText="Partner Breakdown"
          />
      <div className="flex  gap-1 rounded overflow-hidden min-h[70px]">
        {sortedPartners.map((partner, index) => {
          // Check if the current partner is in the list of selected partners
          const isSelected = selectedPartners.some(p => p.CompanyID === partner.CompanyID);
          const coveragePercentage = partner.coverage.toFixed(1);
          const displayLabel = partner.CompanyName === 'Mixed' ? 'MIXED' : partner.CompanyName;
          
          return (
            <div
              key={index}
              className={`flex items-end justify-left h-full min-w-[50px] text-white rounded-sm text-sm font-regular cursor-pointer ${
                isSelected 
                ? partner.color 
                : "bg-neutral-300"
              }`}
              onClick={() => {
                const newSelectedPartners = isSelected
                  ? selectedPartners.filter((p) => p.CompanyID !== partner.CompanyID)
                  : [...selectedPartners, partner];
                dispatch(setToPartner(newSelectedPartners));
              }}
              style={{
                width: `${coveragePercentage}%`,
                transition: "background-color 200ms ease",
              }}
            >
              <div className="p-2 w-0 h-28">
                {partner.CompanyName}
                
                <div>
                  {coveragePercentage}%
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
              <th className="text-neutral-400 text-xs text-left min-w-[80px] w-full font-normal">Partner</th>
              <th onClick={() => requestSort('recycled')} className={`min-w-[100px] font-normal ${getHeaderClass('recycled')}`}>Recycle Rate</th>
              <th onClick={() => requestSort('recyclingLossRate')} className={`min-w-[100px] font-normal ${getHeaderClass('recyclingLossRate')}`}>Recycling Loss Rate</th>
              <th onClick={() => requestSort('processingLossRate')} className={`min-w-[100px] font-normal ${getHeaderClass('processingLossRate')}`}>Processing Loss Rate</th>
              <th onClick={() => requestSort('coverage')} className={`min-w-[100px] font-normal ${getHeaderClass('coverage')}`}>Coverage</th>
              <th onClick={() => requestSort('quantity')} className={`min-w-[100px] font-normal ${getHeaderClass('quantity')}`}>Tonnage</th>
            </tr>
          </thead>
          <tbody>
            {sortedPartners.map((partner) => (
              <tr className="align-middle h-8 text-right" key={partner.CompanyID}>
                <td>
                  <span className="flex items-center ">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${partner.color}`}></span>
                    {partner.CompanyName}
                  </span>
                </td>
                <td className="max-w-[60px]">{partner.wasteRate.toFixed(1)}%</td>
                <td className="max-w-[60px]">{partner.recycleRate.toFixed(1)}%</td>
                <td className="max-w-[60px]">{partner.recyclingLossRate.toFixed(1)}%</td>
                <td className="max-w-[60px]">{partner.processingLossRate.toFixed(1)}%</td>
                <td className="max-w-[60px]">{partner.coverage.toFixed(1)}%</td>
                <td className="max-w-[60px]">{partner.partnerTotalQuantity.toFixed(1)}&nbsp;Tn</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const calculateSummaries = (records: RecyclingRecord[]) => {
  const summaries = {
    HDPE: { quantity: 0, recycled: 0 },
    PET: { quantity: 0, recycled: 0 },
    LDPE: { quantity: 0, recycled: 0 },
    PP: { quantity: 0, recycled: 0 },
    PS: { quantity: 0, recycled: 0 },
    PVC: { quantity: 0, recycled: 0 },
  };

  records.forEach((record) => {
    Object.entries(record.RecyclingData).forEach(([key, data]) => {
      if (key in summaries) {
        summaries[key as keyof typeof summaries].quantity += data.Quantity;
        summaries[key as keyof typeof summaries].recycled += data.Recycled;
      }
    });
  });

  return Object.entries(summaries).map(([label, data]) => ({
    label: label as Plastic,
    quantity: data.quantity,
    recycled: data.recycled,
    percentage: data.quantity > 0 ? (data.recycled / data.quantity) * 100 : 0,
  }));
};

export default PartnerFootprintSimple;