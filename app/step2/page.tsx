"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { useAdminStore } from "@/lib/admin-store"
import { StepIndicator } from "@/components/step-indicator"
import { EventForm } from "@/components/event-form"
import { FileAttachment } from "@/components/file-attachment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, AlertCircle, Settings, FileText, Upload } from "lucide-react"
import type { DocumentDetails, AttachedFile } from "@/lib/types"

export default function Step2Page() {
  const router = useRouter()
  const { recipients, documentDetails, attachedFiles, setDocumentDetails, setAttachedFiles, setCurrentStep } =
    useProjectStore()
  const { apiKey } = useAdminStore()

  const [localEventDetails, setLocalEventDetails] = useState<DocumentDetails>(
    documentDetails || {
      title: "",
      organizer: "",
      date: "",
      time: "",
      location: "",
      description: "",
      dresscode: "",
      contact: "",
      rsvp: "",
    },
  )

  const [localAttachedFiles, setLocalAttachedFiles] = useState<AttachedFile[]>(attachedFiles || [])

  // 필수 필드 검증
  const canProceed =
    localEventDetails.title.trim() &&
    localEventDetails.organizer.trim() &&
    localEventDetails.date.trim() &&
    localEventDetails.location.trim()

  // 이벤트 정보 변경 핸들러 - useCallback으로 메모이제이션
  const handleEventDetailsChange = useCallback((details: DocumentDetails) => {
    setLocalEventDetails(details)
  }, [])

  // 파일 변경 핸들러
  const handleFilesChange = useCallback((files: AttachedFile[]) => {
    setLocalAttachedFiles(files)
  }, [])

  const handlePrevious = () => {
    setCurrentStep(1)
    router.push("/step1")
  }

  const handleNext = () => {
    if (!canProceed) return

    // 상태 저장
    setDocumentDetails(localEventDetails)
    setAttachedFiles(localAttachedFiles)
    setCurrentStep(3)
    router.push("/step3")
  }

  // 수신자 체크
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">2단계: 발송업무 정보</h1>
          <p className="text-gray-600">문서에 포함될 행사 정보를 입력하고, 참고할 자료가 있다면 첨부해주세요.</p>
        </div>

        {/* API 키 상태 안내 */}
        {!apiKey && (
          <Alert className="mb-6">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>선택사항:</strong> 관리자 설정에서 API 키를 설정하면 첨부파일 AI 분석 기능을 사용할 수
                  있습니다.
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  관리자 설정
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 이벤트 정보 입력 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>행사 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm eventDetails={localEventDetails} onEventDetailsChange={handleEventDetailsChange} />
            </CardContent>
          </Card>

          {/* 파일 첨부 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>참고 자료 첨부</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileAttachment
                files={localAttachedFiles}
                onFilesChange={handleFilesChange}
                hasApiKey={!!apiKey}
                maxFiles={5}
                maxFileSize={10}
              />
            </CardContent>
          </Card>
        </div>

        {/* 진행 상태 */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">진행 상태: {canProceed ? "완료" : "필수 정보 입력 필요"}</div>
                {canProceed && <div className="text-sm text-green-600 font-medium">✓ 다음 단계로 진행 가능</div>}
              </div>
              <div className="text-sm text-gray-500">첨부파일: {localAttachedFiles.length}개</div>
            </div>
          </CardContent>
        </Card>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (수신자 관리)
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            다음 단계 (템플릿 생성)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
