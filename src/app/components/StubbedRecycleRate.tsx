"use client";
import React from "react";
import { Line } from 'react-chartjs-2';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DashboardDisplayHeader from "./DashboardDisplayHeader";
import { calculateSummaries } from "./PlasticFootprintPie";

const StubbedRecycleRate = () => {
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

  if (plastics.status === "loading") {
    return <div>Loading...</div>;
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

  const labels = filteredRecords.map(record => `${record.Month}/${record.Year}`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Recycle Rate',
        data: summaries.map(summary => summary.percentage),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Recycle Rate Over Time',
      },
    },
  };

  const averageRate = summaries.reduce((acc, summary) => acc + summary.percentage, 0) / summaries.length;
  const rateChange = summaries[summaries.length - 1].percentage - summaries[0].percentage;
  const arrow = rateChange > 0 ? '↑' : '↓';

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 min-w-[30%]">
      <DashboardDisplayHeader headerText="Recycle Rate" />
      <Line data={data} options={options} />
      <div className="flex justify-between items-center mt-4">
        <div className="text-lg font-bold">Average Rate: {averageRate.toFixed(2)}%</div>
        <div className={`text-lg font-bold ${rateChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {arrow} {Math.abs(rateChange).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default StubbedRecycleRate;