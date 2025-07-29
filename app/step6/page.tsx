"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { AIRevision } from "@/components/ai-revision"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, AlertCircle, MessageSquare, Target } from "lucide-react"
import type { DocumentTemplate } from "@/lib/types"

export default function Step6Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, feedback, analysisResults, setTemplate, setCurrentStep } =
    useProjectStore()

  const [revisedTemplate, setRevisedTemplate] = useState<DocumentTemplate | null>(null)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleRevisionComplete = (newTemplate: DocumentTemplate) => {
    setRevisedTemplate(newTemplate)
  }

  const handleNext = () => {
    if (!revisedTemplate) {
      alert("AI 수정이 완료되지 않았습니다. 먼저 수정을 진행해주세요.")
      return
    }

    // 수정된 템플릿을 저장 (디자인 정보도 함께 유지)
    const enhancedTemplate = {
      ...revisedTemplate,
      designTemplate: (template as any).designTemplate,
      logoFile: (template as any).logoFile,
    }

    setTemplate(enhancedTemplate)
    setCurrentStep(7)
    router.push("/step7")
  }

  const handlePrevious = () => {
    setCurrentStep(5)
    router.push("/step5")
  }

  const handleSkipRevision = () => {
    const confirm = window.confirm("AI 수정을 건너뛰고 원본 템플릿을 그대로 사용하시겠습니까?")
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

  const highPriorityCount = feedback.filter((f) => f.priority === "high").length
  const mediumPriorityCount = feedback.filter((f) => f.priority === "medium").length
  const lowPriorityCount = feedback.filter((f) => f.priority === "low").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">6단계: 수정 반영</h1>
          <p className="text-gray-600">
            5단계에서 제공해주신 피드백을 바탕으로 AI가 템플릿을 자동으로 개선합니다. 우선순위에 따라 단계별로 수정이
            진행됩니다.
          </p>
        </div>

        {/* 피드백 요약 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>총 피드백</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{feedback.length}개</div>
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

        {/* 피드백이 없는 경우 */}
        {feedback.length === 0 && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>수정 요청이 없습니다.</strong>
                </p>
                <p>
                  5단계에서 피드백을 추가하지 않으셨습니다. 현재 템플릿을 그대로 사용하거나, 이전 단계로 돌아가서 수정
                  요청을 추가할 수 있습니다.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* AI 수정 컴포넌트 */}
        {feedback.length > 0 && (
          <AIRevision
            originalTemplate={template}
            feedback={feedback}
            documentDetails={documentDetails}
            recipients={recipients}
            analysisResults={analysisResults}
            apiKey={apiKey}
            onRevisionComplete={handleRevisionComplete}
          />
        )}

        {/* API 키 없음 경고 */}
        {!apiKey && feedback.length > 0 && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              OpenAI API 키가 설정되지 않았습니다.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/step2")}>
                2단계로 돌아가서
              </Button>{" "}
              API 키를 설정해주세요.
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
                • <strong>7단계:</strong> 수정된 템플릿을 최종 확인하고 승인합니다
              </p>
              <p>
                • <strong>8단계:</strong> 모든 수신자별로 개인화된 문서를 PDF/이미지로 생성하고 다운로드합니다
              </p>
              <p>• 수정 결과가 만족스럽지 않다면 5단계로 돌아가서 추가 피드백을 제공할 수 있습니다</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (피드백 수정)
          </Button>
          <div className="flex space-x-2">
            {feedback.length > 0 && !revisedTemplate && (
              <Button variant="outline" onClick={handleSkipRevision}>
                수정 건너뛰기
              </Button>
            )}
            <Button onClick={handleNext} disabled={feedback.length > 0 && !revisedTemplate}>
              다음 단계 (최종 확인)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
