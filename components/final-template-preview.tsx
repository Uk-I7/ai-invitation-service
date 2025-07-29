"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, User, RefreshCw, Palette, ImageIcon, FileText, Users } from "lucide-react"
import type { Recipient, DocumentTemplate } from "@/lib/types"

interface FinalTemplatePreviewProps {
  template: DocumentTemplate
  designTemplate: any
  logoUrl?: string | null
  recipients: Recipient[]
  documentDetails: any
}

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

export function FinalTemplatePreview({
  template,
  designTemplate,
  logoUrl,
  recipients,
  documentDetails,
}: FinalTemplatePreviewProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || "")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState("preview")

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) || recipients[0]

  const getRandomRecipient = () => {
    const randomIndex = Math.floor(Math.random() * recipients.length)
    setSelectedRecipientId(recipients[randomIndex].id)
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
              <span>최종 템플릿 미리보기</span>
            </div>
            <div className="flex items-center space-x-2">
              {designTemplate && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Palette className="w-3 h-3" />
                  <span>{designTemplate.name}</span>
                </Badge>
              )}
              {logoUrl && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>로고 포함</span>
                </Badge>
              )}
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

      {/* 탭 인터페이스 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>디자인 미리보기</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>텍스트 내용</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>프로젝트 요약</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>실제 디자인 미리보기</span>
                <div className="text-sm text-gray-500">
                  {selectedRecipient.name} ({selectedRecipient.organization})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`transition-all duration-300 ${previewMode === "mobile" ? "max-w-sm mx-auto" : ""}`}>
                {designTemplate ? (
                  <FullDesignPreview
                    template={template}
                    designTemplate={designTemplate}
                    logoUrl={logoUrl}
                    recipient={selectedRecipient}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">디자인 템플릿 정보가 없습니다.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>최종 텍스트 내용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>📝 헤더 (인사말)</span>
                </h4>
                <div className="p-4 bg-blue-50 rounded-lg text-sm border-l-4 border-blue-500">{template.header}</div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>📄 본문</span>
                </h4>
                <div className="p-4 bg-green-50 rounded-lg text-sm whitespace-pre-line border-l-4 border-green-500">
                  {template.body}
                </div>
              </div>

              {template.cta && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>🔔 행동 유도 문구</span>
                  </h4>
                  <div className="p-4 bg-orange-50 rounded-lg text-sm border-l-4 border-orange-500">{template.cta}</div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>🔚 푸터 (마무리)</span>
                </h4>
                <div className="p-4 bg-purple-50 rounded-lg text-sm border-l-4 border-purple-500">
                  {template.footer}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-6">
            {/* 프로젝트 통계 */}
            <div className="grid md:grid-cols-4 gap-4">
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
                    <ImageIcon className="w-4 h-4" />
                    <span>추가 요소</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{logoUrl ? "1" : "0"}</div>
                  <div className="text-xs text-gray-500 mt-1">{logoUrl ? "로고 포함" : "로고 없음"}</div>
                </CardContent>
              </Card>
            </div>

            {/* 문서 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>문서 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>제목:</strong> {documentDetails?.title || "제목 없음"}
                  </div>
                  <div>
                    <strong>주최자:</strong> {documentDetails?.organizer || "주최자 없음"}
                  </div>
                  <div>
                    <strong>날짜:</strong> {documentDetails?.date || "날짜 미정"}
                    {documentDetails?.time && ` ${documentDetails.time}`}
                  </div>
                  {documentDetails?.location && (
                    <div>
                      <strong>장소:</strong> {documentDetails.location}
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <strong>목적:</strong> {documentDetails?.purpose || "목적 없음"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 수신자 목록 미리보기 */}
            <Card>
              <CardHeader>
                <CardTitle>수신자 목록 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recipients.slice(0, 10).map((recipient, index) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div>
                        <span className="font-medium">{recipient.name}</span>
                        <span className="text-gray-500 ml-2">({recipient.organization})</span>
                      </div>
                      <div className="text-gray-400">{recipient.email}</div>
                    </div>
                  ))}
                  {recipients.length > 10 && (
                    <div className="text-center text-gray-500 text-sm py-2">... 외 {recipients.length - 10}명 더</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
