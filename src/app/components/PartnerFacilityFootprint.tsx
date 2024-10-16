import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const FacilityPlasticFootprint = ({ records }) => {
  const validPartnerFacilities = useSelector((state: RootState) => state.validPartnerFacilities.PartnerFacilities);

  const calculateSummedData = (facilityID) => {
    const facilityRecords = records.filter(record => record.PartnerFacilityID === facilityID);
    const summedData = facilityRecords.reduce((acc, record) => {
      Object.keys(record.MixedPlasticRecyclingData).forEach(plasticType => {
        const data = record.MixedPlasticRecyclingData[plasticType];
        if (!acc[plasticType]) {
          acc[plasticType] = { Processed: 0, Recycled: 0 };
        }
        acc[plasticType].Processed += data.Processed;
        acc[plasticType].Recycled += data.Recycled;
      });
      return acc;
    }, {});
    return summedData;
  };

  return (
    <div>
      {validPartnerFacilities.map(facility => {
        const summedData = calculateSummedData(facility.facilityID);
        return (
          <div key={facility.facilityID} className="facility-section">
            <h3>{facility.name}</h3>
            <div className="plastic-data">
              {Object.keys(summedData).map(plasticType => {
                const data = summedData[plasticType];
                const recycleRate = (data.Recycled / data.Processed) * 100 || 0;
                return (
                  <div key={plasticType} className="plastic-type">
                    <span>{plasticType}</span>
                    <div className="bar" style={{ width: `${recycleRate}%` }}>
                      <span>{recycleRate.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FacilityPlasticFootprint;
