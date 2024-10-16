import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  RecyclingRecord,
  PartnersRecord,
  FacilitiesRecord,
} from '../common/types';
import { setRecords, setLoading, setError } from '../store/recyclingRecordsSlice';
import { setValidPartners } from '../store/validPartnersSlice'; // Import the action
import { setValidFacilities } from '../store/validFacilitiesSlice';
import { setValidPartnerFacilities } from '../store/validPartnerFacilitiesSlice';


type RequestState = 'pending' | 'success' | 'error' | 'initialized';

type GetTheDataPendingResponse = {
  status: "PENDING";
}

type GetTheDataErrorResponse = {
  status: "ERROR";
  error: string;
}

type GetTheDataSuccessResponse = {
  status: "SUCCESS";
  records: RecyclingRecord[];
  partners: PartnersRecord[];
  facilities: FacilitiesRecord[];
  partnerFacilities: FacilitiesRecord[];
}

type GetTheDataResponse = GetTheDataPendingResponse | GetTheDataErrorResponse | GetTheDataSuccessResponse;

const useGetTheData = (): GetTheDataResponse => {
  const dispatch = useDispatch();
  const selectedDates = useSelector((state: RootState) => state.selectedDate);
  const [state, setState] = useState<RequestState>('initialized');
  const [error, setError] = useState<string>("");
  const [records, setRecordsState] = useState<RecyclingRecord[]>([]);
  const [partners, setPartners] = useState<PartnersRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilitiesRecord[]>([]);
  const [partnerFacilities, setPartnerFacilities] = useState<FacilitiesRecord[]>([]);

  // Ref to track if data has been fetched
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchPlastics = async () => {
      // Only make request if data has not been fetched
      if (dataFetchedRef.current) {
        return;
      }

      setState('pending');
      dispatch(setLoading());
      try {
        // console.log(selectedDates);

        const {startMonth, startYear, endMonth, endYear} = selectedDates;
        
        const response = await fetch(
          `http://ec2-3-89-122-120.compute-1.amazonaws.com/rates/company/all?company_id=1&startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const records = data.records;

        // console.log("the data:",data)

        if (Array.isArray(data)) {
          // Process the records
          setRecordsState(data);
          const validPartners = await calculatePartners(data);
          const validFacilities = await calculateFacilities(data);
          const validPartnerFacilities = await calculatePartnerFacilities(data);
          setPartners(validPartners);
          setFacilities(validFacilities);
          setPartnerFacilities(validPartnerFacilities);
          setState('success');
          dispatch(setRecords(data));
          dispatch(setValidPartners(validPartners)); // Dispatch valid partners to the store
          dispatch(setValidFacilities(validFacilities)); // Dispatch valid facilities to the store
          dispatch(setValidPartnerFacilities(validPartnerFacilities)); // Dispatch valid partner facilities to the store
          dataFetchedRef.current = true; // Mark data as fetched
        } else {
          throw new Error('Got data of incorrect type');
        }
      } catch (error) {
        console.error('Error fetching plastic data:', error);
        setError((error as Error).message);
        setState('error');
        // dispatch(setError((error as Error).message) as unknown as UnknownAction);
      }
    };

    fetchPlastics();
  }, [dispatch, selectedDates]); // Dependency array includes selectedMonth and selectedYear

  // Return appropriate response based on state
  switch (state) {
    case 'initialized':
    case 'pending':
      return { status: 'PENDING' };
    case 'error':
      return { status: 'ERROR', error };
    case 'success':
      return { status: 'SUCCESS', records, partners, facilities, partnerFacilities };
  }
};



const isRecyclingRecord = (obj: any): obj is RecyclingRecord => {
  return (
      typeof obj.CompanyID === 'number' &&
      typeof obj.FacilityID === 'number' &&
      typeof obj.Month === 'number' &&
      typeof obj.PartnerCompanyID === 'number' &&
      typeof obj.PartnerFacilityID === 'number' &&
      typeof obj.Year === 'number' &&
      typeof obj.RecyclingData === 'object' &&
      obj.RecyclingData !== null &&
      'HDPE' in obj.RecyclingData &&
      'LDPE' in obj.RecyclingData &&
      'MixedPlastic' in obj.RecyclingData &&
      'PET' in obj.RecyclingData &&
      'PP' in obj.RecyclingData &&
      'PS' in obj.RecyclingData &&
      'PVC' in obj.RecyclingData 
  );
};


// Function to calculate unique partner companies from the recycling records
const calculatePartners = async (data: RecyclingRecord[]): Promise<PartnersRecord[]> => {
  const uniquePartners = new Set<number>();

  data.forEach(record => {
    uniquePartners.add(record.PartnerCompanyID);
  });

  const response = await fetch('http://ec2-3-89-122-120.compute-1.amazonaws.com/data/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ company_ids: Array.from(uniquePartners) }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch partner companies');
  }

  const partners = await response.json();

  return partners.map((partner: any) => ({
    CompanyID: partner.companyID,
    CompanyType: partner.CompanyType,
    CompanyName: partner.companyName,
  }));
};

// Function to calculate unique facilities from the recycling records
const calculateFacilities = async (data: RecyclingRecord[]): Promise<FacilitiesRecord[]> => {
  const uniqueFacilities = new Set<number>();

  data.forEach(record => {
    uniqueFacilities.add(record.FacilityID);
  });

  const response = await fetch('http://ec2-3-89-122-120.compute-1.amazonaws.com/data/facility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ facility_ids: Array.from(uniqueFacilities) }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch facilities');
  }

  const facilities = await response.json();

  return facilities.map((facility: any) => ({
    facilityID: facility.facilityID,
    facilityType: facility.facilityType,
    facilityName: facility.facilityName,
    locationX: facility.locationX,
    locationY: facility.locationY,
    state: facility.state,
    country: facility.country,
    city: facility.city,
  }));
};


// Function to calculate unique partner facilities from the recycling records
const calculatePartnerFacilities = async (data: RecyclingRecord[]): Promise<FacilitiesRecord[]> => {
  const uniqueFacilities = new Set<number>();

  data.forEach(record => {
    uniqueFacilities.add(record.PartnerFacilityID);
  });

  const response = await fetch('http://ec2-3-89-122-120.compute-1.amazonaws.com/data/facility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ facility_ids: Array.from(uniqueFacilities) }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch facilities');
  }

  const facilities = await response.json();

  return facilities.map((facility: any) => ({
    facilityID: facility.facilityID,
    facilityType: facility.facilityType,
    facilityName: facility.facilityName,
    locationX: facility.locationX,
    locationY: facility.locationY,
    state: facility.state,
    country: facility.country,
    city: facility.city,
  }));
};



export default useGetTheData;
