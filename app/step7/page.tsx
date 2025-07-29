"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { FinalTemplatePreview } from "@/components/final-template-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Edit,
  FileText,
  Users,
  Palette,
  MessageSquare,
  Sparkles,
} from "lucide-react"

export default function Step7Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, feedback, setCompleted, setCurrentStep } = useProjectStore()

  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = () => {
    setIsApproved(true)
    setCompleted(true)
  }

  const handleNext = () => {
    if (!isApproved) {
      const confirm = window.confirm("템플릿을 최종 승인하지 않았습니다. 승인하고 다음 단계로 진행하시겠습니까?")
      if (confirm) {
        handleApprove()
      } else {
        return
      }
    }

    setCurrentStep(8)
    router.push("/step8")
  }

  const handlePrevious = () => {
    setCurrentStep(6)
    router.push("/step6")
  }

  const handleEditTemplate = () => {
    setCurrentStep(5)
    router.push("/step5")
  }

  const handleRegenerateTemplate = () => {
    setCurrentStep(3)
    router.push("/step3")
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

  const highPriorityCount = feedback.filter((f) => f.priority === "high").length
  const mediumPriorityCount = feedback.filter((f) => f.priority === "medium").length
  const lowPriorityCount = feedback.filter((f) => f.priority === "low").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">7단계: 확정</h1>
          <p className="text-gray-600">
            최종 완성된 템플릿을 확인하고 승인해주세요. 승인 후에는 모든 수신자별로 개인화된 문서를 생성할 수 있습니다.
          </p>
        </div>

        {/* 승인 상태 표시 */}
        {isApproved ? (
          <Alert className="mb-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>✅ 템플릿이 최종 승인되었습니다!</strong>
                  <br />
                  이제 {recipients.length}명의 수신자별로 개인화된 문서를 생성할 수 있습니다.
                </div>
                <Badge variant="default" className="bg-green-500">
                  승인 완료
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>최종 검토가 필요합니다.</strong>
                  <br />
                  아래 미리보기를 확인하고 템플릿을 승인해주세요.
                </div>
                <Badge variant="outline">승인 대기</Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 프로젝트 요약 통계 */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>수신자</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{recipients.length}명</div>
              <div className="text-xs text-gray-500 mt-1">
                {[...new Set(recipients.map((r) => r.organization))].length}개 기관
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>문서 길이</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(template.header + template.body + template.footer).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">글자 수</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>디자인</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">{designTemplate?.name || "기본"}</div>
              <div className="text-xs text-gray-500 mt-1">{designTemplate?.category || "표준"} 스타일</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>피드백</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{feedback.length}개</div>
              <div className="text-xs text-gray-500 mt-1">
                {highPriorityCount > 0 && `${highPriorityCount}개 높음`}
                {mediumPriorityCount > 0 && ` ${mediumPriorityCount}개 보통`}
                {lowPriorityCount > 0 && ` ${lowPriorityCount}개 낮음`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isApproved ? "text-green-600" : "text-yellow-600"}`}>
                {isApproved ? "완료" : "대기"}
              </div>
              <div className="text-xs text-gray-500 mt-1">{isApproved ? "승인됨" : "검토 중"}</div>
            </CardContent>
          </Card>
        </div>

        {/* 최종 미리보기 */}
        <FinalTemplatePreview
          template={template}
          designTemplate={designTemplate}
          logoUrl={logoFile?.url}
          recipients={recipients}
          documentDetails={documentDetails}
        />

        {/* 승인 및 수정 버튼 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>최종 승인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>승인 전 체크리스트:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>디자인과 색상이 적절한가요?</li>
                  <li>텍스트 내용이 정확하고 적절한가요?</li>
                  <li>수신자 정보가 올바르게 표시되나요?</li>
                  <li>연락처와 행사 정보가 정확한가요?</li>
                  <li>전체적인 톤과 스타일이 만족스러운가요?</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                {!isApproved && (
                  <Button onClick={handleApprove} size="lg" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    최종 승인하기
                  </Button>
                )}

                <Button variant="outline" onClick={handleEditTemplate}>
                  <Edit className="w-4 h-4 mr-2" />
                  피드백 추가/수정
                </Button>

                <Button variant="outline" onClick={handleRegenerateTemplate}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  템플릿 재생성
                </Button>
              </div>

              {isApproved && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">승인 완료!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    다음 단계에서 {recipients.length}명의 수신자별로 개인화된 PDF/이미지 파일을 생성할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 안내 */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">다음 단계 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                • <strong>8단계:</strong> 승인된 템플릿으로 모든 수신자별 개인화된 문서를 PDF/이미지로 생성
              </p>
              <p>• 각 수신자의 이름, 소속, 직책 등이 자동으로 적용된 문서가 생성됩니다</p>
              <p>• 생성된 파일들을 ZIP으로 다운로드하거나 개별 다운로드할 수 있습니다</p>
              <p>• 이메일 발송을 위한 파일 목록도 제공됩니다</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (수정 반영)
          </Button>
          <Button onClick={handleNext} disabled={!isApproved} size="lg">
            다음 단계 (파일 생성)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
