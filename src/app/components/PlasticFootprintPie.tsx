"use client";
import React from "react";
import { MAPPING_LIGHT_EXPLICIT, MAPPING_DARK_EXPLICIT, MAPPING_LIGHT } from "../common/colors";
import { Plastic, RecyclingRecord } from "../common/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setToItems } from "../store/selectedPlasticsSlice";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { calculateSummaries } from "..//utils/calculateSummaries";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // Register the plugin

const PlasticFootprintPie = () => {
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

  const dispatch = useDispatch();

  if (plastics.status === "loading") {
    return <div>I LOADING NOW PLS WAIT</div>;
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

  const totalQuantity = summaries.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const selectedData = summaries.filter(
    (item) => selectedPlastics.includes(item.label) && item.quantity > 0,
  );

  const summariesFiltered = summaries.filter(
    (item) => item.quantity > 0
  );

  const totalSelectedQuantity = selectedData.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const data = {
    labels: selectedData.flatMap(item => [item.label + ' Recycled', item.label + ' Waste']),
    datasets: [
      {
        label: 'Plastic Footprint',
        data: selectedData.flatMap(item => [item.recycled, item.quantity - item.recycled]),
        backgroundColor: selectedData.flatMap(item => [MAPPING_DARK_EXPLICIT[item.label], MAPPING_LIGHT_EXPLICIT[item.label]]),
        borderColor: selectedData.flatMap(item => [MAPPING_DARK_EXPLICIT[item.label], MAPPING_LIGHT_EXPLICIT[item.label]]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        // position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Plastic Footprint',
      },
      datalabels: { // Configure the datalabels plugin
        display: false,
        color: '#fff',
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return label;
        },
        font: {
          weight: 'bold',
          size: 12,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 min-w-[30%]">
      <h2 className="text-xl mb-8">Plastic Footprint</h2>
      <Pie data={data} options={options} />
      <div className="flex gap-1 rounded-md overflow-hidden mt-6">
        {summariesFiltered.map((item, index) => (
          <div
            key={index}
            className={`flex items-end justify-left min-w-14 text-white text-sm font-regular cursor-pointer ${
              selectedPlastics.includes(item.label)
                ? MAPPING_LIGHT[item.label]
                : "bg-neutral-300"
            }`}
            onClick={() => {
              const newSelectedPlastics = selectedPlastics.includes(item.label)
                ? selectedPlastics.filter((plastic) => plastic !== item.label)
                : [...selectedPlastics, item.label];
              dispatch(setToItems(newSelectedPlastics));
            }}
            style={{
              width: `${(item.quantity / totalQuantity) * 100}%`,
              transition: "background-color 200ms ease",
            }}
          >
            <div className="p-2 w-0 ">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlasticFootprintPie;