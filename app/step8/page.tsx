"use client"

import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { FileGeneration } from "@/components/file-generation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Users, Palette, Download, Home, RefreshCw } from "lucide-react"

export default function Step8Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, isCompleted, reset, setCurrentStep } = useProjectStore()

  const handlePrevious = () => {
    setCurrentStep(7)
    router.push("/step7")
  }

  const handleStartNew = () => {
    const confirm = window.confirm("새 프로젝트를 시작하면 현재 작업이 모두 초기화됩니다. 계속하시겠습니까?")
    if (confirm) {
      reset()
      router.push("/")
    }
  }

  const handleGoHome = () => {
    router.push("/")
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

  if (!isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              템플릿이 아직 승인되지 않았습니다.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/step7")}>
                7단계로 돌아가서
              </Button>{" "}
              먼저 템플릿을 승인해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const designTemplate = (template as any).designTemplate
  const logoFile = (template as any).logoFile

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">8단계: 파일 생성</h1>
          <p className="text-gray-600">
            승인된 템플릿으로 모든 수신자별 개인화된 문서를 생성합니다. PDF, PNG, JPG 형식 중 선택하여 다운로드할 수
            있습니다.
          </p>
        </div>

        {/* 프로젝트 완료 상태 */}
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>🎉 프로젝트가 성공적으로 완료되었습니다!</strong>
                <br />
                이제 {recipients.length}명의 수신자별로 개인화된 문서를 생성하고 다운로드할 수 있습니다.
              </div>
              <Badge variant="default" className="bg-green-500">
                완료
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* 최종 프로젝트 요약 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
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
                <span>문서</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">{documentDetails?.title || "초청장"}</div>
              <div className="text-xs text-gray-500 mt-1">{documentDetails?.organizer || "주최자"}</div>
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
              <div className="text-xs text-gray-500 mt-1">
                {designTemplate?.category || "표준"} • {logoFile ? "로고 포함" : "로고 없음"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>다운로드</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">준비됨</div>
              <div className="text-xs text-gray-500 mt-1">PDF/PNG/JPG</div>
            </CardContent>
          </Card>
        </div>

        {/* 파일 생성 컴포넌트 */}
        <FileGeneration
          template={template}
          designTemplate={designTemplate}
          recipients={recipients}
          logoUrl={logoFile?.url}
        />

        {/* 프로젝트 완료 안내 */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 프로젝트 완료!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-green-700">
              <p>
                <strong>축하합니다!</strong> AI 문서 발송 서비스를 통해 성공적으로 개인화된 문서를 생성했습니다.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium mb-2">✅ 완료된 작업:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>{recipients.length}명의 수신자 정보 입력</li>
                    <li>행사 정보 및 참고 자료 업로드</li>
                    <li>AI 기반 맞춤형 템플릿 생성</li>
                    <li>디자인 템플릿 및 로고 적용</li>
                    <li>사용자 피드백 반영 및 개선</li>
                    <li>최종 승인 및 파일 생성 준비</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">📋 다음 단계 제안:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>생성된 파일을 이메일로 발송</li>
                    <li>웹사이트나 소셜미디어에 공유</li>
                    <li>인쇄하여 오프라인 배포</li>
                    <li>참석 확인 시스템 구축</li>
                    <li>후속 안내문 발송 계획</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (최종 승인)
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Button>
            <Button onClick={handleStartNew} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />새 프로젝트 시작
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
