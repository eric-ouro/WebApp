"use client";
import React, { useState } from "react";
import { COLORS_PARTNERS_EXPLICIT } from "../common/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToPartner } from "../store/selectedPartnersSlice";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { Plastic } from '../common/types';

const PartnerCoverage = () => {
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const plastics = useSelector((state: RootState) => state.recyclingRecords);
  const dispatch = useDispatch();

  if (plastics.status === "loading") {
    return (
      <div className="bg-neutral-100 rounded-lg border shadow-sm p-6 mr-6 h-[214px]">
        <div className="h4 w-[180px] rounded-full bg-neutral-300">&nbsp;</div>
      </div>
    );
  }

  if (plastics.status === "failed") {
    return <div>{`ERROR: ${plastics.error}`}</div>;
  }

  const { records } = plastics;

  const filteredRecords = records.filter((record) => {
    const partnerMatch = selectedPartners.some(partner => partner.CompanyID === record.PartnerCompanyID);
    const facilityMatch = selectedFacilities.some(facility => facility.facilityID === record.FacilityID);
    const partnerFacilityMatch = selectedPartnerFacilities.some(partnerFacility => partnerFacility.facilityID === record.PartnerFacilityID);
    return partnerMatch && facilityMatch && partnerFacilityMatch;
  });

  const calculateSummaries = (records: any[]) => {
    const summaries = {
      HDPE: { quantity: 0 },
      PET: { quantity: 0 },
      LDPE: { quantity: 0 },
      PP: { quantity: 0 },
      PS: { quantity: 0 },
      PVC: { quantity: 0 },
    };

    records.forEach((record) => {
      Object.entries(record.RecyclingData).forEach(([key, data]) => {
        const typedData = data as { Quantity: number };
        const validKeys = Object.keys(summaries) as Array<keyof typeof summaries>;
        if (validKeys.includes(key as keyof typeof summaries)) {
          summaries[key as keyof typeof summaries].quantity += typedData.Quantity;
        }
      });
    });

    return Object.entries(summaries).map(([label, data]) => ({
      label,
      quantity: data.quantity,
    }));
  };

  return (
    <div className="dashcomponent">
      <DashboardDisplayHeader headerText="Plastic Footprint Coverage Per Partner" />
      <div className="flex flex-wrap gap-4">
        {selectedPartners.map((partner) => {
          const partnerRecords = filteredRecords.filter(record => record.PartnerCompanyID === partner.CompanyID);
          const partnerSummaries = calculateSummaries(partnerRecords);
          const totalQuantity = partnerSummaries.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div key={partner.CompanyID} className="w-full mb-6">
              <div className="flex items-center mb-2">
                <h3 className="mr-4">{partner.CompanyName}</h3>
              </div>
              <div className="flex h-6 w-full rounded overflow-hidden">
                {partnerSummaries.map((partner, index) => {
                  const coveragePercentage = totalQuantity > 0 ? (partner.quantity / totalQuantity) * 100 : 0;
                  const isSelected = selectedPartners.some((p) => p.CompanyID === partner.);
                  const backgroundColor = isSelected ? COLORS_PARTNERS_EXPLICIT[index] : "bg-neutral-300";

                  return (
                    <div
                      key={index}
                      className={`h-full cursor-pointer ${backgroundColor}`}
                      style={{ width: `${coveragePercentage}%` }}
                      onClick={() => {
                        dispatch(setToPartner(selectedPartners.filter(p => p.CompanyID !== partner.CompanyID)));
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnerCoverage;