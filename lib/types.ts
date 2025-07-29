export interface Recipient {
  id: string
  name: string
  email: string
  phone?: string
  organization?: string
  position?: string
  department?: string
  personalizedMessage?: string
}

export interface DocumentDetails {
  title: string
  organizer: string
  date: string
  time?: string
  location: string
  description: string
  dresscode?: string
  contact: string
  rsvp?: string
}

export interface EventDetails {
  eventName: string
  date: string
  time: string
  location: string
  purpose: string
  description: string
  organizer: string
  contactInfo: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  content: string
  variables: string[]
  createdAt: Date
  updatedAt: Date
}

export interface FeedbackItem {
  id: string
  section: string
  type: "content" | "design" | "structure"
  priority: "high" | "medium" | "low"
  comment: string
  suggestion?: string
  createdAt: Date
}

export interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  file?: File
  uploadedAt: Date
  analyzed?: boolean
  analysisResult?:
    | {
        summary: string
        keyPoints: string[]
        suggestions: string[]
      }
    | string
}

export interface ProjectState {
  currentStep: number
  recipients: Recipient[]
  documentDetails: DocumentDetails | null
  template: DocumentTemplate | null
  feedback: FeedbackItem[]
  isCompleted: boolean
}

export interface GeneratedFile {
  id: string
  recipientId: string
  recipientName: string
  fileType: "pdf" | "png" | "jpg"
  fileName: string
  url: string
  blob: Blob
  size: number
  createdAt: Date
}

export interface GenerationProgress {
  total: number
  completed: number
  current: string
  status: "preparing" | "generating" | "completed" | "error"
  errors: string[]
}
