import { useSelector} from 'react-redux';
import { RootState } from '../store';

const StorePrinter: React.FC = () => {
  
  const storeState = useSelector((state: RootState) => state);
  const validPartnerFacilities = useSelector((state: RootState) => state.validPartnerFacilities.PartnerFacilities);
  const selectedPartnerFacilities = useSelector((state: RootState) => state.selectedPartnerFacilities.selectedPartnerFacilities);
  const validFacilities = useSelector((state: RootState) => state.validFacilities.Facilities);
  const selectedFacilities = useSelector((state: RootState) => state.selectedFacilities.selectedFacilities);
  const selectedPlastics = useSelector((state: RootState) => state.selectedPlastics.selectedPlastics);
  const selectedPartners = useSelector((state: RootState) => state.selectedPartners.selectedPartners);
  const validPartners = useSelector((state: RootState) => state.validPartners.partners);
  const recyclingRecords = useSelector((state: RootState) => state.recyclingRecords);
  const startMonth = useSelector((state: RootState) => state.selectedDate.startMonth);
  const startYear = useSelector((state: RootState) => state.selectedDate.startYear);
  const endMonth = useSelector((state: RootState) => state.selectedDate.endMonth);
  const endYear = useSelector((state: RootState) => state.selectedDate.endYear);

  return (
    <div className="dashcomponent flex flex-col">
     
     <h3 className="text-xl font-semibold mb-2">Start Date:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify({ month: startMonth, year: startYear }, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">End Date:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify({ month: endMonth, year: endYear }, null, 2)}</pre>
        
        <h3 className="text-xl font-semibold mb-2">Selected Partner Facilities:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(selectedPartnerFacilities, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Valid Partner Facilities:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(validPartnerFacilities, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Selected Facilities:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(selectedFacilities, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Valid Facilities:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(validFacilities, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Valid Partners:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(validPartners, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Selected Partners:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(selectedPartners, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2">Selected Plastics:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(selectedPlastics, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2 mt-4">Recycling Records</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(recyclingRecords, null, 2)}</pre>

        <h3 className="text-xl font-semibold mb-2 mt-4">Store State:</h3>
        <pre className="bg-neutral-200 p-4 mb-8 rounded overflow-auto">{JSON.stringify(storeState, null, 2)}</pre>

       
      </div>
  );
};

export default StorePrinter;