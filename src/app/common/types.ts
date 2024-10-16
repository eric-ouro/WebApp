export type RecyclingMaterialData = {
    Processed: number;
    Quantity: number;
    Recycled: number;
};
export type RecyclingMaterialDataMixed = {
    Processed: number;
    Recycled: number;
    Quantity?: number;
};

export type RecyclingData = {
    HDPE: RecyclingMaterialData;
    LDPE: RecyclingMaterialData;
    MixedPlastic: RecyclingMaterialData;
    PET: RecyclingMaterialData;
    PP: RecyclingMaterialData;
    PS: RecyclingMaterialData;
    PVC: RecyclingMaterialData;
};

export type MixedPlasticRecyclingData = {
    HDPE: RecyclingMaterialDataMixed;
    LDPE: RecyclingMaterialDataMixed;
    MixedPlastic: RecyclingMaterialData;
    PET: RecyclingMaterialDataMixed;
    PP: RecyclingMaterialDataMixed;
    PS: RecyclingMaterialDataMixed;
    PVC: RecyclingMaterialDataMixed;
};


export type Plastic = keyof RecyclingData

export type RecyclingRecord = {
    CompanyID: number;
    FacilityID: number;
    Month: number;
    PartnerCompanyID: number;
    PartnerFacilityID: number;
    RecyclingData?: RecyclingData;
    MixedPlasticRecyclingData?: MixedPlasticRecyclingData;
    Year: number;
};

export type PartnersRecord = {
    CompanyID: number;
    CompanyType: string;
    CompanyName: string;
};

export type FacilitiesRecord = {
    facilityID: number;
    facilityType: string;
    facilityName: string;
    locationX: number;
    locationY: number;
    state: string;
    country: string;
    city: string;

}

export type PartnerFacilitiesRecord = {
    PartnerCompanyID: number;
    FacilityID: number;
}

export type PartnerCompanyID = number;

export type RecyclingSummary = {
    label: Plastic;
    quantity: number;
    recycled: number;
    percentage: number;
};

export type SelectedSummaries = {
    HDPE: RecyclingSummary;
    LDPE: RecyclingSummary;
    MixedPlastic: RecyclingSummary;
    PET: RecyclingSummary;
    PP: RecyclingSummary;
    PS: RecyclingSummary;
    PVC: RecyclingSummary;
};

export type SelectedMixedPlasticSummaries = {
    HDPE: RecyclingSummary;
    LDPE: RecyclingSummary;
    MixedPlastic: RecyclingSummary;
    PET: RecyclingSummary;
    PP: RecyclingSummary;
    PS: RecyclingSummary;
    PVC: RecyclingSummary;
};

