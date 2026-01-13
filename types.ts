
export enum RestaurantName {
  BRIQUE = 'BRIQUE',
  QUINTANA = 'QUINTANA',
  VERISSIMO = 'VERÍSSIMO',
  VISTTA = 'VISTTA',
  HAMPEL = 'HAMPEL',
  NAPOLI = 'NAPOLI'
}

export interface RestaurantData {
  sales: number;
  bottlesSold: number;
  glassesSold: number;
  avgPrice: number;
  cmv: number;
  wineGlassStock: number;
  sparklingGlassStock: number;
  bottleStock: number;
}

export interface MonthlyReport {
  month: string; // ISO format YYYY-MM
  restaurants: Record<string, RestaurantData>;
  notes?: string;
}

export const RESTAURANT_COLORS: Record<string, string> = {
  [RestaurantName.BRIQUE]: '#ef4444',
  [RestaurantName.QUINTANA]: '#bef264',
  [RestaurantName.VERISSIMO]: '#f97316',
  [RestaurantName.VISTTA]: '#1e40af',
  [RestaurantName.HAMPEL]: '#7c3aed',
  [RestaurantName.NAPOLI]: '#db2777',
};

export const RESTAURANTS_LIST = Object.values(RestaurantName);

export const MONTHS_LABELS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
];
