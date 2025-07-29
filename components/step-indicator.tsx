"use client"

import { useProjectStore } from "@/lib/store"
import { CheckCircle, ArrowRight } from "lucide-react"

const steps = [
  { id: 1, title: "수신자 정보", description: "명단 입력" },
  { id: 2, title: "발송 업무", description: "문서 정보" }, // "업무 설명" → "발송 업무"
  { id: 3, title: "양식 생성", description: "AI 템플릿" },
  { id: 4, title: "샘플 확인", description: "미리보기" },
  { id: 5, title: "수정 지시", description: "피드백" },
  { id: 6, title: "수정 반영", description: "재생성" },
  { id: 7, title: "확정", description: "최종 승인" },
  { id: 8, title: "파일 생성", description: "다운로드" },
]

export function StepIndicator() {
  const currentStep = useProjectStore((state) => state.currentStep)

  return (
    <div className="w-full py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    step.id < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
                    {step.title}
                  </div>
                  <div className={`text-xs ${step.id <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 mx-4 mt-[-2rem]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
