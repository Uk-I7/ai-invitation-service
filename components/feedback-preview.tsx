"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, User, RefreshCw, MessageSquare, AlertTriangle } from "lucide-react"
import type { Recipient, DocumentTemplate, FeedbackItem } from "@/lib/types"

interface FeedbackPreviewProps {
  template: DocumentTemplate
  designTemplate: any
  logoUrl?: string | null
  recipients: Recipient[]
  feedback: FeedbackItem[]
}

export function FeedbackPreview({ template, designTemplate, logoUrl, recipients, feedback }: FeedbackPreviewProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || "")
  // 섹션 하이라이트 모드 상태 추가
  const [showSectionGuide, setShowSectionGuide] = useState(false)

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) || recipients[0]

  // 템플릿에 수신자 정보를 적용하는 함수
  const applyRecipientData = (text: string, recipient: Recipient): string => {
    return text
      .replace(/\{\{name\}\}/g, recipient.name)
      .replace(/\{\{organization\}\}/g, recipient.organization)
      .replace(/\{\{position\}\}/g, recipient.position || "")
      .replace(/\{\{email\}\}/g, recipient.email)
      .replace(/\{\{phone\}\}/g, recipient.phone)
  }

  const getRandomRecipient = () => {
    const randomIndex = Math.floor(Math.random() * recipients.length)
    setSelectedRecipientId(recipients[randomIndex].id)
  }

  // 섹션별 피드백 표시
  const getSectionFeedback = (section: string) => {
    return feedback.filter((f) => f.section === section)
  }

  const getSectionLabel = (section: string) => {
    const labels: { [key: string]: string } = {
      header: "헤더",
      body: "본문",
      footer: "푸터",
      cta: "행동 유도",
      style: "스타일",
    }
    return labels[section] || section
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  if (!selectedRecipient) {
    return <div>수신자 정보가 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>수정 요청이 표시된 미리보기</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{feedback.length}개 수정 요청</Badge>
              <Badge variant="destructive">
                {feedback.filter((f) => f.priority === "high").length}개 높은 우선순위
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-2">
              <Button
                variant={showSectionGuide ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSectionGuide(!showSectionGuide)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {showSectionGuide ? "가이드 숨기기" : "섹션 가이드"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 피드백이 표시된 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle>현재 템플릿 + 수정 요청 표시</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full max-w-2xl mx-auto border rounded-lg shadow-lg overflow-hidden relative"
            style={{
              backgroundColor: designTemplate?.colors?.background || "#ffffff",
              fontFamily: designTemplate?.fonts?.body || "inherit",
            }}
          >
            <div className="relative overflow-hidden">
              <div className="relative z-10 p-8 space-y-6">
                {/* 헤더 */}
                <div className={`relative ${showSectionGuide ? "border-2 border-blue-300 bg-blue-50" : ""}`}>
                  {showSectionGuide && (
                    <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                      📝 헤더 (인사말)
                    </div>
                  )}
                  <div
                    className="text-center border-b pb-6"
                    style={{ borderColor: designTemplate?.colors?.accent || "#e5e7eb" }}
                  >
                    <div
                      className="text-2xl font-bold leading-relaxed"
                      style={{
                        color: designTemplate?.colors?.primary || "#1f2937",
                        fontFamily: designTemplate?.fonts?.heading || "inherit",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: applyRecipientData(template.header, selectedRecipient).replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                  {/* 헤더 피드백 표시 */}
                  {getSectionFeedback("header").length > 0 && (
                    <div className="absolute -right-4 top-0">
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {getSectionFeedback("header").length}
                      </div>
                    </div>
                  )}
                </div>

                {/* 본문 */}
                <div className={`relative ${showSectionGuide ? "border-2 border-green-300 bg-green-50" : ""}`}>
                  {showSectionGuide && (
                    <div className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      📄 본문 (주요 내용)
                    </div>
                  )}
                  <div className="space-y-4">
                    <div
                      className="text-base leading-relaxed whitespace-pre-line"
                      style={{ color: designTemplate?.colors?.text || "#374151" }}
                      dangerouslySetInnerHTML={{
                        __html: applyRecipientData(template.body, selectedRecipient).replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                  {/* 본문 피드백 표시 */}
                  {getSectionFeedback("body").length > 0 && (
                    <div className="absolute -right-4 top-0">
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {getSectionFeedback("body").length}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {template.cta && (
                  <div className={`relative ${showSectionGuide ? "border-2 border-orange-300 bg-orange-50" : ""}`}>
                    {showSectionGuide && (
                      <div className="absolute -top-6 left-0 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        🔔 행동 유도 문구
                      </div>
                    )}
                    <div className="text-center py-6">
                      <div
                        className="inline-block px-8 py-4 rounded-lg border-2 text-lg font-medium"
                        style={{
                          backgroundColor: `${designTemplate?.colors?.primary || "#3b82f6"}15`,
                          borderColor: designTemplate?.colors?.primary || "#3b82f6",
                          color: designTemplate?.colors?.primary || "#3b82f6",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: applyRecipientData(template.cta, selectedRecipient).replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                    {/* CTA 피드백 표시 */}
                    {getSectionFeedback("cta").length > 0 && (
                      <div className="absolute -right-4 top-6">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {getSectionFeedback("cta").length}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 푸터 */}
                <div className={`relative ${showSectionGuide ? "border-2 border-purple-300 bg-purple-50" : ""}`}>
                  {showSectionGuide && (
                    <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                      🔚 푸터 (연락처 & 마무리)
                    </div>
                  )}
                  <div className="border-t pt-6" style={{ borderColor: designTemplate?.colors?.accent || "#e5e7eb" }}>
                    <div
                      className="text-sm leading-relaxed"
                      style={{ color: designTemplate?.colors?.secondary || "#6b7280" }}
                      dangerouslySetInnerHTML={{
                        __html: applyRecipientData(template.footer, selectedRecipient).replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                  {/* 푸터 피드백 표시 */}
                  {getSectionFeedback("footer").length > 0 && (
                    <div className="absolute -right-4 top-6">
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {getSectionFeedback("footer").length}
                      </div>
                    </div>
                  )}
                </div>

                {/* 로고 */}
                {logoUrl && (
                  <div className="flex justify-center pt-4">
                    <img
                      src={logoUrl || "/placeholder.svg"}
                      alt="기관 로고"
                      className="w-20 h-16 object-contain opacity-90"
                    />
                  </div>
                )}
              </div>

              {/* 스타일 피드백 표시 */}
              {getSectionFeedback("style").length > 0 && (
                <div className="absolute top-4 left-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 피드백 상세 목록 */}
      {feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>수정 요청 상세 목록</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getPriorityColor(item.priority)} ${
                    item.priority === "high" ? "border-l-4 border-l-red-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getSectionLabel(item.section)}</Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority === "high" ? "높음" : item.priority === "medium" ? "보통" : "낮음"}
                      </Badge>
                      {item.priority === "high" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <p className="text-sm font-medium">{item.instruction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
