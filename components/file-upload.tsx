"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { parseCSV, validateRecipients } from "@/lib/csv-parser"
import type { Recipient } from "@/lib/types"
import { generateCSVTemplate, generateEnglishCSVTemplate, downloadCSV } from "@/lib/csv-template"

interface FileUploadProps {
  recipients: Recipient[]
  onRecipientsChange: (recipients: Recipient[]) => void
}

export function FileUpload({ recipients, onRecipientsChange }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [validationResults, setValidationResults] = useState<{ valid: Recipient[]; invalid: any[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setUploadStatus("processing")
    setErrorMessage("")
    setValidationResults(null)

    try {
      const text = await file.text()

      let parsedRecipients: Recipient[] = []

      if (file.name.endsWith(".json")) {
        const jsonData = JSON.parse(text)
        if (Array.isArray(jsonData)) {
          parsedRecipients = jsonData.map((item) => ({
            id: crypto.randomUUID(),
            name: item.name || "",
            organization: item.organization || item.company || "",
            email: item.email || "",
            phone: item.phone || "",
            position: item.position || "",
          }))
        } else {
          throw new Error("JSON 파일은 배열 형태여야 합니다.")
        }
      } else if (file.name.endsWith(".csv")) {
        parsedRecipients = parseCSV(text)
      } else {
        throw new Error("CSV 또는 JSON 파일만 지원됩니다.")
      }

      const validation = validateRecipients(parsedRecipients)
      setValidationResults(validation)

      if (validation.invalid.length === 0) {
        onRecipientsChange([...recipients, ...validation.valid])
        setUploadStatus("success")
      } else {
        setUploadStatus("error")
        setErrorMessage(`${validation.invalid.length}개의 잘못된 데이터가 있습니다.`)
      }
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "파일 처리 중 오류가 발생했습니다.")
    }
  }

  const handleDownloadTemplate = (type: "korean" | "english", withSample = true) => {
    const content = type === "korean" ? generateCSVTemplate(withSample) : generateEnglishCSVTemplate(withSample)

    const filename = withSample ? `초청장_수신자_템플릿_샘플포함.csv` : `초청장_수신자_템플릿_빈양식.csv`

    downloadCSV(content, filename)
  }

  const handleAddValidOnly = () => {
    if (validationResults) {
      onRecipientsChange([...recipients, ...validationResults.valid])
      setUploadStatus("success")
      setValidationResults(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>파일 업로드</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">CSV 또는 JSON 파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-gray-500 mb-4">최대 파일 크기: 10MB</p>
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadStatus === "processing"}>
              {uploadStatus === "processing" ? "처리 중..." : "파일 선택"}
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFileInput} className="hidden" />
          </div>

          {uploadStatus === "success" && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>파일이 성공적으로 업로드되었습니다!</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {validationResults && validationResults.invalid.length > 0 && (
            <div className="mt-4 space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationResults.valid.length}개의 유효한 데이터와 {validationResults.invalid.length}개의 오류가
                  발견되었습니다.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-medium text-red-600">오류 목록:</h4>
                {validationResults.invalid.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-sm bg-red-50 p-2 rounded">
                    <strong>{item.recipient.name || "이름 없음"}</strong>: {item.errors.join(", ")}
                  </div>
                ))}
                {validationResults.invalid.length > 5 && (
                  <p className="text-sm text-gray-500">... 외 {validationResults.invalid.length - 5}개</p>
                )}
              </div>

              <Button onClick={handleAddValidOnly} variant="outline">
                유효한 데이터만 추가 ({validationResults.valid.length}개)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>CSV 템플릿 다운로드</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate("korean", true)}>
                한글 템플릿 (샘플포함)
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate("korean", false)}>
                한글 템플릿 (빈양식)
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>추천:</strong> 템플릿을 다운로드하여 엑셀에서 편집한 후 업로드하세요. 한글이 깨지지 않도록 UTF-8
              인코딩으로 저장되어 있습니다.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-green-600">✅ 지원되는 헤더 (한글):</h4>
              <div className="text-sm bg-green-50 p-3 rounded">
                <code>이름, 소속, 이메일, 전화번호, 직책</code>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-600">✅ 지원되는 헤더 (영문):</h4>
              <div className="text-sm bg-blue-50 p-3 rounded">
                <code>name, organization, email, phone, position</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">📋 사용 방법:</h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>위의 "템플릿 다운로드" 버튼을 클릭하여 CSV 파일을 다운로드</li>
              <li>엑셀이나 구글 시트에서 파일을 열어 데이터 입력</li>
              <li>CSV 형식으로 저장 (엑셀: "다른 이름으로 저장" → "CSV UTF-8")</li>
              <li>위의 업로드 영역에 파일을 드래그하거나 선택하여 업로드</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-2">💡 팁:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                <strong>이름</strong>과 <strong>이메일</strong>은 필수 항목입니다
              </li>
              <li>전화번호는 "010-1234-5678" 형식을 권장합니다</li>
              <li>엑셀에서 저장할 때 "CSV UTF-8" 형식을 선택하면 한글이 깨지지 않습니다</li>
              <li>대량 데이터의 경우 JSON 형식도 지원됩니다</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
