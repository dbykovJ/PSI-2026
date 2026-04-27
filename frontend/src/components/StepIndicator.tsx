import type { ReservationStep } from '../types';

const STEPS: { key: ReservationStep; label: string; icon: string }[] = [
  { key: 'dates', label: 'Dates & Room', icon: 'calendar_today' },
  { key: 'services', label: 'Services', icon: 'room_service' },
  { key: 'summary', label: 'Summary', icon: 'receipt_long' },
  { key: 'payment', label: 'Payment', icon: 'credit_card' },
  { key: 'confirmation', label: 'Confirmed', icon: 'check_circle' },
];

interface Props {
  current: ReservationStep;
}

export default function StepIndicator({ current }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone ? 'step-done' : isActive ? 'step-active' : 'step-pending'
                  }`}
                >
                  {isDone ? (
                    <span className="material-icons text-sm">check</span>
                  ) : (
                    <span className="material-icons text-sm">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium hidden sm:block ${
                    isActive ? 'text-hotel-accent' : isDone ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 sm:w-20 mx-1 transition-all duration-300 ${
                    i < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
