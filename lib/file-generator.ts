import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import JSZip from "jszip"
import type { Recipient, DocumentDetails, GeneratedFile, GenerationProgress } from "./types"

export interface FileGenerationOptions {
  format: "pdf" | "png" | "jpg"
  quality?: number
  scale?: number
}

// 파일 크기 포맷팅 함수
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// HTML 템플릿 생성
function generateHTMLTemplate(recipient: Recipient, documentDetails: DocumentDetails): string {
  const safeValue = (value: string | undefined | null) => value || ""

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>초청장 - ${safeValue(recipient.name)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans KR', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .invitation {
          background: white;
          max-width: 600px;
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }
        
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        
        .title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        
        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 1.1rem;
          margin-bottom: 30px;
          line-height: 1.6;
          color: #374151;
        }
        
        .event-details {
          background: #f8fafc;
          border-radius: 15px;
          padding: 30px;
          margin: 30px 0;
          border-left: 5px solid #4f46e5;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 1rem;
        }
        
        .detail-item:last-child {
          margin-bottom: 0;
        }
        
        .detail-icon {
          width: 20px;
          height: 20px;
          margin-right: 15px;
          color: #4f46e5;
        }
        
        .detail-label {
          font-weight: 600;
          color: #1f2937;
          min-width: 80px;
        }
        
        .detail-value {
          color: #374151;
          flex: 1;
        }
        
        .description {
          background: #fef7ff;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid #e9d5ff;
          line-height: 1.6;
          color: #581c87;
        }
        
        .footer {
          text-align: center;
          padding: 30px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        
        .organizer {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .contact {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .decoration {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }
        
        .decoration:nth-child(2) {
          top: auto;
          bottom: -30px;
          left: -30px;
          width: 60px;
          height: 60px;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .invitation {
            box-shadow: none;
            max-width: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invitation">
        <div class="decoration"></div>
        <div class="decoration"></div>
        
        <div class="header">
          <h1 class="title">초청장</h1>
          <p class="subtitle">${safeValue(documentDetails.title)}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            안녕하세요, <strong>${safeValue(recipient.name)}</strong>님
            ${safeValue(recipient.position) ? `(${safeValue(recipient.position)})` : ""}
            <br><br>
            귀하를 ${safeValue(documentDetails.title)}에 정중히 초대합니다.
          </div>
          
          <div class="event-details">
            <div class="detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-label">일시</div>
              <div class="detail-value">${safeValue(documentDetails.date)} ${safeValue(documentDetails.time)}</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">📍</div>
              <div class="detail-label">장소</div>
              <div class="detail-value">${safeValue(documentDetails.location)}</div>
            </div>
            
            ${
              documentDetails.dresscode
                ? `
            <div class="detail-item">
              <div class="detail-icon">👔</div>
              <div class="detail-label">복장</div>
              <div class="detail-value">${safeValue(documentDetails.dresscode)}</div>
            </div>
            `
                : ""
            }
            
            ${
              documentDetails.rsvp
                ? `
            <div class="detail-item">
              <div class="detail-icon">✉️</div>
              <div class="detail-label">회신</div>
              <div class="detail-value">${safeValue(documentDetails.rsvp)}</div>
            </div>
            `
                : ""
            }
          </div>
          
          ${
            documentDetails.description
              ? `
          <div class="description">
            ${safeValue(documentDetails.description)}
          </div>
          `
              : ""
          }
          
          <div class="greeting">
            귀하의 참석을 기다리겠습니다.<br>
            감사합니다.
          </div>
        </div>
        
        <div class="footer">
          <div class="organizer">${safeValue(documentDetails.organizer)}</div>
          ${documentDetails.contact ? `<div class="contact">${safeValue(documentDetails.contact)}</div>` : ""}
        </div>
      </div>
    </body>
    </html>
  `
}

// 단일 파일 생성
export async function generateSingleFile(
  recipient: Recipient,
  documentDetails: DocumentDetails,
  options: FileGenerationOptions,
): Promise<GeneratedFile> {
  const htmlContent = generateHTMLTemplate(recipient, documentDetails)

  // 임시 DOM 요소 생성
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlContent
  tempDiv.style.position = "absolute"
  tempDiv.style.left = "-9999px"
  tempDiv.style.top = "-9999px"
  tempDiv.style.width = "800px"
  document.body.appendChild(tempDiv)

  try {
    const canvas = await html2canvas(tempDiv.querySelector(".invitation") as HTMLElement, {
      scale: options.scale || 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 800,
      height: 1000,
    })

    let url: string
    let size: number
    let blob: Blob

    if (options.format === "pdf") {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight)
      const pdfBlob = pdf.output("blob")
      blob = pdfBlob
      url = URL.createObjectURL(pdfBlob)
      size = pdfBlob.size
    } else {
      const quality = options.quality || 0.9
      const mimeType = options.format === "png" ? "image/png" : "image/jpeg"

      blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
          },
          mimeType,
          quality,
        )
      })
      url = URL.createObjectURL(blob)
      size = blob.size
    }

    return {
      id: `${recipient.id}_${options.format}`,
      recipientId: recipient.id,
      recipientName: recipient.name,
      fileType: options.format,
      fileName: `${recipient.name}_초청장.${options.format}`,
      url,
      blob,
      size,
      createdAt: new Date(),
    }
  } finally {
    document.body.removeChild(tempDiv)
  }
}

// 모든 파일 생성
export async function generateAllFiles(
  recipients: Recipient[],
  documentDetails: DocumentDetails,
  options: FileGenerationOptions,
  onProgress?: (progress: GenerationProgress) => void,
): Promise<GeneratedFile[]> {
  const generatedFiles: GeneratedFile[] = []
  const errors: string[] = []

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]

    if (onProgress) {
      onProgress({
        total: recipients.length,
        completed: i,
        current: recipient.name,
        status: "generating",
        errors,
      })
    }

    try {
      const file = await generateSingleFile(recipient, documentDetails, options)
      generatedFiles.push(file)
    } catch (error) {
      console.error(`파일 생성 실패 (${recipient.name}):`, error)
      errors.push(`${recipient.name}: 파일 생성 실패`)
    }

    // 잠시 대기 (브라우저 부하 방지)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  if (onProgress) {
    onProgress({
      total: recipients.length,
      completed: recipients.length,
      current: "",
      status: errors.length > 0 ? "error" : "completed",
      errors,
    })
  }

  return generatedFiles
}

// ZIP 파일 생성
export async function createZipFile(files: GeneratedFile[]): Promise<Blob> {
  const zip = new JSZip()

  for (const file of files) {
    try {
      zip.file(file.fileName, file.blob)
    } catch (error) {
      console.error(`ZIP 파일 추가 실패 (${file.recipientName}):`, error)
    }
  }

  return await zip.generateAsync({ type: "blob" })
}

// 파일 다운로드
export function downloadFile(data: string | Blob, filename: string): void {
  const link = document.createElement("a")
  const url = typeof data === "string" ? data : URL.createObjectURL(data)
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  if (typeof data !== "string") {
    URL.revokeObjectURL(url)
  }
}
