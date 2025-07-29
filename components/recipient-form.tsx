"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Recipient } from "@/lib/types"

interface RecipientFormProps {
  recipients: Recipient[]
  onRecipientsChange: (recipients: Recipient[]) => void
}

export function RecipientForm({ recipients, onRecipientsChange }: RecipientFormProps) {
  const [currentRecipient, setCurrentRecipient] = useState<Omit<Recipient, "id">>({
    name: "",
    organization: "",
    email: "",
    phone: "",
    position: "",
  })

  const handleAddRecipient = () => {
    if (!currentRecipient.name.trim() || !currentRecipient.email.trim()) {
      alert("이름과 이메일은 필수 항목입니다.")
      return
    }

    const newRecipient: Recipient = {
      ...currentRecipient,
      id: crypto.randomUUID(),
    }

    onRecipientsChange([...recipients, newRecipient])
    setCurrentRecipient({
      name: "",
      organization: "",
      email: "",
      phone: "",
      position: "",
    })
  }

  const handleRemoveRecipient = (id: string) => {
    onRecipientsChange(recipients.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>새 수신자 추가</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={currentRecipient.name}
                onChange={(e) => setCurrentRecipient((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="홍길동"
              />
            </div>
            <div>
              <Label htmlFor="organization">소속 *</Label>
              <Input
                id="organization"
                value={currentRecipient.organization}
                onChange={(e) => setCurrentRecipient((prev) => ({ ...prev, organization: e.target.value }))}
                placeholder="ABC 회사"
              />
            </div>
            <div>
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={currentRecipient.email}
                onChange={(e) => setCurrentRecipient((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="hong@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={currentRecipient.phone}
                onChange={(e) => setCurrentRecipient((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="010-1234-5678"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="position">직책</Label>
              <Input
                id="position"
                value={currentRecipient.position}
                onChange={(e) => setCurrentRecipient((prev) => ({ ...prev, position: e.target.value }))}
                placeholder="부장, 팀장 등"
              />
            </div>
          </div>
          <Button onClick={handleAddRecipient} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            수신자 추가
          </Button>
        </CardContent>
      </Card>

      {recipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>추가된 수신자 ({recipients.length}명)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{recipient.name}</div>
                    <div className="text-sm text-gray-600">
                      {recipient.organization} {recipient.position && `· ${recipient.position}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {recipient.email} {recipient.phone && `· ${recipient.phone}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
