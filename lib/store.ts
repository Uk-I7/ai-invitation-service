"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProjectState, Recipient, DocumentDetails, DocumentTemplate, FeedbackItem, AttachedFile } from "./types"
import type { ImageAnalysisResult, DocumentAnalysisResult } from "./file-analysis"

interface ProjectStore extends ProjectState {
  setCurrentStep: (step: number) => void
  setRecipients: (recipients: Recipient[]) => void
  setDocumentDetails: (details: DocumentDetails) => void
  setTemplate: (template: DocumentTemplate) => void
  addFeedback: (feedback: FeedbackItem) => void
  clearFeedback: () => void
  setCompleted: (completed: boolean) => void
  reset: () => void
  // 분석 결과 저장 기능 추가
  analysisResults: (ImageAnalysisResult | DocumentAnalysisResult)[]
  setAnalysisResults: (results: (ImageAnalysisResult | DocumentAnalysisResult)[]) => void
  addAnalysisResult: (result: ImageAnalysisResult | DocumentAnalysisResult) => void
  // 첨부파일 관리 기능 추가
  attachedFiles: AttachedFile[]
  setAttachedFiles: (files: AttachedFile[]) => void
  addAttachedFile: (file: AttachedFile) => void
  removeAttachedFile: (fileId: string) => void
}

const initialState: ProjectState = {
  currentStep: 1,
  recipients: [],
  documentDetails: null,
  template: null,
  feedback: [],
  isCompleted: false,
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      ...initialState,
      analysisResults: [],
      attachedFiles: [],
      setCurrentStep: (step) => set({ currentStep: step }),
      setRecipients: (recipients) => set({ recipients }),
      setDocumentDetails: (documentDetails) => set({ documentDetails }),
      setTemplate: (template) => set({ template }),
      addFeedback: (feedback) =>
        set((state) => ({
          feedback: [...state.feedback, feedback],
        })),
      clearFeedback: () => set({ feedback: [] }),
      setCompleted: (isCompleted) => set({ isCompleted }),
      reset: () => set({ ...initialState, analysisResults: [], attachedFiles: [] }),
      setAnalysisResults: (analysisResults) => set({ analysisResults }),
      addAnalysisResult: (result) =>
        set((state) => ({
          analysisResults: [...state.analysisResults, result],
        })),
      setAttachedFiles: (attachedFiles) => set({ attachedFiles }),
      addAttachedFile: (file) =>
        set((state) => ({
          attachedFiles: [...state.attachedFiles, file],
        })),
      removeAttachedFile: (fileId) =>
        set((state) => ({
          attachedFiles: state.attachedFiles.filter((file) => file.id !== fileId),
        })),
    }),
    {
      name: "ai-document-project",
    },
  ),
)
