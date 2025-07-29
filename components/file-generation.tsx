"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Archive,
  ImageIcon,
  Users,
  Clock,
  HardDrive,
} from "lucide-react"
import {
  generateAllFiles,
  createZipFile,
  downloadFile,
  formatFileSize,
  type GeneratedFile,
  type GenerationProgress,
} from "@/lib/file-generator"
import type { DocumentTemplate, Recipient } from "@/lib/types"

interface FileGenerationProps {
  template: DocumentTemplate
  designTemplate: any
  recipients: Recipient[]
  logoUrl?: string | null
}

export function FileGeneration({ template, designTemplate, recipients, logoUrl }: FileGenerationProps) {
  const [fileType, setFileType] = useState<"pdf" | "png" | "jpg">("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([])
  const [progress, setProgress] = useState<GenerationProgress | null>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!template || !recipients || recipients.length === 0) {
      setError("템플릿 또는 수신자 정보가 없습니다.")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedFiles([])
    setProgress({
      current: 0,
      total: recipients.length,
      currentRecipient: "",
      status: "preparing",
    })

    try {
      const files = await generateAllFiles(template, designTemplate, recipients, fileType, logoUrl, setProgress)

      setGeneratedFiles(files)
    } catch (error) {
      console.error("파일 생성 오류:", error)
      setError(`파일 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadAll = async () => {
    if (generatedFiles.length === 0) return

    try {
      const zipBlob = await createZipFile(generatedFiles)
      const fileName = `초청장_전체_${recipients.length}명_${new Date().toISOString().split("T")[0]}.zip`
      downloadFile(zipBlob, fileName)
    } catch (error) {
      console.error("ZIP 파일 생성 오류:", error)
      setError("ZIP 파일 생성 중 오류가 발생했습니다.")
    }
  }

  const handleDownloadSingle = (file: GeneratedFile) => {
    try {
      downloadFile(file.blob, file.fileName)
    } catch (error) {
      console.error("파일 다운로드 오류:", error)
      setError("파일 다운로드 중 오류가 발생했습니다.")
    }
  }

  const getTotalSize = () => {
    return generatedFiles.reduce((total, file) => total + file.size, 0)
  }

  const getProgressPercentage = () => {
    if (!progress) return 0
    return (progress.current / progress.total) * 100
  }

  const getStatusMessage = () => {
    if (!progress) return ""

    switch (progress.status) {
      case "preparing":
        return "파일 생성 준비 중..."
      case "generating":
        return `${progress.currentRecipient} 파일 생성 중... (${progress.current}/${progress.total})`
      case "completed":
        return `모든 파일 생성 완료! (${progress.total}개)`
      case "error":
        return progress.error || "오류 발생"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* 파일 생성 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>파일 생성 설정</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">파일 형식 선택</label>
              <Select value={fileType} onValueChange={(value: "pdf" | "png" | "jpg") => setFileType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <div>
                        <div className="font-medium">PDF</div>
                        <div className="text-xs text-gray-500">인쇄 및 공유에 최적화</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="png">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">PNG</div>
                        <div className="text-xs text-gray-500">고품질 이미지, 투명 배경 지원</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="jpg">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">JPG</div>
                        <div className="text-xs text-gray-500">작은 파일 크기, 웹 공유 최적화</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{recipients.length}</div>
                <div className="text-sm text-gray-600">생성될 파일 수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{fileType.toUpperCase()}</div>
                <div className="text-sm text-gray-600">선택된 형식</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(recipients.length * (fileType === "pdf" ? 0.5 : 0.8))}MB
                </div>
                <div className="text-sm text-gray-600">예상 용량</div>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  파일 생성 중...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {recipients.length}개 파일 생성 시작
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 진행 상황 */}
      {isGenerating && progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>파일 생성 진행 중</span>
              </div>
              <Badge variant="outline">{Math.round(getProgressPercentage())}% 완료</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={getProgressPercentage()} className="w-full" />
              <div className="text-center text-sm text-gray-600">{getStatusMessage()}</div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{progress.current}</div>
                  <div className="text-gray-500">완료</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-600">{progress.total - progress.current}</div>
                  <div className="text-gray-500">대기</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">{progress.total}</div>
                  <div className="text-gray-500">전체</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 생성 완료 */}
      {generatedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>파일 생성 완료!</span>
              </div>
              <Button onClick={handleDownloadAll} className="bg-green-600 hover:bg-green-700">
                <Archive className="w-4 h-4 mr-2" />
                전체 다운로드 (ZIP)
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{generatedFiles.length}개의 파일이 성공적으로 생성되었습니다!</strong>
                    <br />총 용량: {formatFileSize(getTotalSize())}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{generatedFiles.length}명</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(getTotalSize())}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">파일 목록</TabsTrigger>
                <TabsTrigger value="summary">생성 요약</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {generatedFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                        <div>
                          <div className="font-medium text-sm">{file.recipientName}</div>
                          <div className="text-xs text-gray-500">
                            {file.fileName} • {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {file.fileType.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadSingle(file)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">생성 통계</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>총 파일 수:</span>
                        <span className="font-medium">{generatedFiles.length}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>파일 형식:</span>
                        <span className="font-medium">{fileType.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 용량:</span>
                        <span className="font-medium">{formatFileSize(getTotalSize())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>평균 파일 크기:</span>
                        <span className="font-medium">{formatFileSize(getTotalSize() / generatedFiles.length)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>생성 완료 시간:</span>
                        <span className="font-medium">{generatedFiles[0]?.generatedAt.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">수신자 기관별 분포</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(
                        generatedFiles.reduce(
                          (acc, file) => {
                            const recipient = recipients.find((r) => r.id === file.recipientId)
                            const org = recipient?.organization || "기타"
                            acc[org] = (acc[org] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([org, count]) => (
                        <div key={org} className="flex justify-between">
                          <span className="truncate">{org}:</span>
                          <span className="font-medium">{count}명</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 오류 표시 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 사용 안내 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">파일 사용 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              • <strong>PDF:</strong> 인쇄용으로 최적화되어 있으며, 모든 디바이스에서 동일하게 표시됩니다
            </p>
            <p>
              • <strong>PNG:</strong> 고품질 이미지로 웹사이트나 소셜미디어 공유에 적합합니다
            </p>
            <p>
              • <strong>JPG:</strong> 파일 크기가 작아 이메일 첨부나 메신저 전송에 편리합니다
            </p>
            <p>
              • <strong>ZIP 다운로드:</strong> 모든 파일을 한 번에 다운로드하여 일괄 관리할 수 있습니다
            </p>
            <p>
              • <strong>개별 다운로드:</strong> 특정 수신자의 파일만 선택적으로 다운로드할 수 있습니다
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
