import { RecyclingRecord, Plastic } from '../common/types';

export const calculateSummaries = (records: RecyclingRecord[]) => {
  const summaries = {
    MixedPlastic: { processed: 0, quantity: 0, recycled: 0 },
    HDPE: { processed: 0, quantity: 0, recycled: 0 },
    PET: { processed: 0, quantity: 0, recycled: 0 },
    LDPE: { processed: 0, quantity: 0, recycled: 0 },
    PP: { processed: 0, quantity: 0, recycled: 0 },
    PS: { processed: 0, quantity: 0, recycled: 0 },
    PVC: { processed: 0, quantity: 0, recycled: 0 },
  };

  records.forEach((record) => {
    if (record.RecyclingData) {
      Object.entries(record.RecyclingData).forEach(([key, data]) => {
        if (key in summaries) {
          summaries[key as keyof typeof summaries].processed += data.Processed;
          summaries[key as keyof typeof summaries].recycled += data.Recycled;
          summaries[key as keyof typeof summaries].quantity += data.Quantity;
        }
      });
    }
    if (record.MixedPlasticRecyclingData) {
      const mixedPlasticData = record.MixedPlasticRecyclingData.MixedPlastic;
      summaries.MixedPlastic.processed += mixedPlasticData.Processed;
      summaries.MixedPlastic.recycled += mixedPlasticData.Recycled;
      summaries.MixedPlastic.quantity += mixedPlasticData.Quantity || 0;
    }
  });

  return Object.entries(summaries).map(([label, data]) => ({
    label: label as Plastic,
    quantity: data.quantity,
    recycled: data.recycled,
    processed: data.processed,
    percentage: data.quantity > 0 ? (data.recycled / data.quantity) * 100 : 0,
  }));
};


export const calculateMixedPlasticSummaries = (records: RecyclingRecord[]) => {
  const summaries = {
    MixedPlastic: { processed: 0, quantity: 0, recycled: 0 },
    HDPE: { processed: 0, recycled: 0, quantity: 0  },
    PET: { processed: 0, recycled: 0, quantity: 0 },
    LDPE: { processed: 0, recycled: 0, quantity: 0 },
    PP: { processed: 0, recycled: 0, quantity: 0 },
    PS: { processed: 0, recycled: 0, quantity: 0 },
    PVC: { processed: 0, recycled: 0, quantity: 0 },
  };

  records.forEach((record) => {
    // console.log("Processing record:", record);
    if (record.MixedPlasticRecyclingData) {
      Object.entries(record.MixedPlasticRecyclingData).forEach(([key, data]) => {
        if (key in summaries) {
          summaries[key as keyof typeof summaries].processed += data.Processed;
          summaries[key as keyof typeof summaries].recycled += data.Recycled;
        }
      });
      // console.log("Processing mixed plastic data:", record.MixedPlasticRecyclingData);
      const mixedPlasticData = record.MixedPlasticRecyclingData.MixedPlastic;
      summaries.MixedPlastic.quantity += mixedPlasticData.Quantity || 0;
    } 
  });

  Object.entries(summaries).forEach(([key, data]) => {
    if (key !== 'MixedPlastic') {
      data.quantity = (data.processed / summaries.MixedPlastic.processed) * summaries.MixedPlastic.quantity;
    }
  });

  // console.log("Summaries after processing:", summaries);
  return Object.entries(summaries).map(([label, data]) => {
    const result: any = {
      label: label as Plastic,
      recycled: data.recycled,
      processed: data.processed,
      quantity: data.quantity,
    };
    return result;
  });
};