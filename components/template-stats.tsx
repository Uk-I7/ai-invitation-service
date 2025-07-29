"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Clock, CheckCircle } from "lucide-react"
import { useProjectStore } from "@/lib/store"

// 안전한 문자열 변환 함수
function safeString(value: any): string {
  if (value === null || value === undefined) return ""
  return String(value)
}

export function TemplateStats() {
  const { recipients, documentDetails, template } = useProjectStore()

  // 안전한 데이터 처리
  const recipientCount = recipients?.length || 0
  const documentCount = template ? 1 : 0

  // 예상 읽기 시간 계산 (안전한 처리)
  const calculateReadingTime = () => {
    if (!template) return 0

    const header = safeString(template.header)
    const body = safeString(template.body)
    const footer = safeString(template.footer)

    const totalText = header + body + footer
    const wordCount = totalText.split(/\s+/).filter((word) => word.length > 0).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)) // 분당 200단어 기준

    return readingTime
  }

  const readingTime = calculateReadingTime()

  // 완성도 계산
  const calculateCompleteness = () => {
    let completed = 0
    const total = 2

    if (recipientCount > 0) completed++
    if (documentDetails) completed++

    return Math.round((completed / total) * 100)
  }

  const completeness = calculateCompleteness()

  // 수신자 직책 분포 (안전한 처리)
  const getPositionStats = () => {
    if (recipientCount === 0) return {}

    const positions: { [key: string]: number } = {}
    recipients.forEach((recipient) => {
      const position = safeString(recipient.position) || "미분류"
      positions[position] = (positions[position] || 0) + 1
    })
    return positions
  }

  const positionStats = getPositionStats()

  // 연락처 완성도 (안전한 처리)
  const getContactCompleteness = () => {
    if (recipientCount === 0) return 0

    const completeContacts = recipients.filter((recipient) => {
      const email = safeString(recipient.email)
      const phone = safeString(recipient.phone)
      return email.length > 0 || phone.length > 0
    }).length

    return Math.round((completeContacts / recipientCount) * 100)
  }

  const contactCompleteness = getContactCompleteness()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 수신자 수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">수신자</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{recipientCount}명</div>
          <p className="text-xs text-muted-foreground">
            {recipientCount > 0 ? `${Object.keys(positionStats).length}개 기관` : "등록 필요"}
          </p>
        </CardContent>
      </Card>

      {/* 문서 갯수 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">문서 갯수</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{documentCount}</div>
          <p className="text-xs text-muted-foreground">{documentCount > 0 ? "템플릿 준비됨" : "템플릿 생성 필요"}</p>
        </CardContent>
      </Card>

      {/* 예상 읽기 시간 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">예상 읽기 시간</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{readingTime}분</div>
          <p className="text-xs text-muted-foreground">평균 기준</p>
        </CardContent>
      </Card>

      {/* 완성도 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">완성도</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Badge variant={completeness === 100 ? "default" : "secondary"} className="text-lg px-3 py-1">
              {completeness}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{completeness === 100 ? "발송 준비 완료" : "추가 정보 필요"}</p>
        </CardContent>
      </Card>

      {/* 추가 통계 정보 */}
      {recipientCount > 0 && (
        <>
          {/* 직책 정보 완성도 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">직책 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {Object.entries(positionStats).map(([position, count]) => (
                  <Badge key={position} variant="outline" className="text-xs">
                    {position}: {count}명
                  </Badge>
                ))}
              </div>
              <div className="mt-2">
                <Badge variant="default" className="bg-black text-white">
                  100%
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">직책 정보 완성</span>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 정보 완성도 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">연락처 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div>
                  <Badge variant="default" className="bg-black text-white">
                    {contactCompleteness}%
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">연락처 정보 완성</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {recipients.filter((r) => safeString(r.email).length > 0).length}명 이메일,{" "}
                  {recipients.filter((r) => safeString(r.phone).length > 0).length}명 전화번호
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
