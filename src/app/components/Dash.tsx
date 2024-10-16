"use client";
import React from "react";
import PlasticFootPrint from "./PlasticFootprint";
import useGetTheData from "../hooks/useGetTheData";
import StorePrinter from "./StorePrinter";
import PlasticFootprintPie from "./PlasticFootprintPie";
import Navbar from "./Navbar";
import PlasticFootprintMultiStackedBar from "./PlasticFootprintMultiStackedBar"
import PlasticFootprintSimple from "./PlasticFootprintSimple";
import PartnerFootprintSimple from "./PartnerFootprintSimple";
import PartnerFootprint from "./PartnerFootprint";
import FacilityFootprintSimple from "./FacilityFootprintSimple";
import MixedPlasticFootprint from "./MixedPlasticFootprint";
import MixedPlasticFootprintSimple from "./MixedPlasticFootprintSimple";
import MixedPlasticFootprintMultiStackedBar from "./MixedPlasticFootprintMultiStackedBar";
import FacilityFootprint from "./FaciltyFootprint";
const Dash = () => {
  
  useGetTheData();

  const [activeTab, setActiveTab] = React.useState('plastic');

  return (
    <div className="responsive-padding min-h-screen flex flex-col gap-8">
      <Navbar />
      <div className="tabs">
        <button onClick={() => setActiveTab('plastic')}>Plastic</button>
        <button onClick={() => setActiveTab('mixed')}>Mixed</button>
        <button onClick={() => setActiveTab('partner')}>Partners</button>
        <button onClick={() => setActiveTab('facility')}>Facilities</button>
      </div>
      {activeTab === 'plastic' && (
        <div className="flex flex-col gap-4">
          <PlasticFootprintSimple />
          <PlasticFootprintMultiStackedBar />
        </div>
      )}
      {activeTab === 'mixed' && (
        <div className="flex flex-col gap-4">
          <MixedPlasticFootprintSimple />
          <MixedPlasticFootprintMultiStackedBar />
        </div>
      )}
      {activeTab === 'partner' && <PartnerFootprint />}
      {activeTab === 'facility' && <FacilityFootprint />}
      {/* <StorePrinter /> */}
    </div>
  );
};

export default Dash;
