"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, User, RefreshCw } from "lucide-react"
import type { Recipient, DocumentTemplate } from "@/lib/types"

interface TemplatePreviewProps {
  template: DocumentTemplate
  recipients: Recipient[]
  onTemplateChange?: (template: DocumentTemplate) => void
}

export function TemplatePreview({ template, recipients, onTemplateChange }: TemplatePreviewProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || "")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

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

  if (!selectedRecipient) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">수신자 정보가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>미리보기 설정</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{template.style?.tone || "formal"}</Badge>
              <Badge variant="outline">{template.style?.layout || "표준"}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
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
              <span className="text-sm font-medium">화면:</span>
              <div className="flex border rounded-lg">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="rounded-r-none"
                >
                  데스크톱
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="rounded-l-none"
                >
                  모바일
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>문서 미리보기</span>
            <div className="text-sm text-gray-500">
              {selectedRecipient.name} ({selectedRecipient.organization})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`mx-auto bg-white border rounded-lg shadow-lg transition-all duration-300 ${
              previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
            }`}
          >
            <div className="p-8 space-y-6">
              {/* 헤더 */}
              <div className="text-center border-b pb-6">
                <div
                  className="text-lg font-semibold text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: applyRecipientData(template.header, selectedRecipient).replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              {/* 본문 */}
              <div className="space-y-4">
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: applyRecipientData(template.body, selectedRecipient).replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              {/* CTA */}
              {template.cta && (
                <div className="text-center py-4">
                  <div className="inline-block px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div
                      className="text-blue-800 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: applyRecipientData(template.cta, selectedRecipient).replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 푸터 */}
              <div className="border-t pt-6">
                <div
                  className="text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: applyRecipientData(template.footer, selectedRecipient).replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수신자 정보 카드 */}
      <Card className="bg-gray-50">
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
    </div>
  )
}
