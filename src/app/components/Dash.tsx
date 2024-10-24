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
import FacilityFootprint from "./FacilityFootprint";
import FacilityFootprintSimple from "./FacilityFootprintSimple";
import FacilityFootprintMultiStackedBar from "./FacilityFootprintMultiStackedBar";
import MixedPlasticFootprint from "./MixedPlasticFootprint";
import MixedPlasticFootprintSimple from "./MixedPlasticFootprintSimple";
import MixedPlasticFootprintMultiStackedBar from "./MixedPlasticFootprintMultiStackedBar";
import PartnerFootprintMultiStackedBar from "./PartnerFootprintMultiStackedBar";

import DashboardDisplayHeader from "./DashboardDisplayHeader";

const Dash = () => {
  
  useGetTheData();


  return (
    <div>
       <div className="sticky top-0 z-50 w-full mb-3 text-xs bg-custom-light-tan py-6 px-20 shadow-lg">
        <Navbar />
      </div>
    
    <div className="responsive-padding min-h-screen flex flex-col gap-12 z-0 px-12 ">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl inter mr-4 font-bold" >All Plastics</h2>
          <div className=" border-b border-neutral-400 mb-2" ></div>
          <div className="flex flex-row gap-3">
            <PlasticFootprintSimple />
            <PlasticFootprintMultiStackedBar />
          </div>
        </div>
        
          <div className="flex flex-col gap-3">
          <h2 className="text-4xl inter mr-4 font-bold" >Mixed Plastic</h2>
          <div className=" border-b border-neutral-400 mb-2" ></div>
          <div className="flex flex-row gap-3">
          <MixedPlasticFootprintSimple />
            <MixedPlasticFootprintMultiStackedBar />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-4xl inter mr-4 font-bold" >Partners</h2>
          <div className=" border-b border-neutral-400 mb-2" ></div>
          <div className="flex flex-row gap-3">
          <PartnerFootprintSimple />
          <PartnerFootprintMultiStackedBar />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-4xl inter mr-4 font-bold" >My Facilities</h2>
          <div className=" border-b border-neutral-400 mb-2" ></div>
          <div className="flex flex-row gap-3">
          <FacilityFootprintSimple />
          <FacilityFootprintMultiStackedBar />
          
          </div>
        </div>
       
        
        <h5 className="text-center text-neutral-400 text-sm">© COPYRIGHT OURO CIRCULARITY 2025</h5>
        
      {/* <StorePrinter /> */}
    </div>
    </div>
  );
};

export default Dash;
