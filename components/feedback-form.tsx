"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Plus, X, AlertCircle, Lightbulb } from "lucide-react"
import type { FeedbackItem } from "@/lib/types"

interface FeedbackFormProps {
  onFeedbackAdd: (feedback: FeedbackItem) => void
  existingFeedback: FeedbackItem[]
  onFeedbackRemove: (index: number) => void
}

const feedbackSections = [
  { value: "header", label: "헤더 (인사말)", description: "문서 상단의 인사말과 제목 부분" },
  { value: "body", label: "본문", description: "주요 내용과 상세 설명 부분" },
  { value: "footer", label: "푸터 (마무리)", description: "연락처와 마무리 인사 부분" },
  { value: "cta", label: "행동 유도 문구", description: "참석 확인, 회신 요청 등의 버튼 문구" },
  { value: "style", label: "디자인 & 스타일", description: "색상, 폰트, 레이아웃, 장식 요소" },
]

const priorityOptions = [
  { value: "high", label: "높음", color: "bg-red-100 text-red-800", description: "반드시 수정이 필요한 중요한 사항" },
  { value: "medium", label: "보통", color: "bg-yellow-100 text-yellow-800", description: "개선하면 좋을 사항" },
  { value: "low", label: "낮음", color: "bg-green-100 text-green-800", description: "선택적으로 고려할 사항" },
]

const suggestionTemplates = {
  header: [
    "더 정중한 표현으로 변경해주세요",
    "제목을 더 눈에 띄게 만들어주세요",
    "인사말을 더 간결하게 줄여주세요",
    "수신자에게 더 개인적인 느낌을 주도록 수정해주세요",
  ],
  body: [
    "내용을 더 구체적으로 설명해주세요",
    "문장을 더 간결하게 정리해주세요",
    "중요한 정보를 더 강조해주세요",
    "참석 혜택을 더 명확히 제시해주세요",
  ],
  footer: [
    "연락처 정보를 더 명확하게 표시해주세요",
    "마무리 인사를 더 따뜻하게 변경해주세요",
    "추가 문의 방법을 포함해주세요",
    "감사 인사를 더 정중하게 표현해주세요",
  ],
  cta: [
    "더 적극적인 표현으로 변경해주세요",
    "참석 방법을 더 명확하게 안내해주세요",
    "마감일을 강조해주세요",
    "회신 방법을 더 구체적으로 설명해주세요",
  ],
  style: [
    "색상을 더 밝게/어둡게 조정해주세요",
    "폰트 크기를 조정해주세요",
    "장식 요소를 추가/제거해주세요",
    "전체적인 톤을 더 공식적/친근하게 변경해주세요",
  ],
}

export function FeedbackForm({ onFeedbackAdd, existingFeedback, onFeedbackRemove }: FeedbackFormProps) {
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [instruction, setInstruction] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = () => {
    if (!selectedSection || !instruction.trim()) {
      alert("섹션과 수정 지시사항을 모두 입력해주세요.")
      return
    }

    const feedback: FeedbackItem = {
      section: selectedSection as FeedbackItem["section"],
      instruction: instruction.trim(),
      priority,
    }

    onFeedbackAdd(feedback)
    setInstruction("")
    setSelectedSection("")
    setPriority("medium")
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInstruction(suggestion)
    setShowSuggestions(false)
  }

  const getSectionLabel = (section: string) => {
    return feedbackSections.find((s) => s.value === section)?.label || section
  }

  const getPriorityBadge = (priority: string) => {
    const option = priorityOptions.find((p) => p.value === priority)
    return option ? { label: option.label, color: option.color } : { label: priority, color: "bg-gray-100" }
  }

  return (
    <div className="space-y-6">
      {/* 피드백 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>수정 요청 추가</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 섹션 선택 */}
          <div>
            <label className="text-sm font-medium mb-2 block">수정할 영역 선택</label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="수정하고 싶은 영역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {feedbackSections.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    <div>
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 우선순위 선택 */}
          <div>
            <label className="text-sm font-medium mb-2 block">우선순위</label>
            <div className="flex space-x-2">
              {priorityOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={priority === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority(option.value as "high" | "medium" | "low")}
                  className={priority === option.value ? "" : "hover:bg-gray-50"}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {priorityOptions.find((p) => p.value === priority)?.description}
            </p>
          </div>

          {/* 수정 지시사항 입력 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">구체적인 수정 지시사항</label>
              {selectedSection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  제안 보기
                </Button>
              )}
            </div>
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="예: '헤더의 인사말을 더 정중하고 공식적인 표현으로 변경해주세요' 또는 '본문에서 행사의 혜택을 더 구체적으로 설명해주세요'"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 구체적이고 명확한 지시사항을 작성하면 AI가 더 정확하게 수정할 수 있습니다.
            </p>
          </div>

          {/* 제안 템플릿 */}
          {showSuggestions && selectedSection && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-800">{getSectionLabel(selectedSection)} 수정 제안</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestionTemplates[selectedSection as keyof typeof suggestionTemplates]?.map(
                    (suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left justify-start h-auto p-2 text-sm text-blue-700 hover:bg-blue-100"
                      >
                        {suggestion}
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSubmit} disabled={!selectedSection || !instruction.trim()} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            수정 요청 추가
          </Button>
        </CardContent>
      </Card>

      {/* 추가된 피드백 목록 */}
      {existingFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>추가된 수정 요청 ({existingFeedback.length}개)</span>
              <Badge variant="outline">
                {existingFeedback.filter((f) => f.priority === "high").length}개 높은 우선순위
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingFeedback.map((feedback, index) => {
                const priorityBadge = getPriorityBadge(feedback.priority)
                return (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{getSectionLabel(feedback.section)}</Badge>
                        <Badge className={priorityBadge.color}>{priorityBadge.label}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedbackRemove(index)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.instruction}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 도움말 */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>
              <strong>효과적인 피드백 작성 팁:</strong>
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside ml-4">
              <li>구체적인 변경 사항을 명시하세요 (예: "더 정중하게" → "존경하는 고객님으로 변경")</li>
              <li>변경 이유나 목적을 함께 설명하세요</li>
              <li>우선순위를 정확히 설정하여 중요한 수정사항부터 처리되도록 하세요</li>
              <li>여러 개의 작은 수정보다는 하나의 명확한 수정을 요청하세요</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
