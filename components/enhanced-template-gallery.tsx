"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Loader2 } from "lucide-react"
import type { DocumentDetails, Recipient } from "@/lib/types"

export interface DesignTemplate {
  id: string
  name: string
  category: "formal" | "modern" | "elegant" | "casual"
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: "classic" | "modern" | "minimal" | "decorative"
  description: string
  hasDecorations: boolean
}

const designTemplates: DesignTemplate[] = [
  {
    id: "formal-blue",
    name: "공식 블루",
    category: "formal",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#60a5fa",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Noto Sans KR",
      body: "Noto Sans KR",
    },
    layout: "classic",
    description: "정중하고 공식적인 분위기의 블루 계열 템플릿",
    hasDecorations: false,
  },
  {
    id: "elegant-gold",
    name: "엘레간트 골드",
    category: "elegant",
    colors: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#fbbf24",
      text: "#374151",
      background: "#fffbeb",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Noto Sans KR",
    },
    layout: "decorative",
    description: "고급스럽고 우아한 골드 계열 템플릿",
    hasDecorations: true,
  },
  {
    id: "modern-green",
    name: "모던 그린",
    category: "modern",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
      text: "#111827",
      background: "#f0fdf4",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: "modern",
    description: "깔끔하고 현대적인 그린 계열 템플릿",
    hasDecorations: false,
  },
  {
    id: "festive-party",
    name: "축제 파티",
    category: "casual",
    colors: {
      primary: "#dc2626",
      secondary: "#f59e0b",
      accent: "#10b981",
      text: "#1f2937",
      background: "#ffffff",
    },
    fonts: {
      heading: "Poppins",
      body: "Noto Sans KR",
    },
    layout: "decorative",
    description: "화려하고 축제적인 분위기의 파티 템플릿",
    hasDecorations: true,
  },
  {
    id: "minimal-gray",
    name: "미니멀 그레이",
    category: "modern",
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#9ca3af",
      text: "#111827",
      background: "#ffffff",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: "minimal",
    description: "심플하고 깔끔한 그레이 계열 템플릿",
    hasDecorations: false,
  },
  {
    id: "royal-purple",
    name: "로얄 퍼플",
    category: "elegant",
    colors: {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
      accent: "#a78bfa",
      text: "#1f2937",
      background: "#faf5ff",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Noto Sans KR",
    },
    layout: "decorative",
    description: "고귀하고 품격있는 퍼플 계열 템플릿",
    hasDecorations: true,
  },
]

// 장식 요소들을 CSS로 구현
function DecorationElements({ template, size = "small" }: { template: DesignTemplate; size?: "small" | "large" }) {
  if (!template.hasDecorations) return null

  const isLarge = size === "large"

  if (template.id === "festive-party") {
    return (
      <>
        {/* 상단 깃발 장식 */}
        <div className="absolute top-0 left-0 w-full h-8 overflow-hidden">
          <div className="flex space-x-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`${isLarge ? "w-6 h-6" : "w-3 h-3"} transform rotate-45`}
                style={{
                  backgroundColor: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                  marginTop: `${i % 2 === 0 ? "0" : "8px"}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 배경 도형들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute ${isLarge ? "w-4 h-4" : "w-2 h-2"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.primary, top: "20%", left: "10%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-3 h-3" : "w-1.5 h-1.5"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.secondary, top: "30%", right: "15%" }}
          />
          <div
            className={`absolute ${isLarge ? "w-5 h-5" : "w-2.5 h-2.5"} rounded-full opacity-60`}
            style={{ backgroundColor: template.colors.accent, bottom: "25%", left: "20%" }}
          />
        </div>
      </>
    )
  }

  if (template.layout === "decorative") {
    return (
      <>
        <div className="absolute top-0 left-0 w-full h-12 opacity-10">
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
            }}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute ${isLarge ? "w-16 h-0.5" : "w-8 h-0.5"} opacity-30`}
            style={{ backgroundColor: template.colors.accent, top: "15%", left: "50%", transform: "translateX(-50%)" }}
          />
          <div
            className={`absolute ${isLarge ? "w-12 h-0.5" : "w-6 h-0.5"} opacity-30`}
            style={{
              backgroundColor: template.colors.accent,
              bottom: "15%",
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

// 실제 디자인 미리보기 컴포넌트
function DesignPreview({
  template,
  logoFile,
  documentDetails,
}: {
  template: DesignTemplate
  logoFile?: { name: string; url: string; size: number } | null
  documentDetails?: DocumentDetails
}) {
  return (
    <div
      className="w-full h-48 rounded-t-lg p-4 relative overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      <DecorationElements template={template} size="small" />

      <div className="relative z-10">
        <div
          className="text-center mb-3 pb-2 border-b"
          style={{
            borderColor: template.colors.accent,
            fontFamily: template.fonts.heading,
          }}
        >
          <div className="text-sm font-bold" style={{ color: template.colors.primary }}>
            {documentDetails?.title || "초청장"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs" style={{ color: template.colors.text, fontFamily: template.fonts.body }}>
            안녕하세요. {"{{name}}"}님
          </div>
          <div className="text-xs leading-relaxed" style={{ color: template.colors.text }}>
            {documentDetails?.description || "2024년 AI 혁신 컨퍼런스에 귀하를 초대합니다."}
          </div>
          <div className="text-xs" style={{ color: template.colors.secondary }}>
            일시: {documentDetails?.date || "2024년 3월 15일"} {documentDetails?.time || "오후 2시"}
          </div>
          {documentDetails?.location && (
            <div className="text-xs" style={{ color: template.colors.secondary }}>
              장소: {documentDetails.location}
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <div
            className="inline-block px-3 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: `${template.colors.primary}20`,
              color: template.colors.primary,
              border: `1px solid ${template.colors.primary}`,
            }}
          >
            참석 확인
          </div>
        </div>

        {logoFile && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <img
              src={logoFile.url || "/placeholder.svg"}
              alt="기관 로고"
              className="w-8 h-6 object-contain opacity-80"
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface EnhancedTemplateGalleryProps {
  documentDetails: DocumentDetails
  recipients: Recipient[]
  onTemplateSelect: (template: any, designTemplate: DesignTemplate) => void
  isGenerating: boolean
  logoFile?: { name: string; url: string; size: number } | null
}

export function EnhancedTemplateGallery({
  documentDetails,
  recipients,
  onTemplateSelect,
  isGenerating,
  logoFile,
}: EnhancedTemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [generatedTemplates, setGeneratedTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: "all", name: "전체" },
    { id: "formal", name: "공식" },
    { id: "modern", name: "모던" },
    { id: "elegant", name: "엘레간트" },
    { id: "casual", name: "캐주얼" },
  ]

  const filteredTemplates =
    selectedCategory === "all" ? designTemplates : designTemplates.filter((t) => t.category === selectedCategory)

  // AI 템플릿 생성 시뮬레이션
  useEffect(() => {
    const generateTemplates = async () => {
      setIsLoading(true)

      // 시뮬레이션 지연
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const templates = designTemplates.map((designTemplate) => ({
        id: `template-${designTemplate.id}`,
        header: `${documentDetails.title} 초청장`,
        body: `안녕하세요. {{name}}님,\n\n${documentDetails.description}\n\n일시: ${documentDetails.date} ${documentDetails.time || ""}\n장소: ${documentDetails.location || "추후 안내"}\n주최: ${documentDetails.organizer}`,
        footer: `문의사항이 있으시면 ${documentDetails.contact || documentDetails.organizer}로 연락해주세요.\n\n감사합니다.`,
        cta: "참석 의사를 알려주세요",
        designTemplate,
        logoFile,
      }))

      setGeneratedTemplates(templates)
      setIsLoading(false)
    }

    generateTemplates()
  }, [documentDetails, logoFile])

  const handleTemplateClick = (template: any, designTemplate: DesignTemplate) => {
    setSelectedTemplateId(template.id)
  }

  const handleConfirmSelection = () => {
    if (selectedTemplateId) {
      const selectedTemplate = generatedTemplates.find((t) => t.id === selectedTemplateId)
      if (selectedTemplate) {
        onTemplateSelect(selectedTemplate, selectedTemplate.designTemplate)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h3 className="text-lg font-semibold mb-2">AI가 템플릿을 생성하고 있습니다...</h3>
        <p className="text-gray-600">이벤트 정보를 바탕으로 최적의 문서를 만들어드리겠습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((designTemplate) => {
          const template = generatedTemplates.find((t) => t.designTemplate.id === designTemplate.id)
          const isSelected = selectedTemplateId === template?.id

          return (
            <Card
              key={designTemplate.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() => template && handleTemplateClick(template, designTemplate)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <DesignPreview template={designTemplate} logoFile={logoFile} documentDetails={documentDetails} />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{designTemplate.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline">{designTemplate.category}</Badge>
                      {designTemplate.hasDecorations && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          장식
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{designTemplate.description}</p>

                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-xs text-gray-500">색상:</span>
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: designTemplate.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: designTemplate.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: designTemplate.colors.accent }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>레이아웃: {designTemplate.layout}</span>
                    <span>폰트: {designTemplate.fonts.heading}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 선택 확인 버튼 */}
      {selectedTemplateId && (
        <div className="text-center pt-4 border-t">
          <Button onClick={handleConfirmSelection} disabled={isGenerating} size="lg" className="px-8">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                적용 중...
              </>
            ) : (
              <>
                선택한 템플릿 적용하기
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export { designTemplates }
