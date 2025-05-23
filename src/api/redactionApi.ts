// src/api/redactionApi.ts

export interface RedactionChange {
  redactionId: string;
  action: 'approve' | 'reject' | 'add';
  text?: string;
  type?: string;
}

export interface ReprocessResponse {
  success: boolean;
  processedText: string;
  downloadUrl: string;
}

export const reprocessDocument = async (
  documentId: string, 
  changes: RedactionChange[]
): Promise<ReprocessResponse> => {
  // Mock for now - you'll implement this weekend with your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        processedText: 'Updated document text with applied changes...',
        downloadUrl: `/api/download/${documentId}`
      });
    }, 2000);
  });
};

export const downloadRedactedDocument = async (documentId: string): Promise<string> => {
  // Mock for now - returns download URL
  return Promise.resolve(`/api/download/${documentId}`);
};

export const uploadDocument = async (file: File): Promise<{ documentId: string; status: string }> => {
  // Mock upload - you'll replace this with real upload to your S3 bucket
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        documentId: Math.random().toString(36).substr(2, 9),
        status: 'uploaded'
      });
    }, 1000);
  });
};

export const getDocumentStatus = async (documentId: string): Promise<{ status: string; progress?: number }> => {
  // Mock status check - you'll replace with real backend polling
  return Promise.resolve({
    status: 'ready',
    progress: 100
  });
};