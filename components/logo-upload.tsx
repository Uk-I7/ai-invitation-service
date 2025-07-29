"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageIcon, X, CheckCircle } from "lucide-react"

interface LogoFile {
  id: string
  name: string
  url: string
  file: File
}

interface LogoUploadProps {
  onLogoChange: (logo: LogoFile | null) => void
  currentLogo?: LogoFile | null
}

export function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [logo, setLogo] = useState<LogoFile | null>(currentLogo || null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
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

  const handleFile = (file: File) => {
    setError("")

    // 이미지 파일 체크
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.")
      return
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    const logoFile: LogoFile = {
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }

    setLogo(logoFile)
    onLogoChange(logoFile)
  }

  const handleRemove = () => {
    if (logo) {
      URL.revokeObjectURL(logo.url)
    }
    setLogo(null)
    onLogoChange(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>기관 로고 업로드</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!logo ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 mb-2">로고 이미지를 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-gray-500 mb-4">PNG, JPG, SVG 파일 지원 (최대 5MB)</p>
            <p className="text-xs text-blue-600 mb-4">
              💡 <strong>자동 배치:</strong> 업로드된 로고는 문서 하단 중앙에 자동으로 배치됩니다
            </p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              로고 선택
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>로고가 성공적으로 업로드되었습니다!</AlertDescription>
            </Alert>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={logo.url || "/placeholder.svg"}
                alt="로고 미리보기"
                className="w-16 h-16 object-contain bg-white rounded border"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{logo.name}</div>
                <div className="text-xs text-gray-500">하단 중앙에 자동 배치됩니다</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
