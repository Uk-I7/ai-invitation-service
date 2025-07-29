"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminStore } from "@/lib/admin-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Key,
  Building,
  ImageIcon,
  Palette,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  X,
  Home,
} from "lucide-react"

export function AdminSettings() {
  const router = useRouter()
  const {
    apiKey,
    organizationName,
    organizationAddress,
    organizationPhone,
    organizationEmail,
    logoFile,
    defaultDesignTemplate,
    isConfigured,
    setApiKey,
    setOrganizationInfo,
    setLogoFile,
    setDefaultDesignTemplate,
    reset,
  } = useAdminStore()

  const [showApiKey, setShowApiKey] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [tempOrgInfo, setTempOrgInfo] = useState({
    name: organizationName,
    address: organizationAddress,
    phone: organizationPhone,
    email: organizationEmail,
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const handleApiKeySave = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setApiKey(tempApiKey)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 500)
  }

  const handleOrgInfoSave = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setOrganizationInfo(tempOrgInfo)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 500)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const logoData = {
          name: file.name,
          url: e.target?.result as string,
          size: file.size,
        }
        setLogoFile(logoData)
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRemove = () => {
    setLogoFile(null)
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleTemplateChange = (template: string) => {
    setDefaultDesignTemplate(template)
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleReset = () => {
    if (confirm("모든 설정을 초기화하시겠습니까?")) {
      reset()
      setTempApiKey("")
      setTempOrgInfo({ name: "", address: "", phone: "", email: "" })
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const isApiKeyValid = tempApiKey.startsWith("sk-") && tempApiKey.length >= 40
  const isOrgInfoValid = tempOrgInfo.name && tempOrgInfo.email

  return (
    <div className="space-y-6">
      {/* 헤더 네비게이션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 페이지
          </Button>
        </div>
        {saveStatus === "saved" && (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            저장됨
          </Badge>
        )}
        {saveStatus === "saving" && <Badge variant="secondary">저장 중...</Badge>}
      </div>

      {/* 상태 표시 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>설정 상태</span>
            {isConfigured ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                설정 완료
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="w-4 h-4 mr-1" />
                설정 권장
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConfigured ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                관리자 설정이 완료되었습니다. 모든 기능을 사용할 수 있습니다.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                기본 설정을 완료하면 더 편리하게 서비스를 이용할 수 있습니다. 설정하지 않아도 기본 기능은 사용
                가능합니다.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${apiKey ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm">API 키</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${organizationName ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm">기관 정보</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${logoFile ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm">로고</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${defaultDesignTemplate ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm">기본 템플릿</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 탭 */}
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>API 키</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>기관 정보</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4" />
            <span>로고</span>
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>템플릿</span>
          </TabsTrigger>
        </TabsList>

        {/* API 키 설정 */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI API 키 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  AI 분석 기능을 사용하려면 OpenAI API 키가 필요합니다.
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    여기서 발급받으세요
                  </a>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API 키</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={`pr-10 ${isApiKeyValid ? "border-green-500" : tempApiKey ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {tempApiKey && !isApiKeyValid && (
                  <p className="text-sm text-red-600">올바른 OpenAI API 키 형식이 아닙니다. (sk-로 시작해야 함)</p>
                )}
              </div>

              <Button onClick={handleApiKeySave} disabled={!isApiKeyValid || saveStatus === "saving"}>
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === "saving" ? "저장 중..." : "API 키 저장"}
              </Button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다</p>
                <p>• GPT-4 Vision 모델을 사용하므로 해당 모델에 대한 액세스 권한이 필요합니다</p>
                <p>• API 키가 없어도 서비스 이용은 가능하지만 첨부파일 AI 분석 기능은 사용할 수 없습니다</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기관 정보 설정 */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>기관 정보 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">기관명 *</Label>
                  <Input
                    id="orgName"
                    value={tempOrgInfo.name}
                    onChange={(e) => setTempOrgInfo({ ...tempOrgInfo, name: e.target.value })}
                    placeholder="예: AI이노베이션협회"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">이메일 *</Label>
                  <Input
                    id="orgEmail"
                    type="email"
                    value={tempOrgInfo.email}
                    onChange={(e) => setTempOrgInfo({ ...tempOrgInfo, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgAddress">주소</Label>
                <Input
                  id="orgAddress"
                  value={tempOrgInfo.address}
                  onChange={(e) => setTempOrgInfo({ ...tempOrgInfo, address: e.target.value })}
                  placeholder="서울시 강남구 테헤란로 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgPhone">전화번호</Label>
                <Input
                  id="orgPhone"
                  value={tempOrgInfo.phone}
                  onChange={(e) => setTempOrgInfo({ ...tempOrgInfo, phone: e.target.value })}
                  placeholder="02-1234-5678"
                />
              </div>

              <Button onClick={handleOrgInfoSave} disabled={!isOrgInfoValid || saveStatus === "saving"}>
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === "saving" ? "저장 중..." : "기관 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 로고 설정 */}
        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>기관 로고 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {logoFile ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={logoFile.url || "/placeholder.svg"}
                      alt="기관 로고"
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{logoFile.name}</p>
                      <p className="text-sm text-gray-500">크기: {(logoFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogoRemove}>
                      <X className="w-4 h-4 mr-2" />
                      제거
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">로고 파일을 업로드하세요</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      파일 선택
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• 지원 형식: PNG, JPG, GIF, SVG</p>
                <p>• 최대 파일 크기: 5MB</p>
                <p>• 권장 크기: 200x200px 이상</p>
                <p>• 설정된 로고는 모든 문서에 자동으로 포함됩니다</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 템플릿 설정 */}
        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>기본 디자인 템플릿</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: "modern-business", name: "모던 비즈니스", desc: "깔끔하고 전문적인 디자인" },
                  { id: "elegant-formal", name: "엘레간트 포멀", desc: "우아하고 격식있는 디자인" },
                  { id: "creative-modern", name: "크리에이티브 모던", desc: "창의적이고 현대적인 디자인" },
                  { id: "minimal-clean", name: "미니멀 클린", desc: "심플하고 깔끔한 디자인" },
                ].map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      defaultDesignTemplate === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      {defaultDesignTemplate === template.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{template.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 초기화 버튼 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">위험 구역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">모든 설정 초기화</p>
              <p className="text-sm text-red-600">이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <Button variant="destructive" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
