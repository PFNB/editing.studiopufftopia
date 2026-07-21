import { useState } from 'react';
import { Currency, PricingPackage } from '../types';

interface PriceCalculatorProps {
  packages: PricingPackage[];
  currency: Currency;
  type: 'long' | 'short';
}

export function PriceCalculator({ packages, currency, type }: PriceCalculatorProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || '');
  const [hours, setHours] = useState<number>(type === 'long' ? 2 : 0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [numShorts, setNumShorts] = useState<number>(1);
  const [sourceOption, setSourceOption] = useState<'A' | 'B'>('A');
  const [isRush, setIsRush] = useState<boolean>(false);

  // Default to the base package for calculation
  const selectedPkg = packages.find(p => p.id.includes('base')) || packages[0];
  const symbol = currency === 'GBP' ? '£' : '$';

  if (!selectedPkg) return null;

  const basePrice = currency === 'GBP' ? selectedPkg.basePriceGBP : selectedPkg.basePriceUSD;
  const isCustom = basePrice === 0;

  if (isCustom) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-white">
        <h3 className="text-2xl font-black uppercase mb-4 text-center">Price Calculator</h3>
        <p className="text-center font-medium">This package is quoted individually based on project scope.</p>
      </div>
    );
  }

  // Calculate additional hourly cost
  let extraHours = 0;
  if (type === 'long') {
    extraHours = Math.max(0, hours - 2);
  }
  let hourlyRate = currency === 'GBP' ? (selectedPkg.additionalHourlyGBP || 0) : (selectedPkg.additionalHourlyUSD || 0);
  
  selectedAddons.forEach(addonName => {
    const addon = selectedPkg.addons?.find(a => a.name === addonName);
    if (addon) {
      hourlyRate += currency === 'GBP' ? (addon.additionalHourlyGBP || 0) : (addon.additionalHourlyUSD || 0);
    }
  });

  const hourlyTotal = extraHours * hourlyRate;

  // Calculate addons
  const addonsTotal = selectedAddons.reduce((acc, addonName) => {
    const addon = selectedPkg.addons?.find(a => a.name === addonName);
    if (!addon) return acc;
    return acc + (currency === 'GBP' ? addon.priceGBP : addon.priceUSD);
  }, 0);

  // Short form option B
  let sourceReviewTotal = 0;
  if (type === 'short' && sourceOption === 'B' && hours > 0) {
    // 40 USD / 30 GBP per hour
    const reviewRate = currency === 'GBP' ? 30 : 40;
    sourceReviewTotal = hours * reviewRate;
  }

  let subtotal = basePrice + hourlyTotal + addonsTotal + sourceReviewTotal;
  
  // Bulk discounts for short form
  let discount = 0;
  if (type === 'short') {
    subtotal = subtotal * numShorts;
    if (numShorts >= 20) {
      discount = 0.15;
    } else if (numShorts >= 10) {
      discount = 0.10;
    } else if (numShorts >= 5) {
      discount = 0.05;
    }
  }

  const discountAmount = subtotal * discount;
  let total = subtotal - discountAmount;

  if (isRush) {
    total = total * 1.3; // 30% increase
  }

  const toggleAddon = (name: string) => {
    setSelectedAddons(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-white">
      <h3 className="text-2xl font-black uppercase mb-8 text-center text-[#FFE600]">Price Calculator</h3>
      
      <div className="space-y-6">

        {type === 'long' && (
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Raw Footage (Hours)
            </label>
            <input 
              type="number" 
              min="0" 
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white font-medium"
            />
            <p className="text-xs text-zinc-200 mt-2">First 2 hours included. {symbol}{hourlyRate}/hr thereafter.</p>
          </div>
        )}

        {type === 'short' && (
          <>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Number of Shorts
              </label>
              <input 
                type="number" 
                min="1" 
                value={numShorts}
                onChange={(e) => setNumShorts(Number(e.target.value))}
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-3">
                Source Footage
              </label>
              <div className="space-y-3 mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="sourceOption" 
                    checked={sourceOption === 'A'} 
                    onChange={() => setSourceOption('A')}
                    className="mt-1 w-4 h-4 text-[#FFE600] bg-black border-zinc-700 focus:ring-[#FFE600]" 
                  />
                  <div>
                    <div className="font-bold">Option A: Clips Provided</div>
                    <div className="text-xs text-zinc-300">Included with Base Edit</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="sourceOption" 
                    checked={sourceOption === 'B'} 
                    onChange={() => setSourceOption('B')}
                    className="mt-1 w-4 h-4 text-[#FFE600] bg-black border-zinc-700 focus:ring-[#FFE600]" 
                  />
                  <div>
                    <div className="font-bold">Option B: Clip Selection</div>
                    <div className="text-xs text-zinc-300">
                      {symbol}{currency === 'GBP' ? 30 : 40}/hr of source footage reviewed. I will review the source footage and select the strongest moments.
                    </div>
                  </div>
                </label>
              </div>
              
              {sourceOption === 'B' && (
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-zinc-300">
                    Source Footage to Review (Hours)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white font-medium"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {selectedPkg.addons && selectedPkg.addons.length > 0 && (
          <div>
            <label className="block text-sm font-bold uppercase mb-3">Optional Additions</label>
            <div className="space-y-2">
              {selectedPkg.addons.map(addon => {
                const addonPrice = currency === 'GBP' ? addon.priceGBP : addon.priceUSD;
                return (
                  <label key={addon.name} className="flex items-center gap-3 p-3 bg-black border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-500 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedAddons.includes(addon.name)}
                      onChange={() => toggleAddon(addon.name)}
                      className="w-5 h-5 rounded border-zinc-700 text-[#FFE600] focus:ring-[#FFE600] bg-zinc-900"
                    />
                    <span className="flex-1 font-medium">{addon.name}</span>
                    <span className="font-bold text-[#FFE600] text-sm">
                      {addonPrice === 0 ? 'Custom Quote' : `+${symbol}${addonPrice}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <label className="flex items-center gap-3 p-4 mb-6 bg-black border border-zinc-800 rounded-lg cursor-pointer hover:border-[#FFE600]/50 transition-colors">
            <input 
              type="checkbox" 
              checked={isRush}
              onChange={(e) => setIsRush(e.target.checked)}
              className="w-5 h-5 rounded border-zinc-700 text-[#FFE600] focus:ring-[#FFE600] bg-zinc-900"
            />
            <div className="flex-1">
              <span className="block font-bold">Rush Delivery (48 Hours)</span>
              <span className="block text-xs text-zinc-400">Adds 30% to total price</span>
            </div>
          </label>

          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">Subtotal:</span>
            <span className="text-lg font-medium">{symbol}{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center mb-2 text-green-400">
              <span className="text-lg font-bold">Bulk Discount ({(discount * 100).toFixed(0)}%):</span>
              <span className="text-lg font-medium">-{symbol}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
            <span className="text-2xl font-black uppercase">Estimated Total:</span>
            <span className="text-3xl font-black text-[#FFE600]">{symbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
