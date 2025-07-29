"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Phone, FileText, Sparkles } from "lucide-react"
import type { DocumentDetails } from "@/lib/types"

interface EventFormProps {
  eventDetails: DocumentDetails
  onEventDetailsChange: (details: DocumentDetails) => void
}

export function EventForm({ eventDetails, onEventDetailsChange }: EventFormProps) {
  const [formData, setFormData] = useState<DocumentDetails>(eventDetails)

  // 입력 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof DocumentDetails, value: string) => {
      const updatedData = { ...formData, [field]: value }
      setFormData(updatedData)
      onEventDetailsChange(updatedData)
    },
    [formData, onEventDetailsChange],
  )

  // 샘플 데이터 입력
  const fillSampleData = useCallback(() => {
    const sampleData: DocumentDetails = {
      title: "2024 AI 혁신 컨퍼런스",
      organizer: "한국AI협회",
      date: "2024-03-15",
      time: "14:00",
      location: "서울 코엑스 컨벤션센터 3층 대회의실",
      description:
        "인공지능 기술의 최신 동향과 실무 적용 사례를 공유하는 컨퍼런스입니다. 업계 전문가들의 발표와 네트워킹 시간이 마련되어 있습니다.",
      dresscode: "비즈니스 캐주얼",
      contact: "김담당자 (02-1234-5678, ai-conference@example.com)",
      rsvp: "2024년 3월 10일까지 회신 부탁드립니다.",
    }
    setFormData(sampleData)
    onEventDetailsChange(sampleData)
  }, [onEventDetailsChange])

  // 필수 필드 체크
  const requiredFields = ["title", "organizer", "date", "location"]
  const isFieldRequired = (field: string) => requiredFields.includes(field)
  const isFieldFilled = (field: keyof DocumentDetails) => formData[field]?.toString().trim()

  return (
    <div className="space-y-6">
      {/* 샘플 데이터 버튼 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fillSampleData}
          className="text-blue-600 border-blue-200 bg-transparent"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          샘플 데이터 입력
        </Button>
      </div>

      {/* 기본 정보 */}
      <Card className="border-blue-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">기본 정보</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* 행사명 */}
            <div className="md:col-span-2">
              <Label htmlFor="title" className="flex items-center space-x-1">
                <span>행사명</span>
                <Badge variant="destructive" className="text-xs">
                  필수
                </Badge>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="예: 2024 AI 혁신 컨퍼런스"
                className={`mt-1 ${
                  isFieldRequired("title") && !isFieldFilled("title") ? "border-red-300 focus:border-red-500" : ""
                }`}
              />
            </div>

            {/* 주최자 */}
            <div>
              <Label htmlFor="organizer" className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>주최자</span>
                <Badge variant="destructive" className="text-xs">
                  필수
                </Badge>
              </Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => handleInputChange("organizer", e.target.value)}
                placeholder="예: 한국AI협회"
                className={`mt-1 ${
                  isFieldRequired("organizer") && !isFieldFilled("organizer")
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }`}
              />
            </div>

            {/* 연락처 */}
            <div>
              <Label htmlFor="contact" className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>연락처</span>
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="예: 김담당자 (02-1234-5678)"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일정 및 장소 */}
      <Card className="border-green-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">일정 및 장소</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* 날짜 */}
            <div>
              <Label htmlFor="date" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>날짜</span>
                <Badge variant="destructive" className="text-xs">
                  필수
                </Badge>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`mt-1 ${
                  isFieldRequired("date") && !isFieldFilled("date") ? "border-red-300 focus:border-red-500" : ""
                }`}
              />
            </div>

            {/* 시간 */}
            <div>
              <Label htmlFor="time" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>시간</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* 드레스코드 */}
            <div>
              <Label htmlFor="dresscode">드레스코드</Label>
              <Input
                id="dresscode"
                value={formData.dresscode || ""}
                onChange={(e) => handleInputChange("dresscode", e.target.value)}
                placeholder="예: 비즈니스 캐주얼"
                className="mt-1"
              />
            </div>
          </div>

          {/* 장소 */}
          <div>
            <Label htmlFor="location" className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>장소</span>
              <Badge variant="destructive" className="text-xs">
                필수
              </Badge>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="예: 서울 코엑스 컨벤션센터 3층 대회의실"
              className={`mt-1 ${
                isFieldRequired("location") && !isFieldFilled("location") ? "border-red-300 focus:border-red-500" : ""
              }`}
            />
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      <Card className="border-purple-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">상세 정보</h3>
          </div>

          {/* 행사 설명 */}
          <div>
            <Label htmlFor="description">행사 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="행사의 목적, 프로그램, 참석 대상 등을 자세히 설명해주세요."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* RSVP */}
          <div>
            <Label htmlFor="rsvp">RSVP 안내</Label>
            <Input
              id="rsvp"
              value={formData.rsvp || ""}
              onChange={(e) => handleInputChange("rsvp", e.target.value)}
              placeholder="예: 2024년 3월 10일까지 회신 부탁드립니다."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* 입력 상태 표시 */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              필수 항목: {requiredFields.filter((field) => isFieldFilled(field as keyof DocumentDetails)).length}/
              {requiredFields.length} 완료
            </div>
            <div className="flex space-x-2">
              {requiredFields.map((field) => (
                <div
                  key={field}
                  className={`w-3 h-3 rounded-full ${
                    isFieldFilled(field as keyof DocumentDetails) ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
