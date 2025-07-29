import type { Recipient } from "./types"

export function parseCSV(csvText: string): Recipient[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) throw new Error("CSV 파일에 헤더와 최소 1개의 데이터 행이 필요합니다.")

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  const recipients: Recipient[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const recipient: Recipient = {
      id: crypto.randomUUID(),
      name: "",
      organization: "",
      email: "",
      phone: "",
      position: "",
    }

    headers.forEach((header, index) => {
      const value = values[index] || ""
      switch (header) {
        case "name":
        case "이름":
          recipient.name = value
          break
        case "organization":
        case "소속":
        case "회사":
          recipient.organization = value
          break
        case "email":
        case "이메일":
          recipient.email = value
          break
        case "phone":
        case "전화번호":
        case "연락처":
          recipient.phone = value
          break
        case "position":
        case "직책":
        case "직위":
          recipient.position = value
          break
      }
    })

    if (recipient.name || recipient.email) {
      recipients.push(recipient)
    }
  }

  return recipients
}

export function validateRecipients(recipients: Recipient[]): {
  valid: Recipient[]
  invalid: { recipient: Recipient; errors: string[] }[]
} {
  const valid: Recipient[] = []
  const invalid: { recipient: Recipient; errors: string[] }[] = []

  recipients.forEach((recipient) => {
    const errors: string[] = []

    if (!recipient.name.trim()) errors.push("이름이 필요합니다")
    if (!recipient.email.trim()) errors.push("이메일이 필요합니다")
    if (recipient.email && !isValidEmail(recipient.email)) errors.push("올바른 이메일 형식이 아닙니다")

    if (errors.length === 0) {
      valid.push(recipient)
    } else {
      invalid.push({ recipient, errors })
    }
  })

  return { valid, invalid }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
