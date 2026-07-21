import { useState } from 'react';
import { PricingCard } from './components/PricingCard';
import { PortfolioGrid } from './components/PortfolioGrid';
import { PriceCalculator } from './components/PriceCalculator';
import { PricingPackage, PortfolioItem, Currency } from './types';

const PACKAGES: PricingPackage[] = [
  {
    id: 'long-base',
    title: 'Base Edit',
    basePriceGBP: 150,
    basePriceUSD: 200,
    additionalHourlyGBP: 30,
    additionalHourlyUSD: 40,
    type: 'long',
    features: [
      'Basic cuts',
      'Music',
      'Sound effects',
      'Minimal subtitles',
      'Standard editing',
      'Includes up to 2 hours of raw footage'
    ],
    addons: [
      {
        name: 'Narrative Editing',
        priceGBP: 250,
        priceUSD: 340,
        additionalHourlyGBP: 50,
        additionalHourlyUSD: 70,
        features: [
          'Story-focused editing',
          'Commentary videos',
          'Improving structure, pacing and flow'
        ]
      },
      {
        name: 'Personal Style',
        priceGBP: 400,
        priceUSD: 540,
        additionalHourlyGBP: 80,
        additionalHourlyUSD: 110,
        features: [
          'Visual comedy',
          'Creative decisions',
          'Higher-workload editing',
          'Applying my personal editing style'
        ]
      },
      {
        name: 'Retention Editing',
        priceGBP: 800,
        priceUSD: 1100,
        additionalHourlyGBP: 100,
        additionalHourlyUSD: 140,
        features: [
          'Strong pacing',
          'Strong hooks',
          'High-engagement video structure',
          'Retention-focused editing decisions'
        ]
      },
      {
        name: 'Complex Projects',
        priceGBP: 0,
        priceUSD: 0,
        features: [
          'Quoted individually based on project requirements.'
        ]
      }
    ]
  },
  {
    id: 'short-base',
    title: 'Base Edit',
    basePriceGBP: 20,
    basePriceUSD: 30,
    type: 'short',
    features: [
      'Basic cuts',
      'Music',
      'Sound effects',
      'Minimal captions',
      'Standard editing'
    ],
    addons: [
      {
        name: 'Narrative Editing',
        priceGBP: 30,
        priceUSD: 40,
        features: [
          'Story-focused editing',
          'Commentary',
          'Improving structure, pacing and flow'
        ]
      },
      {
        name: 'Personal Style',
        priceGBP: 80,
        priceUSD: 110,
        features: [
          'Visual comedy',
          'Creative decisions',
          'Higher-workload editing',
          'Applying my personal editing style'
        ]
      },
      {
        name: 'Retention Editing',
        priceGBP: 150,
        priceUSD: 200,
        features: [
          'Strong pacing',
          'Strong hooks',
          'High-engagement video structure',
          'Retention-focused editing decisions'
        ]
      },
      {
        name: 'Complex Projects',
        priceGBP: 0,
        priceUSD: 0,
        features: [
          'Quoted individually based on project requirements.'
        ]
      }
    ]
  }
];

const PORTFOLIO_LONG: PortfolioItem[] = [
  { id: 'pl1', title: 'LOADING', duration: '5:14', type: 'long', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'https://youtu.be/OGY_YoLLqHk?si=rC0vZUM3u9zyLIH5' },
  { id: 'pl2', title: 'LOADING', duration: '3:32', type: 'long', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'https://youtu.be/5ImTD5Zo-rE?si=x3eHZhFmIu8WNvbT' },
  { id: 'pl3', title: 'LOADING', duration: '0:19', type: 'long', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'https://youtu.be/fB0PwJQ5QdU?si=O90RgUtKp633O-Q1' },
  { id: 'pl4', title: 'LOADING', duration: '4:41', type: 'long', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'https://youtu.be/aAry60yy2cU?si=atuEBp9WUqjm0FOx' },
   { id: 'pl5', title: 'LOADING', duration: '4:41', type: 'long', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'https://youtu.be/9-MYXYN3dbU?si=Xwxu0LEESYVr2FDl' },
];

const PORTFOLIO_SHORT: PortfolioItem[] = [
  { id: 'ps1', title: 'Example Short 1', duration: '0:45', type: 'short', thumbnailUrl: 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg', videoUrl: 'LINK' },
];

export default function App() {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // List of timezones that generally use Dollar currencies (US, Canada, Australia, New Zealand, etc)
      if (tz.startsWith('America/') || tz.startsWith('Australia/') || tz.startsWith('Pacific/')) {
        return 'USD';
      }
    }
    return 'GBP';
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFE600] selection:text-black">
      <header className="py-6 px-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-black border-b border-zinc-800 max-w-7xl mx-auto">
        <img src="/logo.png" alt="Pufftopia" className="h-16 w-auto" />
        
        <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
          <button 
            onClick={() => setCurrency('GBP')}
            className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-wide transition-colors ${currency === 'GBP' ? 'bg-white text-black' : 'text-zinc-200 hover:text-white'}`}
          >
            GBP (£)
          </button>
          <button 
            onClick={() => setCurrency('USD')}
            className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-wide transition-colors ${currency === 'USD' ? 'bg-white text-black' : 'text-zinc-200 hover:text-white'}`}
          >
            USD ($)
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-20">
        <div className="mb-16 bg-zinc-900 border border-[#FFE600]/30 rounded-2xl p-6 text-center max-w-3xl mx-auto shadow-[0_0_20px_rgba(255,230,0,0.05)]">
          <h2 className="text-xl font-black uppercase text-[#FFE600] mb-2">
            Pricing Notice
          </h2>
          <p className="font-medium text-white/90">
            Please note that all prices listed below are not final and can always be negotiated based on your specific project needs.
          </p>
        </div>

        <div className="space-y-32">
          {/* Long Form Section */}
          <section id="long-form">
            <h2 className="text-3xl font-black uppercase text-center text-white mb-12 tracking-wide">
              Long Form Editing
            </h2>
            <div className="grid md:grid-cols-1 max-w-2xl mx-auto gap-8 mb-16">
              {PACKAGES.filter(p => p.type === 'long').map(pkg => (
                <PricingCard key={pkg.id} pkg={pkg} currency={currency} />
              ))}
            </div>
            
            <div className="mb-16">
              <PriceCalculator packages={PACKAGES.filter(p => p.type === 'long')} currency={currency} type="long" />
            </div>

            <div className="bg-black p-8 rounded-3xl border border-zinc-800">
              <h3 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-wide">Long Form Portfolio</h3>
              <PortfolioGrid items={PORTFOLIO_LONG} type="long" />
            </div>
          </section>

          {/* Short Form Section */}
          <section id="short-form">
            <h2 className="text-3xl font-black uppercase text-center text-white mb-12 tracking-wide">
              Short Form Editing
            </h2>
            
            <div className="mb-12 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 max-w-2xl mx-auto text-center">
              <h4 className="font-black text-white mb-3 uppercase tracking-wide">Bulk Discounts</h4>
              <p className="text-sm text-white mb-4">Applies when multiple shorts are ordered together. Calculated after adding any optional additions.</p>
              <div className="flex justify-center gap-6 font-bold text-[#FFE600] text-sm">
                <span>5+ Shorts: 5% off</span>
                <span>10+ Shorts: 10% off</span>
                <span>20+ Shorts: 15% off</span>
              </div>
            </div>

            <div className="grid md:grid-cols-1 max-w-2xl mx-auto gap-8 mb-16">
              {PACKAGES.filter(p => p.type === 'short').map(pkg => (
                <PricingCard key={pkg.id} pkg={pkg} currency={currency} />
              ))}
            </div>

            <div className="mb-16">
              <PriceCalculator packages={PACKAGES.filter(p => p.type === 'short')} currency={currency} type="short" />
            </div>

            <div className="bg-black p-8 rounded-3xl border border-zinc-800">
              <h3 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-wide">Short Form Portfolio</h3>
              <PortfolioGrid items={PORTFOLIO_SHORT} type="short" />
            </div>
          </section>

          {/* Post Editing & Extras */}
          <section id="extras" className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase text-center text-white mb-12 tracking-wide">
              Post Editing & Extras
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-xl font-black uppercase text-[#FFE600] mb-6">Revisions</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-2">Minor Revisions</h4>
                    <p className="text-sm text-zinc-300">Free. Includes fixing mistakes, editing text, swapping songs, trimming clips, moving something slightly.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Additional Revision Rounds</h4>
                    <p className="text-sm text-zinc-300">{currency === 'GBP' ? '£15' : '$20'} per round (one consolidated list of requested changes).</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Major Revisions</h4>
                    <p className="text-sm text-zinc-300">{currency === 'GBP' ? '£35+' : '$50+'}. Includes re-editing significant portions, adding new footage, large structural changes.</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-xl font-black uppercase text-[#FFE600] mb-6">Extras & Project Scope</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-2">Disorganised Files</h4>
                    <p className="text-sm text-zinc-300">May receive a {currency === 'GBP' ? '£15' : '$20'} inconvenience fee. Additional fees may apply if significant organisation is required.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Project Scope</h4>
                    <p className="text-sm text-zinc-300">Pricing may vary depending on project requirements. A final quote will always be provided before work begins.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-black border-t border-zinc-800 py-12 text-center">
        <p className="font-bold text-zinc-500 uppercase text-xs tracking-wider">
          &copy; {new Date().getFullYear()} Studio Pufftopia
        </p>
      </footer>
    </div>
  );
}
