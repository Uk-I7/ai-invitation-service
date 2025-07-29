"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Eye } from "lucide-react"

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
  },
  {
    id: "warm-orange",
    name: "웜 오렌지",
    category: "casual",
    colors: {
      primary: "#ea580c",
      secondary: "#fb923c",
      accent: "#fdba74",
      text: "#1f2937",
      background: "#fff7ed",
    },
    fonts: {
      heading: "Poppins",
      body: "Noto Sans KR",
    },
    layout: "modern",
    description: "따뜻하고 친근한 오렌지 계열 템플릿",
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
  },
]

// 실제 디자인 미리보기 컴포넌트
function DesignPreview({ template }: { template: DesignTemplate }) {
  return (
    <div
      className="w-full h-48 rounded-t-lg p-4 relative overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      {/* 배경 장식 */}
      {template.layout === "decorative" && (
        <div
          className="absolute top-0 left-0 w-full h-12 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
          }}
        />
      )}

      {/* 헤더 영역 */}
      <div className="relative z-10">
        <div
          className="text-center mb-3 pb-2 border-b"
          style={{
            borderColor: template.colors.accent,
            fontFamily: template.fonts.heading,
          }}
        >
          <div className="text-sm font-bold" style={{ color: template.colors.primary }}>
            초청장
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="space-y-2">
          <div className="text-xs" style={{ color: template.colors.text, fontFamily: template.fonts.body }}>
            안녕하세요. {"{{name}}"}님
          </div>
          <div className="text-xs leading-relaxed" style={{ color: template.colors.text }}>
            2024년 AI 혁신 컨퍼런스에 귀하를 초대합니다.
          </div>
          <div className="text-xs" style={{ color: template.colors.secondary }}>
            일시: 2024년 3월 15일 오후 2시
          </div>
        </div>

        {/* CTA 영역 */}
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

        {/* 푸터 장식 */}
        {template.layout === "decorative" && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: template.colors.accent }} />
          </div>
        )}

        {/* 미니멀 스타일 포인트 */}
        {template.layout === "minimal" && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.colors.primary }} />
          </div>
        )}
      </div>
    </div>
  )
}

interface TemplateGalleryProps {
  selectedTemplate?: DesignTemplate
  onTemplateSelect: (template: DesignTemplate) => void
}

export function TemplateGallery({ selectedTemplate, onTemplateSelect }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null)

  const categories = [
    { id: "all", name: "전체" },
    { id: "formal", name: "공식" },
    { id: "modern", name: "모던" },
    { id: "elegant", name: "엘레간트" },
    { id: "casual", name: "캐주얼" },
  ]

  const filteredTemplates =
    selectedCategory === "all" ? designTemplates : designTemplates.filter((t) => t.category === selectedCategory)

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
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardContent className="p-0">
              {/* 실제 디자인 미리보기 */}
              <div className="relative">
                <DesignPreview template={template} />
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewTemplate(template)
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* 템플릿 정보 */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                {/* 색상 팔레트 */}
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-xs text-gray-500">색상:</span>
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.primary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.secondary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.accent }} />
                </div>

                {/* 레이아웃 정보 */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>레이아웃: {template.layout}</span>
                  <span>폰트: {template.fonts.heading}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 미리보기 모달 */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setPreviewTemplate(null)}
        >
          <div className="bg-white rounded-lg p-6 max-w-md max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">{previewTemplate.name}</h3>

            {/* 큰 미리보기 */}
            <div className="mb-4">
              <div
                className="w-full h-64 rounded-lg p-6 relative overflow-hidden"
                style={{ backgroundColor: previewTemplate.colors.background }}
              >
                {/* 배경 장식 */}
                {previewTemplate.layout === "decorative" && (
                  <div
                    className="absolute top-0 left-0 w-full h-16 opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${previewTemplate.colors.primary}, ${previewTemplate.colors.secondary})`,
                    }}
                  />
                )}

                {/* 헤더 영역 */}
                <div className="relative z-10">
                  <div
                    className="text-center mb-4 pb-3 border-b"
                    style={{
                      borderColor: previewTemplate.colors.accent,
                      fontFamily: previewTemplate.fonts.heading,
                    }}
                  >
                    <div className="text-lg font-bold" style={{ color: previewTemplate.colors.primary }}>
                      초청장
                    </div>
                  </div>

                  {/* 본문 영역 */}
                  <div className="space-y-3">
                    <div
                      className="text-sm"
                      style={{ color: previewTemplate.colors.text, fontFamily: previewTemplate.fonts.body }}
                    >
                      안녕하세요. 홍길동님
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: previewTemplate.colors.text }}>
                      2024년 AI 혁신 컨퍼런스에 귀하를 초대합니다.
                      <br />
                      많은 참석 부탁드립니다.
                    </div>
                    <div className="text-sm" style={{ color: previewTemplate.colors.secondary }}>
                      일시: 2024년 3월 15일 오후 2시
                      <br />
                      장소: 코엑스 컨벤션센터
                    </div>
                  </div>

                  {/* CTA 영역 */}
                  <div className="mt-4 text-center">
                    <div
                      className="inline-block px-4 py-2 rounded text-sm font-medium"
                      style={{
                        backgroundColor: `${previewTemplate.colors.primary}20`,
                        color: previewTemplate.colors.primary,
                        border: `1px solid ${previewTemplate.colors.primary}`,
                      }}
                    >
                      참석 확인하기
                    </div>
                  </div>

                  {/* 푸터 */}
                  <div className="mt-4 text-center">
                    <div className="text-xs" style={{ color: previewTemplate.colors.secondary }}>
                      주최: AI이노베이션협회
                    </div>
                  </div>

                  {/* 장식 요소 */}
                  {previewTemplate.layout === "decorative" && (
                    <div className="flex justify-center mt-4">
                      <div
                        className="w-12 h-1 rounded-full"
                        style={{ backgroundColor: previewTemplate.colors.accent }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{previewTemplate.description}</p>

            {/* 색상 정보 */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">색상 팔레트:</div>
              <div className="flex space-x-2">
                {Object.entries(previewTemplate.colors).map(([name, color]) => (
                  <div key={name} className="text-center">
                    <div className="w-8 h-8 rounded border mb-1" style={{ backgroundColor: color }} />
                    <div className="text-xs text-gray-500">{name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                닫기
              </Button>
              <Button
                onClick={() => {
                  onTemplateSelect(previewTemplate)
                  setPreviewTemplate(null)
                }}
              >
                이 템플릿 선택
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { designTemplates }
