"use client"

import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { useAdminStore } from "@/lib/admin-store"
import { StepIndicator } from "@/components/step-indicator"
import { EnhancedTemplateGallery } from "@/components/enhanced-template-gallery"
import { LogoUpload } from "@/components/logo-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from "lucide-react"
import { useState } from "react"

export default function Step3Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, setTemplate, setCurrentStep } = useProjectStore()
  const { logoFile: adminLogoFile } = useAdminStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [logoFile, setLogoFile] = useState<{ name: string; url: string; size: number } | null>(adminLogoFile)

  const handleTemplateSelect = async (selectedTemplate: any, designTemplate: any) => {
    setIsGenerating(true)
    try {
      const finalLogoFile = adminLogoFile || logoFile

      const finalTemplate = {
        ...selectedTemplate,
        designTemplate,
        logoFile: finalLogoFile,
      }

      setTemplate(finalTemplate)

      setTimeout(() => {
        setCurrentStep(4)
        router.push("/step4")
      }, 1000)
    } catch (error) {
      console.error("템플릿 선택 실패:", error)
      alert("템플릿 선택 중 오류가 발생했습니다.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(2)
    router.push("/step2")
  }

  if (!documentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              이벤트 정보가 없습니다.{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/step2")}>
                2단계로 돌아가서
              </Button>{" "}
              이벤트 정보를 먼저 입력해주세요.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3단계: AI 템플릿 생성 및 디자인 선택</h1>
          <p className="text-gray-600">
            AI가 생성한 템플릿을 확인하고 원하는 디자인을 선택하세요. 로고를 업로드하면 더욱 전문적인 문서를 만들 수
            있습니다.
          </p>
        </div>

        {template ? (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>템플릿 생성 완료!</strong> 선택하신 디자인과 함께 {recipients.length}명의 수신자에게 개인화된
              문서가 준비되었습니다.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              AI가 이벤트 정보를 바탕으로 적절한 템플릿을 생성했습니다. 원하는 디자인을 선택해주세요.
            </AlertDescription>
          </Alert>
        )}

        {!adminLogoFile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>기관 로고 업로드 (선택사항)</CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload logoFile={logoFile} onLogoChange={setLogoFile} />
            </CardContent>
          </Card>
        )}

        {adminLogoFile && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">관리자 설정 로고 사용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img
                  src={adminLogoFile.url || "/placeholder.svg"}
                  alt="관리자 로고"
                  className="w-16 h-16 object-contain border rounded"
                />
                <div>
                  <p className="text-green-700">관리자 설정에서 등록된 로고가 자동으로 적용됩니다.</p>
                  <p className="text-sm text-green-600">
                    파일명: {adminLogoFile.name} ({(adminLogoFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <EnhancedTemplateGallery
          documentDetails={documentDetails}
          recipients={recipients}
          onTemplateSelect={handleTemplateSelect}
          isGenerating={isGenerating}
          logoFile={adminLogoFile || logoFile}
        />

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계
          </Button>
          {template && (
            <Button onClick={() => router.push("/step4")}>
              다음 단계 (미리보기)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
