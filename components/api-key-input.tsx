"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react"

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void
  currentApiKey?: string
}

export function ApiKeyInput({ onApiKeySet, currentApiKey }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(currentApiKey || "")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    // OpenAI API 키 형식 검증 (sk-로 시작하고 최소 40자)
    const isValidFormat = value.startsWith("sk-") && value.length >= 40
    setIsValid(isValidFormat)
  }

  const handleSave = () => {
    if (isValid) {
      onApiKeySet(apiKey)
      localStorage.setItem("openai-api-key", apiKey) // 로컬 저장
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>OpenAI API 키 설정</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            AI 분석 기능을 사용하려면 OpenAI API 키가 필요합니다.{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              여기서 발급받으세요 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="apiKey">API 키</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className={`pr-10 ${isValid ? "border-green-500" : apiKey ? "border-red-500" : ""}`}
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
          {apiKey && !isValid && (
            <p className="text-sm text-red-600">올바른 OpenAI API 키 형식이 아닙니다. (sk-로 시작해야 함)</p>
          )}
        </div>

        <Button onClick={handleSave} disabled={!isValid} className="w-full">
          API 키 저장
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다</p>
          <p>• GPT-4 Vision 모델을 사용하므로 해당 모델에 대한 액세스 권한이 필요합니다</p>
        </div>
      </CardContent>
    </Card>
  )
}
