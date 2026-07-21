import { useState } from 'react';

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Redirecting to payment gateway...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black p-4 font-sans text-white pt-16">
      <div className="max-w-lg mx-auto bg-black rounded-3xl p-8 border border-zinc-800 relative overflow-hidden">
        <button 
          onClick={onBack}
          className="mb-8 text-zinc-400 hover:text-white font-bold tracking-wide uppercase text-xs inline-block transition-colors"
        >
          &lt; GO BACK
        </button>

        <h1 className="text-3xl font-black uppercase text-white mb-4">
          Checkout
        </h1>
        <p className="mb-8 font-medium text-zinc-400 text-sm">
          You will be redirected to the secure payment portal to finalize your booking.
        </p>

        <div className="bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-800">
          <ul className="space-y-4 font-bold text-white text-sm">
            <li className="flex items-center gap-3">
              <span className="text-zinc-500">•</span> Secure SSL Connection
            </li>
            <li className="flex items-center gap-3">
              <span className="text-zinc-500">•</span> Guaranteed Delivery Timeline
            </li>
            <li className="flex items-center gap-3">
              <span className="text-zinc-500">•</span> Satisfaction Guaranteed
            </li>
          </ul>
        </div>

        <button 
          disabled={isProcessing}
          className="w-full py-4 rounded-full bg-white text-black font-black uppercase tracking-wider text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          onClick={handlePayment}
        >
          {isProcessing ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
        </button>
      </div>
    </div>
  );
}
