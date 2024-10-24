import { PartnerCompanyID, Plastic } from "./types";

  // Define the color mapping based on the label
  export const MAPPING_LIGHT: Record<Plastic, string> = {
    'HDPE' : 'bg-custom-red',
    'PET'  : 'bg-custom-blue',
    'PP'   : 'bg-custom-yellow',
    'MixedPlastic': 'bg-custom-brown',
    'LDPE' : 'bg-custom-sky',
    'PS'   : 'bg-custom-orange',
    'PVC'  : 'bg-custom-pink',
  };

  export const MAPPING_DARK: Record<Plastic, string> = {
    'HDPE' : 'bg-custom-red-darker',
    'PET'  : 'bg-custom-blue-darker',
    'PP'   : 'bg-custom-yellow-darker',
    'MixedPlastic': 'bg-custom-brown-darker',
    'LDPE' : 'bg-custom-sky-darker',
    'PS'   : 'bg-custom-orange-darker',
    'PVC'  : 'bg-custom-pink-darker',
  };

  export const MAPPING_LIGHTER: Record<Plastic, string> = {
    'HDPE' : 'bg-custom-red-lighter',
    'PET'  : 'bg-custom-blue-lighter',
    'PP'   : 'bg-custom-yellow-lighter',
    'MixedPlastic': 'bg-custom-brown-lighter',
    'LDPE' : 'bg-custom-sky-lighter',
    'PS'   : 'bg-custom-orange-lighter',
    'PVC'  : 'bg-custom-pink-lighter',
  };

  export const COLORS_LIGHT: Record<number, string> = {
    0: 'bg-custom-red',
    1: 'bg-custom-blue',
    2: 'bg-custom-yellow',
    3: 'bg-custom-blue',
    4: 'bg-custom-sky',
    5: 'bg-custom-green',
    6: 'bg-custom-pink',
  };

  export const COLORS_PARTNER: Record<any, string> = {
    3: 'bg-custom-neutral-brown-darker',
    4: 'bg-custom-neutral-brown-medium',
  };
  export const COLORS_PARTNERS_LIGHTER: Record<any, string> = {
    3: 'bg-custom-neutral-brown-lighter',
    4: 'bg-custom-neutral-brown-lighterMedium',
  };
  export const COLORS_FACILITIES: Record<any, string> = {
    1: 'bg-custom-neutral-green-darker',
    16 : 'bg-custom-neutral-green-medium',
  };
  export const COLORS_FACILITIES_LIGHTER: Record<any, string> = {
    1: 'bg-custom-neutral-green-lighter',
    16 : 'bg-custom-neutral-green-lighterMedium',
  };


  //explicit colors for charts js.


  export const MAPPING_LIGHT_EXPLICIT: Record<Plastic, string> = {
    'HDPE': '#FF6B6B',  // custom-red DEFAULT
    'PET': '#6B67FF',   // custom-blue DEFAULT
    'PP': '#EDCF0E',    // custom-yellow DEFAULT
    'MixedPlastic': '#7A5A3A', // custom-brown DEFAULT
    'LDPE': '#80D4FA',  // custom-sky DEFAULT
    'PS': '#FFB300',    // custom-orange DEFAULT
    'PVC': '#DE82E0',   // custom-pink DEFAULT
  };
  
  export const MAPPING_DARK_EXPLICIT: Record<Plastic, string> = {
    'HDPE': '#B34747',  // custom-red darker
    'PET': '#4743B3',   // custom-blue darker
    'PP': '#A5910A',    // custom-yellow darker
    'MixedPlastic': '#523D28', // custom-brown darker
    'LDPE': '#5996B3',  // custom-sky darker
    'PS': '#B37C00',    // custom-orange darker
    'PVC': '#9A5B9B',   // custom-pink darker
  };