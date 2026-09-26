import { Check } from "lucide-react";

interface Step {
  step: number;
  label: string;
}

interface StepNavProps {
  steps: Step[];
  currentStep: number;
}

/**
 * StepNav — pills ด้านบน + วงกลม step พร้อมเส้นเชื่อม ใช้ร่วมกันทุกหน้า
 * (Login, Forgot/Reset password, Register)
 *
 * props:
 * - steps: [{ step: number, label: string }]  รายการ step ทั้งหมดของ flow นั้นๆ
 * - currentStep: number  step ปัจจุบัน (ใช้ตัดสินสี active/completed/pending)
 */
export default function StepNav({ steps, currentStep }: StepNavProps) {
  return (
    <>
      {/* pills ด้านบนสุด */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {steps.map(({ step, label }) => {
          const isActive = step === currentStep;
          return (
            <span
              key={step}
              className={`rounded-full border px-3 py-1 text-sm ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* วงกลม step + เส้นเชื่อม ด้านในการ์ด */}
      <div className="mb-6 flex items-center justify-center">
        {steps.map(({ step }, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : step}
              </div>
              {!isLast && <div className="mx-1 h-px w-6 bg-gray-300" />}
            </div>
          );
        })}
      </div>
    </>
  );
}