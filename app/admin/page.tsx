"use client"

import { AdminSettings } from "@/components/admin-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 설정</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  베타 버전
                </Badge>
                <Badge variant="outline" className="text-xs">
                  로컬 저장
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            AI 초청장 서비스의 기본 설정을 관리합니다. 모든 설정은 브라우저에 로컬로 저장됩니다.
          </p>
        </div>

        {/* 베타 버전 안내 */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p>
                <strong>베타 버전 안내:</strong>
              </p>
              <p>• 현재 누구나 이 관리자 페이지에 접근할 수 있습니다</p>
              <p>• 모든 설정은 개인 브라우저에만 저장되며 다른 사용자와 공유되지 않습니다</p>
              <p>• API 키와 같은 민감한 정보는 안전하게 로컬 스토리지에 저장됩니다</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* 권한 안내 */}
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Shield className="w-5 h-5" />
              <span>접근 권한 안내</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>
                • <strong>현재 상태:</strong> 베타 테스트 모드 - 누구나 접근 가능
              </p>
              <p>
                • <strong>데이터 보안:</strong> 모든 설정은 개인 브라우저에만 저장
              </p>
              <p>
                • <strong>정식 버전:</strong> 추후 인증 시스템이 추가될 예정입니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 설정 컴포넌트 */}
        <AdminSettings />
      </div>
    </div>
  )
}
