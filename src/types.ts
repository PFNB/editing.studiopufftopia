export type ViewState = 'home' | 'payment';

export type Currency = 'GBP' | 'USD';

export interface PricingAddon {
  name: string;
  priceGBP: number;
  priceUSD: number;
  additionalHourlyGBP?: number;
  additionalHourlyUSD?: number;
  features: string[];
}

export interface PricingPackage {
  id: string;
  title: string;
  basePriceGBP: number;
  basePriceUSD: number;
  additionalHourlyGBP?: number;
  additionalHourlyUSD?: number;
  description?: string;
  features: string[];
  type: 'long' | 'short';
  addons?: PricingAddon[];
}

export interface PortfolioItem {
  id: string;
  title?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  type: 'long' | 'short';
  duration?: string;
}
