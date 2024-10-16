import { PartnerCompanyID } from "./types";

export const PARTNER_NAMES: Record<PartnerCompanyID, string> = {
  1: "DTG",
  2: "WM",
  3: "MYPARTNER",
  4: "POOPYPARTNER",
  5: "POOPYPARTNER2",
  6: "POOPYPARTNER3",
  7: "POOPYPARTNER4",
  8: "POOPYPARTNER5",
  9: "POOPYPARTNER6",
  10: "POOPYPARTNER7",
  11: "POOPYPARTNER8",
  12: "POOPYPARTNER9",
  13: "POOPYPARTNER10",
  14: "POOPYPARTNER11",
  15: "POOPYPARTNER12",
} as const;


// If you need to get the names or IDs separately, you can create these helper objects:
export const partnerIds = Object.keys(PARTNER_NAMES).map(
  Number
) as PartnerCompanyID[];
export const partnerNamesList = Object.values(PARTNER_NAMES);

// You can also create a reverse mapping if needed:
export const partnerIdsByName: Record<string, PartnerCompanyID> =
  Object.entries(PARTNER_NAMES).reduce(
    (acc, [id, name]) => ({
      ...acc,
      [name]: Number(id) as PartnerCompanyID,
    }),
    {}
  );
