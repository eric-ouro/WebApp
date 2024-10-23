import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Plastic } from '../common/types';
import { MAPPING_LIGHT } from '../common/colors';
import { selectAllPlastics, selectNonePlastics, togglePlastic } from '../store/selectedPlasticsSlice';
import { selectAllPartners, selectNonePartners, togglePartner } from '../store/selectedPartnersSlice';
import { selectAllFacilities, selectNoneFacilities, toggleFacility } from '../store/selectedFacilitiesSlice';
import { selectAllPartnerFacilities, selectNonePartnerFacilities, togglePartnerFacility } from '../store/selectedPartnerFacilitiesSlice';
import { setEndMonth, setEndYear, setStartMonth, setStartYear } from '../store/selectedDateSlice';
import useGetTheData from '../hooks/useGetTheData';
import Dropdown from './Dropdown';

const Dropdowns: React.FC = () => {
  const dispatch = useDispatch();
  const validPartnerFacilities = useSelector((state: RootState) => state.validPartnerFacilities.PartnerFacilities);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const validFacilities = useSelector((state: RootState) => state.validFacilities.Facilities);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
  const selectedDates = useSelector((state: RootState) => state.selectedDate);

  const allPlastics: Plastic[] = ["HDPE", "LDPE", "PET", "PP", "PS", "PVC", 'MixedPlastic'];

  

  const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const MONTH_MAPPING: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };



  
  const MONTH_ABBREVIATION_MAPPING: { [key: number]: string } = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
  };
  const years = [2023, 2024];


  useEffect(() => {
    dispatch(selectAllPartners(validPartners));
  }, [dispatch, validPartners]);

  useEffect(() => {
    dispatch(selectAllFacilities(validFacilities));
  }, [dispatch, validFacilities]);

  useEffect(() => {
    dispatch(selectAllPartnerFacilities(validPartnerFacilities));
  }, [dispatch, validPartnerFacilities]);

  // Function to get color class from MAPPING_LIGHT
  const getPlasticColor = (plastic: Plastic) => {
    return MAPPING_LIGHT[plastic] || 'bg-gray-200'; // Fallback color
  };

  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Ref for the dropdown container to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to toggle dropdowns
  const handleToggle = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const getPlasticLabel = (label: string) => {
    if (label === 'MixedPlastic') {
      return 'Mixed';
    }
    return label;
  };

  return (
    <div className="flex flex-col" ref={dropdownRef}>
      <div className="">
        <div className="flex">
          <div className="flex items-bottom">
            <Dropdown
              title="Plastics"
              subTitle='Plastics'
              items={allPlastics}
              selectedItems={selectedPlastics}
              onToggleItem={(plastic) => dispatch(togglePlastic(plastic))}
              onSelectAll={() => dispatch(selectAllPlastics())}
              onSelectNone={() => dispatch(selectNonePlastics())}
              getItemLabel={(plastic) => getPlasticLabel(plastic)}
              getItemColor={getPlasticColor} // Pass the color mapper
              isOpen={openDropdown === 'Plastics'}
              onToggle={() => handleToggle('Plastics')}
            />
           <div className=" border-l border-neutral-300 h-full mx-6"></div>
          </div>
           
          <div className="flex items-bottom">
            <Dropdown
              title="Facilities"
              subTitle='Facilities'
              items={validFacilities}
              selectedItems={selectedFacilities}
              onToggleItem={(facility) => dispatch(toggleFacility(facility))}
              onSelectAll={() => dispatch(selectAllFacilities(validFacilities))}
              onSelectNone={() => dispatch(selectNoneFacilities())}
              getItemLabel={(facility) => facility.facilityName}
              isOpen={openDropdown === 'Facilities'}
              onToggle={() => handleToggle('Facilities')}
            />
            <div className=" border-l border-neutral-300 h-full mx-6"></div>
          </div>
          <div className="flex items-bottom">
            <Dropdown
              title="Partners"
              subTitle='Partners'
              items={validPartners}
              selectedItems={selectedPartners}
              onToggleItem={(partner) => dispatch(togglePartner(partner))}
              onSelectAll={() => dispatch(selectAllPartners(validPartners))}
              onSelectNone={() => dispatch(selectNonePartners())}
              getItemLabel={(partner) => partner.CompanyName}
              isOpen={openDropdown === 'Partners'}
              onToggle={() => handleToggle('Partners')}
            />
            <div className=" border-l border-neutral-300 h-full mx-6"></div>
          </div>
          <div className="flex items-bottom">
            <Dropdown
              title="Partner Facilities"
              subTitle='Partner Facilities'
              items={validPartnerFacilities}
              selectedItems={selectedPartnerFacilities}
              onToggleItem={(facility) => dispatch(togglePartnerFacility(facility))}
              onSelectAll={() => dispatch(selectAllPartnerFacilities(validPartnerFacilities))}
              onSelectNone={() => dispatch(selectNonePartnerFacilities())}
              getItemLabel={(facility) => facility.facilityName}
              isOpen={openDropdown === 'Partner Facilities'}
              onToggle={() => handleToggle('Partner Facilities')}
            />
            <div className=" border-l border-neutral-300 h-full mx-6"></div>
          </div>
          <div className="flex items-bottom">
              <Dropdown
                title="Start Month"
                subTitle='Start&nbsp;Date'
                items={MONTHS}
                selectedItems={[selectedDates.startMonth]}
                onToggleItem={(month) => dispatch(setStartMonth(month))}
                onSelectAll={() => {}}
                onSelectNone={() => {}}
                getItemLabel={(month) => MONTH_MAPPING[month]}
                isOpen={openDropdown === 'start_month'}
                onToggle={() => handleToggle('start_month')}
              />
              <div className="ml-2">
                <Dropdown
                  title="Start Year"
                  subTitle=''
                  items={years}
                  selectedItems={[selectedDates.startYear]}
                  onToggleItem={(year) => dispatch(setStartYear(year))}
                  onSelectAll={() => {}}
                  onSelectNone={() => {}}
                  getItemLabel={(year) => year.toString()}
                  isOpen={openDropdown === 'start_year'}
                  onToggle={() => handleToggle('start_year')}
                />
              </div>
              <div className="  h-full  mx-3"></div>
          </div>
          <div className="flex items-bottom">
              <Dropdown
                title="End Month"
                subTitle='End&nbsp;Date'
                items={MONTHS}
                selectedItems={[selectedDates.endMonth]}
                onToggleItem={(month) => dispatch(setEndMonth(month))}
                onSelectAll={() => {}}
                onSelectNone={() => {}}
                getItemLabel={(month) => MONTH_MAPPING[month]}
                isOpen={openDropdown === 'end_month'}
                onToggle={() => handleToggle('end_month')}
              />
              <div className="ml-2">
                <Dropdown
                  title="End Year"
                  subTitle=''
                  items={years}
                  selectedItems={[selectedDates.endYear]}
                  onToggleItem={(year) => dispatch(setEndYear(year))}
                  onSelectAll={() => {}}
                  onSelectNone={() => {}}
                  getItemLabel={(year) => year.toString()}
                  isOpen={openDropdown === 'end_year'}
                  onToggle={() => handleToggle('end_year')}
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdowns;