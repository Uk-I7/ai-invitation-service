"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { RecipientForm } from "@/components/recipient-form"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Upload, ArrowRight, AlertCircle } from "lucide-react"
import type { Recipient } from "@/lib/types"
import { exportRecipientsToCSV } from "@/lib/csv-template"

export default function Step1Page() {
  const router = useRouter()
  const { recipients, setRecipients, setCurrentStep } = useProjectStore()
  const [localRecipients, setLocalRecipients] = useState<Recipient[]>(recipients)
  const [activeTab, setActiveTab] = useState("form")

  const handleNext = () => {
    if (localRecipients.length === 0) {
      alert("최소 1명의 수신자를 추가해주세요.")
      return
    }

    // 필수 필드 검증
    const missingFields = localRecipients.filter((r) => !r.name.trim() || !r.email.trim())
    if (missingFields.length > 0) {
      alert(`${missingFields.length}명의 수신자에게 필수 정보(이름, 이메일)가 누락되었습니다.`)
      return
    }

    setRecipients(localRecipients)
    setCurrentStep(2)
    router.push("/step2")
  }

  const handleAddSampleData = () => {
    const sampleRecipients: Recipient[] = [
      {
        id: crypto.randomUUID(),
        name: "김대표",
        organization: "테크스타트업",
        email: "ceo@techstartup.com",
        phone: "010-1234-5678",
        position: "대표이사",
      },
      {
        id: crypto.randomUUID(),
        name: "이부장",
        organization: "글로벌기업",
        email: "manager@global.com",
        phone: "010-9876-5432",
        position: "개발부장",
      },
      {
        id: crypto.randomUUID(),
        name: "박팀장",
        organization: "혁신회사",
        email: "team@innovation.com",
        phone: "010-5555-7777",
        position: "기획팀장",
      },
    ]
    setLocalRecipients([...localRecipients, ...sampleRecipients])
  }

  const handleExportRecipients = () => {
    if (localRecipients.length === 0) {
      alert("내보낼 수신자가 없습니다.")
      return
    }
    exportRecipientsToCSV(localRecipients, `수신자목록_${new Date().toISOString().split("T")[0]}.csv`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StepIndicator />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">1단계: 수신자 정보 입력</h1>
          <p className="text-gray-600">
            발송 문서를 받을 분들의 정보를 입력해주세요. 폼으로 직접 입력하거나 CSV/JSON 파일을 업로드할 수 있습니다.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>폼 입력</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>파일 업로드</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <RecipientForm recipients={localRecipients} onRecipientsChange={setLocalRecipients} />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload recipients={localRecipients} onRecipientsChange={setLocalRecipients} />
          </TabsContent>
        </Tabs>

        {localRecipients.length === 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <span>빠른 시작</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">테스트를 위해 샘플 데이터를 추가하시겠습니까?</p>
              <Button onClick={handleAddSampleData} variant="outline">
                샘플 데이터 추가 (3명)
              </Button>
            </CardContent>
          </Card>
        )}

        {localRecipients.length > 0 && (
          <Alert className="mt-6">
            <Users className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                총 <strong>{localRecipients.length}명</strong>의 수신자가 추가되었습니다.
                {localRecipients.filter((r) => !r.organization.trim()).length > 0 && (
                  <span className="text-amber-600 ml-2">
                    ({localRecipients.filter((r) => !r.organization.trim()).length}명의 소속 정보 누락)
                  </span>
                )}
              </span>
              <Button variant="outline" size="sm" onClick={handleExportRecipients} className="ml-4 bg-transparent">
                목록 내보내기
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/")}>
            이전
          </Button>
          <Button onClick={handleNext} disabled={localRecipients.length === 0}>
            다음 단계
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
