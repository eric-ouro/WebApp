export const calculateItemRatios = (item: {recycled: number, processed: number, quantity: number}) => {
  const recycleRate = item.recycled ? (item.recycled / item.quantity) * 100 : 0;
  const recyclingLossQuantity = item.processed - item.recycled;
  const recyclingLossRate = recyclingLossQuantity / item.quantity * 100;
  const processingLoss = item.quantity - item.processed;
  const processingLossRate = processingLoss / item.quantity * 100;

  return new Map([
    ['recycleRate', recycleRate],
    ['recyclingLossQuantity', recyclingLossQuantity],
    ['recyclingLossRate', recyclingLossRate],
    ['processingLoss', processingLoss],
    ['processingLossRate', processingLossRate],
  ]);
};
