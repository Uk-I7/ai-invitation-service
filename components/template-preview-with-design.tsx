"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, User, RefreshCw, Palette } from "lucide-react"
import type { Recipient, DocumentTemplate } from "@/lib/types"
import type { DesignTemplate } from "./template-gallery"

interface TemplatePreviewWithDesignProps {
  template: DocumentTemplate
  designTemplate: DesignTemplate
  recipients: Recipient[]
  onTemplateChange?: (template: DocumentTemplate) => void
}

export function TemplatePreviewWithDesign({
  template,
  designTemplate,
  recipients,
  onTemplateChange,
}: TemplatePreviewWithDesignProps) {
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
              <span>디자인 미리보기</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Palette className="w-3 h-3" />
                <span>{designTemplate.name}</span>
              </Badge>
              <Badge variant="outline">{template.style?.tone || "formal"}</Badge>
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

      {/* 디자인 미리보기 */}
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
            className={`mx-auto border rounded-lg shadow-lg transition-all duration-300 ${
              previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
            }`}
            style={{
              backgroundColor: designTemplate.colors.background,
              fontFamily: designTemplate.fonts.body,
            }}
          >
            {/* 디자인 템플릿 적용된 문서 */}
            <div className="relative overflow-hidden">
              {/* 배경 패턴/장식 */}
              {designTemplate.layout === "decorative" && (
                <div
                  className="absolute top-0 left-0 w-full h-20 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${designTemplate.colors.primary}, ${designTemplate.colors.secondary})`,
                  }}
                />
              )}

              <div className="relative p-8 space-y-6">
                {/* 헤더 */}
                <div className="text-center border-b pb-6" style={{ borderColor: designTemplate.colors.accent }}>
                  <div
                    className="text-lg font-bold leading-relaxed"
                    style={{
                      color: designTemplate.colors.primary,
                      fontFamily: designTemplate.fonts.heading,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: applyRecipientData(template.header, selectedRecipient).replace(/\n/g, "<br>"),
                    }}
                  />
                </div>

                {/* 본문 */}
                <div className="space-y-4">
                  <div
                    className="leading-relaxed whitespace-pre-line"
                    style={{ color: designTemplate.colors.text }}
                    dangerouslySetInnerHTML={{
                      __html: applyRecipientData(template.body, selectedRecipient).replace(/\n/g, "<br>"),
                    }}
                  />
                </div>

                {/* CTA */}
                {template.cta && (
                  <div className="text-center py-4">
                    <div
                      className="inline-block px-6 py-3 rounded-lg border-2"
                      style={{
                        backgroundColor: `${designTemplate.colors.primary}15`,
                        borderColor: designTemplate.colors.primary,
                        color: designTemplate.colors.primary,
                      }}
                    >
                      <div
                        className="font-medium"
                        dangerouslySetInnerHTML={{
                          __html: applyRecipientData(template.cta, selectedRecipient).replace(/\n/g, "<br>"),
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
                      __html: applyRecipientData(template.footer, selectedRecipient).replace(/\n/g, "<br>"),
                    }}
                  />
                </div>

                {/* 장식 요소 */}
                {designTemplate.layout === "decorative" && (
                  <div className="flex justify-center pt-4">
                    <div className="w-16 h-1 rounded-full" style={{ backgroundColor: designTemplate.colors.accent }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 디자인 정보 */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>선택된 디자인 템플릿</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>템플릿:</strong> {designTemplate.name}
            </div>
            <div>
              <strong>카테고리:</strong> {designTemplate.category}
            </div>
            <div>
              <strong>레이아웃:</strong> {designTemplate.layout}
            </div>
            <div>
              <strong>폰트:</strong> {designTemplate.fonts.heading}
            </div>
            <div className="md:col-span-2">
              <strong>색상 팔레트:</strong>
              <div className="flex items-center space-x-2 mt-1">
                {Object.entries(designTemplate.colors).map(([name, color]) => (
                  <div key={name} className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
