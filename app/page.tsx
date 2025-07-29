"use client"

import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { useAdminStore } from "@/lib/admin-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Users,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Building,
  ImageIcon,
  Palette,
  ArrowRight,
  Info,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { reset, currentStep, recipients, documentDetails, template } = useProjectStore()
  const { isConfigured, apiKey, organizationName, logoFile, defaultDesignTemplate } = useAdminStore()

  const handleStartProject = () => {
    reset() // 이전 프로젝트 데이터 초기화
    router.push("/step1")
  }

  const handleContinueProject = () => {
    router.push(`/step${currentStep}`)
  }

  const handleAdminSettings = () => {
    router.push("/admin")
  }

  const hasProgress = recipients.length > 0 || documentDetails || template

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI 초청장 서비스</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">AI가 도와주는 스마트한 문서 생성 플랫폼</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            수신자 정보를 입력하고 이벤트 세부사항을 제공하면, AI가 개인화된 초청장을 자동으로 생성합니다. 다양한 디자인
            템플릿과 함께 전문적인 문서를 쉽게 만들어보세요.
          </p>
        </div>

        {/* 진행 중인 프로젝트 */}
        {hasProgress && (
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>진행 중인 프로젝트가 있습니다. (Step {currentStep})</span>
                <Button variant="outline" size="sm" onClick={handleContinueProject}>
                  계속하기
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 관리자 설정 상태 (선택사항) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>관리자 설정 (선택사항)</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleAdminSettings}>
                <Settings className="w-4 h-4 mr-2" />
                설정 관리
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConfigured ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    관리자 설정이 완료되었습니다. 모든 기능을 편리하게 사용할 수 있습니다.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Key className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">API 키</p>
                      <p className="text-sm text-green-600">설정 완료</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Building className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">기관 정보</p>
                      <p className="text-sm text-green-600">{organizationName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">로고</p>
                      <p className="text-sm text-green-600">{logoFile ? "업로드 완료" : "미설정"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Palette className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">기본 템플릿</p>
                      <p className="text-sm text-green-600">설정 완료</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  관리자 설정을 하면 더 편리하게 사용할 수 있습니다.
                  <Button variant="link" className="p-0 h-auto ml-1" onClick={handleAdminSettings}>
                    설정 페이지
                  </Button>
                  에서 API 키와 기관 정보를 미리 등록해보세요.
                  <br />
                  <span className="text-sm text-gray-600 mt-1 block">
                    • API 키가 없으면 첨부파일 AI 분석 기능을 사용할 수 없습니다
                    <br />• 기관 로고와 정보를 미리 설정하면 매번 입력할 필요가 없습니다
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 주요 기능 소개 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>수신자 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">CSV 파일 업로드 또는 직접 입력으로 수신자 정보를 쉽게 관리하세요.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>AI 자동 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">이벤트 정보를 입력하면 AI가 적절한 톤과 내용으로 초청장을 생성합니다.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>다양한 출력</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">PDF, PNG, JPG 형식으로 개인화된 문서를 일괄 생성하고 다운로드하세요.</p>
            </CardContent>
          </Card>
        </div>

        {/* 프로세스 안내 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8단계 간편 프로세스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1-2
                </div>
                <p className="text-sm font-medium">수신자 & 이벤트 정보</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3-4
                </div>
                <p className="text-sm font-medium">AI 생성 & 디자인 선택</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  5-6
                </div>
                <p className="text-sm font-medium">피드백 & AI 수정</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  7-8
                </div>
                <p className="text-sm font-medium">최종 확인 & 파일 생성</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 시작 버튼 */}
        <div className="text-center">
          <Button size="lg" onClick={handleStartProject} className="px-8 py-4 text-lg">
            <Play className="w-5 h-5 mr-2" />새 프로젝트 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">© 2024 AI 초청장 서비스. 모든 권리 보유.</p>
        </div>
      </div>
    </div>
  )
}
