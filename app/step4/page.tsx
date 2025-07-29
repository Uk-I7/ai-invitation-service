"use client"

import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { TemplateStats } from "@/components/template-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  AlertCircle,
  CheckCircle,
  Edit,
  Palette,
  User,
  RefreshCw,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"
import type { Recipient } from "@/lib/types"

// 장식 요소들을 CSS로 구현
function DecorationElements({ template, size = "large" }: { template: any; size?: "small" | "large" }) {
  if (!template?.hasDecorations) return null

  const isLarge = size === "large"

  if (template.id === "festive-party") {
    return (
      <>
        {/* 상단 깃발 장식 */}
        <div className="absolute top-0 left-0 w-full h-12 overflow-hidden">
          <div className="flex space-x-2">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`${isLarge ? "w-8 h-8" : "w-4 h-4"} transform rotate-45`}
                style={{
                  backgroundColor: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                  marginTop: `${i % 2 === 0 ? "0" : "12px"}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 배경 도형들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 원형 도형들 */}
          <div
            className={`absolute ${isLarge ? "w-6 h-6" : "w-3 h-3"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.primary, top: "15%", left: "8%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-4 h-4" : "w-2 h-2"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.secondary, top: "25%", right: "12%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-8 h-8" : "w-4 h-4"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.accent, bottom: "30%", left: "15%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-5 h-5" : "w-2.5 h-2.5"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.primary, bottom: "20%", right: "20%" }}
          />

          {/* 삼각형 도형들 */}
          <div
            className={`absolute w-0 h-0 opacity-60`}
            style={{
              borderLeft: `${isLarge ? "12px" : "6px"} solid transparent`,
              borderRight: `${isLarge ? "12px" : "6px"} solid transparent`,
              borderBottom: `${isLarge ? "18px" : "9px"} solid ${template.colors.primary}`,
              top: "35%",
              right: "18%",
            }}
          />
          <div
            className={`absolute w-0 h-0 opacity-60`}
            style={{
              borderLeft: `${isLarge ? "8px" : "4px"} solid transparent`,
              borderRight: `${isLarge ? "8px" : "4px"} solid transparent`,
              borderBottom: `${isLarge ? "12px" : "6px"} solid ${template.colors.accent}`,
              bottom: "40%",
              left: "25%",
            }}
          />

          {/* 다이아몬드 도형들 */}
          <div
            className={`absolute ${isLarge ? "w-3 h-3" : "w-1.5 h-1.5"} transform rotate-45 opacity-60`}
            style={{ backgroundColor: template.colors.secondary, top: "45%", left: "10%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-4 h-4" : "w-2 h-2"} transform rotate-45 opacity-60`}
            style={{ backgroundColor: template.colors.accent, top: "60%", right: "15%" }}
          />
        </div>
      </>
    )
  }

  if (template.layout === "decorative") {
    return (
      <>
        {/* 우아한 장식 요소들 */}
        <div className="absolute top-0 left-0 w-full h-16 opacity-15">
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute ${isLarge ? "w-20 h-0.5" : "w-10 h-0.5"} opacity-40`}
            style={{ backgroundColor: template.colors.accent, top: "12%", left: "50%", transform: "translateX(-50%)" }}
          />
          <div
            className={`absolute ${isLarge ? "w-16 h-0.5" : "w-8 h-0.5"} opacity-40`}
            style={{
              backgroundColor: template.colors.accent,
              bottom: "12%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </>
    )
  }

  return null
}

// 실제 디자인이 적용된 미리보기 컴포넌트
function FullDesignPreview({
  template,
  designTemplate,
  logoUrl,
  recipient,
}: {
  template: any
  designTemplate: any
  logoUrl?: string | null
  recipient: Recipient
}) {
  // 템플릿에 수신자 정보를 적용하는 함수
  const applyRecipientData = (text: string, recipient: Recipient): string => {
    return text
      .replace(/\{\{name\}\}/g, recipient.name)
      .replace(/\{\{organization\}\}/g, recipient.organization)
      .replace(/\{\{position\}\}/g, recipient.position || "")
      .replace(/\{\{email\}\}/g, recipient.email)
      .replace(/\{\{phone\}\}/g, recipient.phone)
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto border rounded-lg shadow-lg overflow-hidden"
      style={{
        backgroundColor: designTemplate.colors.background,
        fontFamily: designTemplate.fonts.body,
      }}
    >
      {/* 디자인 템플릿 적용된 문서 */}
      <div className="relative overflow-hidden">
        {/* 장식 요소들 */}
        <DecorationElements template={designTemplate} size="large" />

        <div className="relative z-10 p-8 space-y-6">
          {/* 헤더 */}
          <div className="text-center border-b pb-6" style={{ borderColor: designTemplate.colors.accent }}>
            <div
              className="text-2xl font-bold leading-relaxed"
              style={{
                color: designTemplate.colors.primary,
                fontFamily: designTemplate.fonts.heading,
              }}
              dangerouslySetInnerHTML={{
                __html: applyRecipientData(template.header, recipient).replace(/\n/g, "<br>"),
              }}
            />
          </div>

          {/* 본문 */}
          <div className="space-y-4">
            <div
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: designTemplate.colors.text }}
              dangerouslySetInnerHTML={{
                __html: applyRecipientData(template.body, recipient).replace(/\n/g, "<br>"),
              }}
            />
          </div>

          {/* CTA */}
          {template.cta && (
            <div className="text-center py-6">
              <div
                className="inline-block px-8 py-4 rounded-lg border-2 text-lg font-medium"
                style={{
                  backgroundColor: `${designTemplate.colors.primary}15`,
                  borderColor: designTemplate.colors.primary,
                  color: designTemplate.colors.primary,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: applyRecipientData(template.cta, recipient).replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </div>
          )}

          {/* 푸터 */}
          <div className="border-t pt-6" style={{ borderColor: designTemplate.colors.accent }}>
            <div
              className="text-sm leading-relaxed"
              style={{ color: designTemplate.colors.secondary }}
              dangerouslySetInnerHTML={{
                __html: applyRecipientData(template.footer, recipient).replace(/\n/g, "<br>"),
              }}
            />
          </div>

          {/* 로고 영역 (하단 중앙) */}
          {logoUrl && (
            <div className="flex justify-center pt-4">
              <img
                src={logoUrl || "/placeholder.svg"}
                alt="기관 로고"
                className="w-20 h-16 object-contain opacity-90"
              />
            </div>
          )}

          {/* 장식 요소 */}
          {designTemplate.layout === "decorative" && !logoUrl && (
            <div className="flex justify-center pt-4">
              <div className="w-16 h-1 rounded-full" style={{ backgroundColor: designTemplate.colors.accent }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Step4Page() {
  const router = useRouter()
  const { recipients, documentDetails, template, setCurrentStep } = useProjectStore()
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || "")

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) || recipients[0]

  const handleNext = () => {
    setCurrentStep(5)
    router.push("/step5")
  }

  const handlePrevious = () => {
    setCurrentStep(3)
    router.push("/step3")
  }

  const handleEdit = () => {
    setCurrentStep(3)
    router.push("/step3")
  }

  const getRandomRecipient = () => {
    const randomIndex = Math.floor(Math.random() * recipients.length)
    setSelectedRecipientId(recipients[randomIndex].id)
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

  // 디자인 템플릿과 로고 정보 추출
  const designTemplate = (template as any).designTemplate
  const logoFile = (template as any).logoFile

  if (!selectedRecipient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>수신자 정보를 찾을 수 없습니다.</AlertDescription>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">4단계: 디자인 샘플 확인</h1>
          <p className="text-gray-600">
            선택하신 디자인 템플릿과 AI가 생성한 텍스트가 결합된 최종 결과물을 확인하세요. 실제 수신자 정보가 적용된
            모습을 미리볼 수 있습니다.
          </p>
        </div>

        {/* 상태 표시 */}
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <strong>디자인 템플릿 적용 완료!</strong> {recipients.length}명의 수신자에게 개인화된 문서가
                  준비되었습니다.
                </div>
                {designTemplate && (
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{designTemplate.name}</span>
                    {logoFile && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>로고 포함</span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                템플릿 수정
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* 통계 카드 */}
        <div className="mb-8">
          <TemplateStats template={template} recipients={recipients} />
        </div>

        {/* 수신자 선택 컨트롤 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>실제 디자인 미리보기</span>
              </div>
              <div className="flex items-center space-x-2">
                {designTemplate && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Palette className="w-3 h-3" />
                    <span>{designTemplate.name}</span>
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">수신자:</span>
                <Select value={selectedRecipientId} onValueChange={setSelectedRecipientId}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.name} ({recipient.organization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={getRandomRecipient}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 실제 디자인 미리보기 */}
            {designTemplate ? (
              <FullDesignPreview
                template={template}
                designTemplate={designTemplate}
                logoUrl={logoFile?.url}
                recipient={selectedRecipient}
              />
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  디자인 템플릿 정보가 없습니다. 3단계로 돌아가서 디자인을 다시 선택해주세요.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 수신자 정보 카드 */}
        <Card className="mb-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">현재 선택된 수신자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>이름:</strong> {selectedRecipient.name}
              </div>
              <div>
                <strong>소속:</strong> {selectedRecipient.organization}
              </div>
              <div>
                <strong>이메일:</strong> {selectedRecipient.email}
              </div>
              <div>
                <strong>전화번호:</strong> {selectedRecipient.phone}
              </div>
              {selectedRecipient.position && (
                <div className="md:col-span-2">
                  <strong>직책:</strong> {selectedRecipient.position}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 문서 정보 요약 */}
        {documentDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>문서 정보 요약</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>제목:</strong> {documentDetails.title}
                </div>
                <div>
                  <strong>주최자:</strong> {documentDetails.organizer}
                </div>
                <div>
                  <strong>날짜:</strong> {documentDetails.date}
                  {documentDetails.time && ` ${documentDetails.time}`}
                </div>
                {documentDetails.location && (
                  <div>
                    <strong>장소:</strong> {documentDetails.location}
                  </div>
                )}
                <div className="md:col-span-2">
                  <strong>목적:</strong> {documentDetails.purpose}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 다음 단계 안내 */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">다음 단계 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                • <strong>5단계:</strong> 디자인이나 텍스트에 대한 수정 요청이나 피드백을 제공할 수 있습니다
              </p>
              <p>
                • <strong>6단계:</strong> 피드백을 바탕으로 AI가 템플릿을 개선합니다
              </p>
              <p>
                • <strong>7단계:</strong> 최종 디자인 템플릿을 확정합니다
              </p>
              <p>
                • <strong>8단계:</strong> 모든 수신자별로 개인화된 문서를 PDF/이미지로 생성하고 다운로드합니다
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계 (디자인 변경)
          </Button>
          <Button onClick={handleNext}>
            다음 단계 (수정 지시)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
