"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { FeedbackForm } from "@/components/feedback-form"
import { FeedbackPreview } from "@/components/feedback-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowLeft, MessageSquare, Eye, AlertCircle, CheckCircle, Lightbulb, Target } from "lucide-react"
import type { FeedbackItem } from "@/lib/types"

export default function Step5Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, feedback, addFeedback, clearFeedback, setCurrentStep } =
    useProjectStore()

  const [localFeedback, setLocalFeedback] = useState<FeedbackItem[]>(feedback)
  const [activeTab, setActiveTab] = useState("form")

  const handleFeedbackAdd = (newFeedback: FeedbackItem) => {
    const updatedFeedback = [...localFeedback, newFeedback]
    setLocalFeedback(updatedFeedback)
    addFeedback(newFeedback)
  }

  const handleFeedbackRemove = (index: number) => {
    const updatedFeedback = localFeedback.filter((_, i) => i !== index)
    setLocalFeedback(updatedFeedback)
    // 스토어의 피드백도 업데이트
    clearFeedback()
    updatedFeedback.forEach((fb) => addFeedback(fb))
  }

  const handleNext = () => {
    if (localFeedback.length === 0) {
      const confirm = window.confirm(
        "수정 요청이 없습니다. 현재 템플릿을 그대로 사용하시겠습니까?\n\n'취소'를 누르면 수정 요청을 추가할 수 있습니다.",
      )
      if (!confirm) return
    }

    setCurrentStep(6)
    router.push("/step6")
  }

  const handlePrevious = () => {
    setCurrentStep(4)
    router.push("/step4")
  }

  const handleSkip = () => {
    const confirm = window.confirm(
      "수정 없이 바로 최종 단계로 이동하시겠습니까?\n현재 템플릿을 그대로 사용하여 파일을 생성합니다.",
    )
    if (confirm) {
      setCurrentStep(7)
      router.push("/step7")
    }
  }

  // 필수 데이터 체크
  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              템플릿 정보가 없습니다.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/step3")}>
                3단계로 돌아가서
              </Button>{" "}
              템플릿을 먼저 생성해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (recipients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              수신자 정보가 없습니다.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/step1")}>
                1단계로 돌아가서
              </Button>{" "}
              수신자를 먼저 추가해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const designTemplate = (template as any).designTemplate
  const logoFile = (template as any).logoFile

  const highPriorityCount = localFeedback.filter((f) => f.priority === "high").length
  const mediumPriorityCount = localFeedback.filter((f) => f.priority === "medium").length
  const lowPriorityCount = localFeedback.filter((f) => f.priority === "low").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">5단계: 수정 지시</h1>
          <p className="text-gray-600">
            4단계에서 확인한 미리보기를 바탕으로 수정하고 싶은 부분에 대한 구체적인 피드백을 제공해주세요. AI가 이를
            바탕으로 템플릿을 개선합니다.
          </p>
        </div>

        {/* 현재 상태 요약 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>총 피드백</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{localFeedback.length}개</div>
              <div className="text-xs text-gray-500 mt-1">수정 요청</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Target className="w-4 h-4 text-red-500" />
                <span>높은 우선순위</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriorityCount}개</div>
              <div className="text-xs text-gray-500 mt-1">필수 수정</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Target className="w-4 h-4 text-yellow-500" />
                <span>보통 우선순위</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityCount}개</div>
              <div className="text-xs text-gray-500 mt-1">개선 사항</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span>낮은 우선순위</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{lowPriorityCount}개</div>
              <div className="text-xs text-gray-500 mt-1">선택 사항</div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 인터페이스 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>피드백 작성</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>미리보기 + 피드백</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <FeedbackForm
              onFeedbackAdd={handleFeedbackAdd}
              existingFeedback={localFeedback}
              onFeedbackRemove={handleFeedbackRemove}
            />
          </TabsContent>

          <TabsContent value="preview">
            {designTemplate ? (
              <FeedbackPreview
                template={template}
                designTemplate={designTemplate}
                logoUrl={logoFile?.url}
                recipients={recipients}
                feedback={localFeedback}
              />
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>디자인 템플릿 정보가 없습니다.</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {/* 상태별 안내 메시지 */}
        {localFeedback.length === 0 ? (
          <Alert className="mt-8">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>아직 수정 요청이 없습니다.</strong>
                </p>
                <p>
                  4단계에서 확인한 미리보기에서 수정하고 싶은 부분이 있다면 위의 "피드백 작성" 탭에서 구체적인 수정
                  지시사항을 추가해주세요.
                </p>
                <p>현재 템플릿이 만족스럽다면 수정 없이 다음 단계로 진행할 수 있습니다.</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>{localFeedback.length}개의 수정 요청이 준비되었습니다!</strong>
                </p>
                <p>
                  다음 단계에서 AI가 이 피드백을 바탕으로 템플릿을 개선합니다. 높은 우선순위({highPriorityCount}개)
                  항목부터 우선적으로 처리됩니다.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 다음 단계 안내 */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">다음 단계 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                • <strong>6단계:</strong> AI가 제공된 피드백을 바탕으로 템플릿을 자동으로 수정합니다
              </p>
              <p>
                • <strong>7단계:</strong> 수정된 템플릿을 최종 확인하고 승인합니다
              </p>
              <p>
                • <strong>8단계:</strong> 모든 수신자별로 개인화된 문서를 PDF/이미지로 생성하고 다운로드합니다
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (미리보기)
          </Button>
          <div className="flex space-x-2">
            {localFeedback.length > 0 && (
              <Button variant="outline" onClick={handleSkip}>
                수정 없이 완료
              </Button>
            )}
            <Button onClick={handleNext}>
              {localFeedback.length > 0 ? "다음 단계 (AI 수정 적용)" : "수정 없이 다음 단계"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
