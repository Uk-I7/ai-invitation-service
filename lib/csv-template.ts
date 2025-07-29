import type { Recipient } from "./types"

export function generateCSVTemplate(includeSample = true): string {
  const headers = ["이름", "소속", "이메일", "전화번호", "직책"]
  const englishHeaders = ["name", "organization", "email", "phone", "position"]

  let csvContent = headers.join(",") + "\n"

  if (includeSample) {
    const sampleData = [
      ["홍길동", "ABC회사", "hong@example.com", "010-1234-5678", "부장"],
      ["김철수", "XYZ기업", "kim@example.com", "010-9876-5432", "팀장"],
      ["이영희", "DEF스타트업", "lee@example.com", "010-5555-7777", "대리"],
    ]

    sampleData.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })
  }

  return csvContent
}

export function generateEnglishCSVTemplate(includeSample = true): string {
  const headers = ["name", "organization", "email", "phone", "position"]

  let csvContent = headers.join(",") + "\n"

  if (includeSample) {
    const sampleData = [
      ["Hong Gil-dong", "ABC Company", "hong@example.com", "010-1234-5678", "Manager"],
      ["Kim Chul-su", "XYZ Corporation", "kim@example.com", "010-9876-5432", "Team Lead"],
      ["Lee Young-hee", "DEF Startup", "lee@example.com", "010-5555-7777", "Associate"],
    ]

    sampleData.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })
  }

  return csvContent
}

export function downloadCSV(content: string, filename: string) {
  // UTF-8 BOM을 추가하여 엑셀에서 한글이 깨지지 않도록 처리
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportRecipientsToCSV(recipients: Recipient[], filename = "수신자목록.csv") {
  const headers = ["이름", "소속", "이메일", "전화번호", "직책"]
  let csvContent = headers.join(",") + "\n"

  recipients.forEach((recipient) => {
    const row = [recipient.name, recipient.organization, recipient.email, recipient.phone, recipient.position || ""]
    csvContent += row.map((field) => `"${field}"`).join(",") + "\n"
  })

  downloadCSV(csvContent, filename)
}
