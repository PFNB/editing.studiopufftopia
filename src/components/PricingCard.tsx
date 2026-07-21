import { PricingPackage, Currency } from '../types';
import { useState } from 'react';

interface PricingCardProps {
  pkg: PricingPackage;
  currency: Currency;
  key?: string | number;
}

export function PricingCard({ pkg, currency }: PricingCardProps) {
  const symbol = currency === 'GBP' ? '£' : '$';
  const price = currency === 'GBP' ? pkg.basePriceGBP : pkg.basePriceUSD;
  const isCustom = price === 0;

  return (
    <div className="border border-zinc-800 p-8 flex flex-col h-full bg-black rounded-2xl hover:border-zinc-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-\[#FFE600\]/10 transition-all duration-300">
      <div className="mb-6 border-b border-zinc-800 pb-6 text-left">
        <h3 className="text-2xl font-black uppercase text-white mb-2">
          {pkg.title}
        </h3>
        {pkg.description && <p className="text-white font-medium text-sm">{pkg.description}</p>}
      </div>
      <div className="mb-8 text-white">
        <span className="text-5xl font-black">{isCustom ? 'Custom' : `${symbol}${price}`}</span>
        {!isCustom && pkg.additionalHourlyGBP && (
          <p className="text-white text-sm mt-2">
            +{symbol}{currency === 'GBP' ? pkg.additionalHourlyGBP : pkg.additionalHourlyUSD}/hr for additional footage
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3 font-medium text-white text-sm">
        {pkg.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-zinc-200 mt-0.5">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {pkg.addons && pkg.addons.length > 0 && (
        <div className="mt-auto bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h4 className="font-black text-white mb-4 uppercase text-sm tracking-wide">Optional Additions</h4>
          <div className="space-y-4">
            {pkg.addons.map((addon, idx) => {
              const addonPrice = currency === 'GBP' ? addon.priceGBP : addon.priceUSD;
              const isAddonCustom = addonPrice === 0;
              return (
                <div key={idx} className="bg-black p-4 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-sm">{addon.name}</span>
                    <span className="font-black text-\[#FFE600\] text-sm">
                      {isAddonCustom ? 'Custom Quote' : `+${symbol}${addonPrice}`}
                    </span>
                  </div>
                  <ul className="text-xs text-white space-y-1">
                    {addon.features.map((f, i) => (
                      <li key={i}>- {f}</li>
                    ))}
                  </ul>
                  {addon.additionalHourlyGBP && !isAddonCustom && (
                    <div className="mt-3 pt-3 border-t border-zinc-800 text-xs font-bold text-zinc-300">
                      Additional footage: +{symbol}{currency === 'GBP' ? addon.additionalHourlyGBP : addon.additionalHourlyUSD} per hour
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
