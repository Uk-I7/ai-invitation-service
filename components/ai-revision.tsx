"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, CheckCircle, AlertTriangle, RefreshCw, Target, Clock } from "lucide-react"
import type { DocumentTemplate, FeedbackItem } from "@/lib/types"

interface AIRevisionProps {
  originalTemplate: DocumentTemplate
  feedback: FeedbackItem[]
  documentDetails: any
  recipients: any[]
  analysisResults: any[]
  apiKey: string
  onRevisionComplete: (revisedTemplate: DocumentTemplate) => void
}

interface RevisionStep {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  feedback?: FeedbackItem[]
  result?: string
}

export function AIRevision({
  originalTemplate,
  feedback,
  documentDetails,
  recipients,
  analysisResults,
  apiKey,
  onRevisionComplete,
}: AIRevisionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [revisedTemplate, setRevisedTemplate] = useState<DocumentTemplate | null>(null)
  const [error, setError] = useState("")
  const [revisionSteps, setRevisionSteps] = useState<RevisionStep[]>([])

  // 피드백을 우선순위와 섹션별로 그룹화
  const groupFeedbackByPriority = () => {
    const highPriority = feedback.filter((f) => f.priority === "high")
    const mediumPriority = feedback.filter((f) => f.priority === "medium")
    const lowPriority = feedback.filter((f) => f.priority === "low")

    const steps: RevisionStep[] = []

    if (highPriority.length > 0) {
      steps.push({
        id: "high-priority",
        title: "높은 우선순위 수정",
        description: `${highPriority.length}개의 필수 수정사항 적용`,
        status: "pending",
        feedback: highPriority,
      })
    }

    if (mediumPriority.length > 0) {
      steps.push({
        id: "medium-priority",
        title: "보통 우선순위 수정",
        description: `${mediumPriority.length}개의 개선사항 적용`,
        status: "pending",
        feedback: mediumPriority,
      })
    }

    if (lowPriority.length > 0) {
      steps.push({
        id: "low-priority",
        title: "낮은 우선순위 수정",
        description: `${lowPriority.length}개의 선택사항 적용`,
        status: "pending",
        feedback: lowPriority,
      })
    }

    steps.push({
      id: "final-review",
      title: "최종 검토 및 정리",
      description: "전체 템플릿 일관성 검토 및 최적화",
      status: "pending",
    })

    return steps
  }

  const startRevision = async () => {
    if (!apiKey) {
      setError("API 키가 필요합니다.")
      return
    }

    setIsProcessing(true)
    setError("")
    setCurrentStep(0)

    const steps = groupFeedbackByPriority()
    setRevisionSteps(steps)

    try {
      // 각 단계별로 순차 처리
      let currentTemplate = originalTemplate

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        setRevisionSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "processing" } : step)))

        // 단계별 지연 시간 (사용자 경험 개선)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (steps[i].feedback && steps[i].feedback!.length > 0) {
          // 해당 우선순위의 피드백만 적용
          const stepFeedback = steps[i].feedback!
          const revisedTemplate = await applyFeedbackToTemplate(
            currentTemplate,
            stepFeedback,
            documentDetails,
            recipients,
            analysisResults,
            apiKey,
          )

          currentTemplate = revisedTemplate

          setRevisionSteps((prev) =>
            prev.map((step, index) =>
              index === i
                ? {
                    ...step,
                    status: "completed",
                    result: `${stepFeedback.length}개 수정사항 적용 완료`,
                  }
                : step,
            ),
          )
        } else {
          // 최종 검토 단계
          const finalTemplate = await finalizeTemplate(currentTemplate, apiKey)
          currentTemplate = finalTemplate

          setRevisionSteps((prev) =>
            prev.map((step, index) =>
              index === i
                ? {
                    ...step,
                    status: "completed",
                    result: "최종 검토 및 정리 완료",
                  }
                : step,
            ),
          )
        }
      }

      setRevisedTemplate(currentTemplate)
      onRevisionComplete(currentTemplate)
    } catch (error) {
      console.error("수정 처리 오류:", error)
      setError(`수정 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)

      setRevisionSteps((prev) =>
        prev.map((step, index) => (index === currentStep ? { ...step, status: "error" } : step)),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const applyFeedbackToTemplate = async (
    template: DocumentTemplate,
    feedbackItems: FeedbackItem[],
    documentDetails: any,
    recipients: any[],
    analysisResults: any[],
    apiKey: string,
  ): Promise<DocumentTemplate> => {
    const { generateText } = await import("ai")
    const { createOpenAI } = await import("@ai-sdk/openai")

    const openai = createOpenAI({ apiKey })

    // 피드백을 섹션별로 그룹화
    const feedbackBySection = feedbackItems.reduce(
      (acc, item) => {
        if (!acc[item.section]) acc[item.section] = []
        acc[item.section].push(item.instruction)
        return acc
      },
      {} as Record<string, string[]>,
    )

    const feedbackPrompt = Object.entries(feedbackBySection)
      .map(
        ([section, instructions]) =>
          `${section.toUpperCase()} 섹션 수정사항:\n${instructions.map((inst, i) => `${i + 1}. ${inst}`).join("\n")}`,
      )
      .join("\n\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 문서 템플릿을 사용자 피드백에 따라 수정해주세요. 순수한 JSON 형태로만 응답하세요.

현재 템플릿:
- 헤더: ${template.header}
- 본문: ${template.body}
- 푸터: ${template.footer}
- CTA: ${template.cta || "없음"}

사용자 피드백:
${feedbackPrompt}

문서 정보:
- 제목: ${documentDetails.title}
- 주최자: ${documentDetails.organizer}
- 날짜: ${documentDetails.date}

수정 지침:
1. 사용자의 피드백을 정확히 반영하세요
2. 기존 템플릿의 좋은 부분은 유지하세요
3. 전체적인 일관성을 유지하세요
4. {{name}}, {{organization}} 등의 플레이스홀더는 그대로 유지하세요

응답 형식 (순수 JSON만):
{"header":"수정된 헤더","body":"수정된 본문","footer":"수정된 푸터","cta":"수정된 CTA","style":{"tone":"formal","color":"기존 색상","layout":"기존 레이아웃"}}`,
    })

    try {
      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const revisedTemplate = JSON.parse(jsonText)
      return {
        ...template,
        ...revisedTemplate,
      }
    } catch (error) {
      console.error("JSON 파싱 오류:", error)
      return template // 오류 시 원본 반환
    }
  }

  const finalizeTemplate = async (template: DocumentTemplate, apiKey: string): Promise<DocumentTemplate> => {
    const { generateText } = await import("ai")
    const { createOpenAI } = await import("@ai-sdk/openai")

    const openai = createOpenAI({ apiKey })

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 문서 템플릿의 최종 검토를 수행하고 필요시 미세 조정해주세요. 순수한 JSON 형태로만 응답하세요.

현재 템플릿:
- 헤더: ${template.header}
- 본문: ${template.body}
- 푸터: ${template.footer}
- CTA: ${template.cta || "없음"}

최종 검토 사항:
1. 전체적인 톤의 일관성 확인
2. 문법 및 맞춤법 검토
3. 문장의 자연스러움 개선
4. 플레이스홀더 정확성 확인

응답 형식 (순수 JSON만):
{"header":"최종 헤더","body":"최종 본문","footer":"최종 푸터","cta":"최종 CTA","style":{"tone":"${template.style?.tone || "formal"}","color":"기존 색상","layout":"기존 레이아웃"}}`,
    })

    try {
      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      }

      const finalTemplate = JSON.parse(jsonText)
      return {
        ...template,
        ...finalTemplate,
      }
    } catch (error) {
      console.error("최종 검토 오류:", error)
      return template
    }
  }

  const getStepIcon = (status: RevisionStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getProgressPercentage = () => {
    if (revisionSteps.length === 0) return 0
    const completedSteps = revisionSteps.filter((step) => step.status === "completed").length
    return (completedSteps / revisionSteps.length) * 100
  }

  return (
    <div className="space-y-6">
      {/* 수정 시작 버튼 */}
      {!isProcessing && !revisedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>AI 자동 수정 시작</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="mb-4">
                <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {feedback.length}개의 피드백을 바탕으로 템플릿을 개선합니다
                </h3>
                <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-red-500" />
                    <span>높음: {feedback.filter((f) => f.priority === "high").length}개</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-yellow-500" />
                    <span>보통: {feedback.filter((f) => f.priority === "medium").length}개</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>낮음: {feedback.filter((f) => f.priority === "low").length}개</span>
                  </div>
                </div>
              </div>

              <Button onClick={startRevision} disabled={!apiKey} size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                AI 수정 시작하기
              </Button>

              {!apiKey && <p className="text-sm text-red-600 mt-2">API 키가 설정되지 않았습니다.</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 진행 상황 표시 */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI 수정 진행 중...</span>
              </div>
              <Badge variant="outline">{Math.round(getProgressPercentage())}% 완료</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="mb-4" />

            <div className="space-y-3">
              {revisionSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    index === currentStep ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                  }`}
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-gray-600">{step.description}</div>
                    {step.result && <div className="text-xs text-green-600 mt-1">✓ {step.result}</div>}
                  </div>
                  {step.feedback && (
                    <Badge variant="outline" className="text-xs">
                      {step.feedback.length}개 항목
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 수정 완료 결과 */}
      {revisedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>AI 수정 완료!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{feedback.length}개의 피드백이 성공적으로 적용되었습니다!</strong>
                <br />
                아래에서 수정 전후를 비교하고 최종 결과를 확인하세요.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comparison">수정 전후 비교</TabsTrigger>
                <TabsTrigger value="final">최종 결과</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-600">수정 전 (원본)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong>헤더:</strong>
                        <div className="p-2 bg-gray-50 rounded mt-1">{originalTemplate.header}</div>
                      </div>
                      <div>
                        <strong>본문:</strong>
                        <div className="p-2 bg-gray-50 rounded mt-1 whitespace-pre-line">{originalTemplate.body}</div>
                      </div>
                      <div>
                        <strong>푸터:</strong>
                        <div className="p-2 bg-gray-50 rounded mt-1">{originalTemplate.footer}</div>
                      </div>
                      {originalTemplate.cta && (
                        <div>
                          <strong>CTA:</strong>
                          <div className="p-2 bg-gray-50 rounded mt-1">{originalTemplate.cta}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm text-green-600">수정 후 (개선됨)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong>헤더:</strong>
                        <div className="p-2 bg-green-50 rounded mt-1">{revisedTemplate.header}</div>
                      </div>
                      <div>
                        <strong>본문:</strong>
                        <div className="p-2 bg-green-50 rounded mt-1 whitespace-pre-line">{revisedTemplate.body}</div>
                      </div>
                      <div>
                        <strong>푸터:</strong>
                        <div className="p-2 bg-green-50 rounded mt-1">{revisedTemplate.footer}</div>
                      </div>
                      {revisedTemplate.cta && (
                        <div>
                          <strong>CTA:</strong>
                          <div className="p-2 bg-green-50 rounded mt-1">{revisedTemplate.cta}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="final">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">✅ 최종 수정된 템플릿</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">📝 헤더 (인사말)</h4>
                      <div className="p-3 bg-blue-50 rounded-lg text-sm">{revisedTemplate.header}</div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">📄 본문</h4>
                      <div className="p-3 bg-green-50 rounded-lg text-sm whitespace-pre-line">
                        {revisedTemplate.body}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">🔚 푸터 (마무리)</h4>
                      <div className="p-3 bg-purple-50 rounded-lg text-sm">{revisedTemplate.footer}</div>
                    </div>

                    {revisedTemplate.cta && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">📢 행동 유도 문구</h4>
                        <div className="p-3 bg-orange-50 rounded-lg text-sm">{revisedTemplate.cta}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 오류 표시 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 재시도 버튼 */}
      {error && (
        <div className="text-center">
          <Button onClick={startRevision} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </div>
      )}
    </div>
  )
}
