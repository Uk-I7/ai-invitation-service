import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export interface ImageAnalysisResult {
  designStyle: {
    layout: string
    colorScheme: string
    typography: string
    tone: "formal" | "casual" | "friendly" | "official"
  }
  suggestions: string[]
  extractedText?: string
}

export interface DocumentAnalysisResult {
  keyPoints: string[]
  tone: string
  suggestions: string[]
  summary: string
}

// 올바른 방식으로 OpenAI 클라이언트 생성
export async function analyzeImage(imageFile: File, apiKey: string): Promise<ImageAnalysisResult> {
  if (!apiKey) {
    throw new Error("API 키가 필요합니다.")
  }

  // OpenAI 클라이언트 생성
  const openai = createOpenAI({
    apiKey: apiKey,
  })

  // 이미지를 base64로 변환
  const base64Image = await fileToBase64(imageFile)

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 이미지를 분석해서 다음 정보를 JSON 형태로 제공해주세요:

1. 디자인 스타일 분석:
   - layout: 레이아웃 특징 (예: "헤더-본문-푸터 구조", "2단 구성" 등)
   - colorScheme: 주요 색상 (예: "파란색 계열", "회색 톤" 등)  
   - typography: 폰트 스타일 (예: "깔끔한 고딕체", "정식 명조체" 등)
   - tone: 전체적인 톤 ("formal", "casual", "friendly", "official" 중 하나)

2. 디자인 제안사항 (배열로 3-5개)

3. 이미지에서 읽을 수 있는 텍스트가 있다면 추출

응답은 반드시 순수한 JSON만 반환하고 마크다운 코드 블록은 사용하지 마세요:
{"designStyle":{"layout":"...","colorScheme":"...","typography":"...","tone":"..."},"suggestions":["...","...","..."],"extractedText":"..."}`,
            },
            {
              type: "image",
              image: base64Image,
            },
          ],
        },
      ],
    })

    // JSON 추출 로직 개선
    let jsonText = text.trim()

    // 마크다운 코드 블록 제거
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    return JSON.parse(jsonText)
  } catch (error) {
    console.error("이미지 분석 오류:", error)
    // JSON 파싱 실패시 기본값 반환
    return {
      designStyle: {
        layout: "표준 문서 형식",
        colorScheme: "기본 색상",
        typography: "표준 폰트",
        tone: "formal",
      },
      suggestions: ["이미지 분석 중 오류가 발생했습니다."],
      extractedText: "",
    }
  }
}

export async function analyzeDocument(file: File, apiKey: string): Promise<DocumentAnalysisResult> {
  if (!apiKey) {
    throw new Error("API 키가 필요합니다.")
  }

  // OpenAI 클라이언트 생성
  const openai = createOpenAI({
    apiKey: apiKey,
  })

  const content = await file.text()

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 문서 내용을 분석해서 순수한 JSON 형태로 정보를 제공해주세요. 마크다운 코드 블록은 사용하지 마세요.

파일명: ${file.name}
내용: ${content}

분석 요청사항:
1. 핵심 포인트 3-5개 추출
2. 문서의 전체적인 톤 분석
3. 이 내용을 바탕으로 공문/안내문 작성시 제안사항
4. 문서 요약

응답 형식 (순수 JSON만):
{"keyPoints":["핵심1","핵심2","핵심3"],"tone":"문서의 톤 설명","suggestions":["제안1","제안2","제안3"],"summary":"문서 요약"}`,
    })

    // JSON 추출 로직 개선
    let jsonText = text.trim()

    // 마크다운 코드 블록 제거
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    return JSON.parse(jsonText)
  } catch (error) {
    console.error("문서 분석 오류:", error)
    return {
      keyPoints: ["문서 분석 중 오류가 발생했습니다."],
      tone: "분석 불가",
      suggestions: ["파일을 다시 확인해주세요."],
      summary: "분석 실패",
    }
  }
}

// 템플릿 생성 함수 추가
export async function generateDocumentTemplate(
  documentDetails: any,
  recipients: any[],
  analysisResults: (ImageAnalysisResult | DocumentAnalysisResult)[],
  apiKey: string,
): Promise<any> {
  if (!apiKey) {
    throw new Error("API 키가 필요합니다.")
  }

  const openai = createOpenAI({
    apiKey: apiKey,
  })

  // 분석 결과 요약
  const designAnalysis = analysisResults.filter((r) => "designStyle" in r) as ImageAnalysisResult[]
  const documentAnalysis = analysisResults.filter((r) => "keyPoints" in r) as DocumentAnalysisResult[]

  const analysisContext = {
    designStyle: designAnalysis.length > 0 ? designAnalysis[0].designStyle : null,
    keyPoints: documentAnalysis.flatMap((d) => d.keyPoints),
    suggestions: [...designAnalysis.flatMap((d) => d.suggestions), ...documentAnalysis.flatMap((d) => d.suggestions)],
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 정보를 바탕으로 공문/안내문 템플릿을 순수한 JSON 형태로 생성해주세요. 마크다운 코드 블록은 사용하지 마세요.

문서 정보:
- 제목: ${documentDetails.title}
- 날짜: ${documentDetails.date}
- 시간: ${documentDetails.time || "미정"}
- 장소: ${documentDetails.location || "미정"}
- 목적: ${documentDetails.purpose}
- 상세 설명: ${documentDetails.description}
- 주최자: ${documentDetails.organizer}
- 연락처: ${documentDetails.contactInfo}

수신자 정보:
- 총 ${recipients.length}명
- 주요 소속: ${[...new Set(recipients.map((r) => r.organization))].slice(0, 3).join(", ")}

분석 결과 참고사항:
${analysisContext.designStyle ? `- 디자인 톤: ${analysisContext.designStyle.tone}` : ""}
${analysisContext.keyPoints.length > 0 ? `- 핵심 포인트: ${analysisContext.keyPoints.slice(0, 3).join(", ")}` : ""}
${analysisContext.suggestions.length > 0 ? `- 제안사항: ${analysisContext.suggestions.slice(0, 2).join(", ")}` : ""}

다음 JSON 형식으로 템플릿을 생성해주세요 (순수 JSON만):
{"header":"문서 상단 인사말 및 제목 부분","body":"본문 내용 (구체적인 정보 포함)","footer":"마무리 인사 및 연락처","cta":"참여 요청이나 회신 요청 문구","style":{"tone":"formal","color":"추천 색상","layout":"추천 레이아웃"}}

주의사항:
- 수신자별로 개인화할 수 있도록 {{name}}, {{organization}}, {{position}} 등의 플레이스홀더 사용
- 한국어 공문 형식에 맞는 정중한 표현 사용
- 분석 결과의 톤과 스타일을 반영`,
    })

    // JSON 추출 로직 개선
    let jsonText = text.trim()

    // 마크다운 코드 블록 제거
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    return JSON.parse(jsonText)
  } catch (error) {
    console.error("템플릿 생성 오류:", error)
    return {
      header: "템플릿 생성 중 오류가 발생했습니다.",
      body: "다시 시도해주세요.",
      footer: "감사합니다.",
      cta: "",
      style: {
        tone: "formal",
        color: "기본",
        layout: "표준",
      },
    }
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = (error) => reject(error)
  })
}
