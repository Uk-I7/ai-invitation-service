export interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith("image/")) return "🖼️"
  if (fileType.includes("pdf")) return "📄"
  if (fileType.includes("word") || fileType.includes("document")) return "📝"
  if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "📊"
  if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📈"
  return "📎"
}

export function isValidFileType(fileType: string): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ]
  return allowedTypes.includes(fileType)
}

export function createFileUrl(file: File): string {
  return URL.createObjectURL(file)
}
