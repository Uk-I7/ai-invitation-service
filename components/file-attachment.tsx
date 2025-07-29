"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  File,
  X,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
} from "lucide-react"
import type { AttachedFile } from "@/lib/types"

interface FileAttachmentProps {
  files: AttachedFile[]
  onFilesChange: (files: AttachedFile[]) => void
  maxFiles?: number
  maxFileSize?: number // MB
  hasApiKey?: boolean
}

export function FileAttachment({
  files,
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  hasApiKey = false,
}: FileAttachmentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [analysisResults, setAnalysisResults] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 아이콘 가져오기
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.includes("pdf")) return FileText
    if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet
    if (type.includes("presentation") || type.includes("powerpoint")) return Presentation
    return File
  }

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 파일 업로드 시뮬레이션
  const simulateUpload = async (file: File): Promise<AttachedFile> => {
    const fileId = `file_${Date.now()}_${Math.random()}`

    // 업로드 진행률 시뮬레이션
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // AI 분석 시뮬레이션 (API 키가 있을 때만)
    let analysisResult = ""
    if (hasApiKey) {
      setAnalysisResults((prev) => ({ ...prev, [fileId]: "분석 중..." }))
      await new Promise((resolve) => setTimeout(resolve, 1500))

      analysisResult = `이 파일은 ${file.name}로, ${file.type} 형식입니다. 파일 크기는 ${formatFileSize(file.size)}이며, 문서 생성에 유용한 정보를 포함하고 있습니다.`
      setAnalysisResults((prev) => ({ ...prev, [fileId]: analysisResult }))
    }

    // 업로드 완료 후 진행률 제거
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })

    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
      uploadedAt: new Date(),
      analyzed: hasApiKey,
      analysisResult: analysisResult || undefined,
    }
  }

  // 파일 처리
  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles = Array.from(fileList)

      // 파일 개수 체크
      if (files.length + newFiles.length > maxFiles) {
        alert(`최대 ${maxFiles}개의 파일만 첨부할 수 있습니다.`)
        return
      }

      // 파일 크기 체크
      const oversizedFiles = newFiles.filter((file) => file.size > maxFileSize * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        alert(`파일 크기는 ${maxFileSize}MB를 초과할 수 없습니다.`)
        return
      }

      // 파일 업로드 처리
      const uploadedFiles: AttachedFile[] = []
      for (const file of newFiles) {
        try {
          const uploadedFile = await simulateUpload(file)
          uploadedFiles.push(uploadedFile)
        } catch (error) {
          console.error("파일 업로드 실패:", error)
          alert(`${file.name} 업로드에 실패했습니다.`)
        }
      }

      onFilesChange([...files, ...uploadedFiles])
    },
    [files, maxFiles, maxFileSize, hasApiKey, onFilesChange],
  )

  // 파일 제거
  const removeFile = useCallback(
    (fileId: string) => {
      const updatedFiles = files.filter((file) => file.id !== fileId)
      onFilesChange(updatedFiles)

      // 분석 결과도 제거
      setAnalysisResults((prev) => {
        const newResults = { ...prev }
        delete newResults[fileId]
        return newResults
      })

      // URL 정리
      const fileToRemove = files.find((file) => file.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
    },
    [files, onFilesChange],
  )

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [handleFiles],
  )

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles)
      }
      // input 값 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [handleFiles],
  )

  return (
    <div className="space-y-4">
      {/* 파일 업로드 영역 */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">파일을 드래그하여 놓거나 클릭하여 선택하세요</p>
            <p className="text-sm text-gray-500">
              최대 {maxFiles}개, 파일당 {maxFileSize}MB 이하
            </p>
            <p className="text-xs text-gray-400">지원 형식: PDF, PPT, DOCX, XLSX, 이미지 파일</p>
          </div>

          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => fileInputRef.current?.click()}>
            파일 선택
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* API 키 상태 안내 */}
      {!hasApiKey && files.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            API 키가 설정되지 않아 파일 분석 기능을 사용할 수 없습니다. 관리자 설정에서 OpenAI API 키를 등록하면
            첨부파일을 AI가 분석하여 더 정확한 문서를 생성할 수 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 첨부된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            첨부된 파일 ({files.length}/{maxFiles})
          </h4>

          {files.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isUploading = uploadProgress[file.id] !== undefined
            const progress = uploadProgress[file.id] || 0
            const analysisResult = analysisResults[file.id]

            return (
              <Card key={file.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <FileIcon className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!isUploading && (
                          <>
                            {file.url && (
                              <Button variant="ghost" size="sm" onClick={() => window.open(file.url, "_blank")}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 업로드 진행률 */}
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <Progress value={progress} className="flex-1" />
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      </div>
                    )}

                    {/* AI 분석 결과 */}
                    {hasApiKey && analysisResult && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          {analysisResult === "분석 중..." ? (
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-medium text-blue-800 mb-1">AI 분석 결과</p>
                            <p className="text-xs text-blue-700">{analysisResult}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 파일 첨부 안내 */}
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">아직 첨부된 파일이 없습니다.</p>
          <p className="text-xs">참고 자료를 첨부하면 더 정확한 문서를 생성할 수 있습니다.</p>
        </div>
      )}
    </div>
  )
}
