// src/pages/Trial.tsx
import { useState } from 'react';
import { DocumentIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import FileUploadZone from '../components/ui/FileUploadZone';

interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'queued' | 'processing' | 'ready' | 'completed' | 'error';
  uploadedAt: Date;
  size: number;
  pages?: number;
  progress?: number;
}

const Trial = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsRemaining, setDocumentsRemaining] = useState(3);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleFileUpload = (files: FileList) => {
    if (documentsRemaining <= 0) {
      alert('Trial limit reached! Upgrade to continue.');
      return;
    }

    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        status: 'uploading',
        uploadedAt: new Date(),
        size: file.size,
        progress: 0
      };

      setDocuments(prev => [newDoc, ...prev]);
      setDocumentsRemaining(prev => prev - 1);

      // Simulate upload progress
      simulateProcessing(newDoc.id);
    });
  };

  const simulateProcessing = (docId: string) => {
    // Simulate upload
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: 'queued' } : doc
      ));
    }, 1000);

    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: 'processing', pages: Math.floor(Math.random() * 10) + 1 } : doc
      ));
    }, 2000);

    // Simulate completion
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, status: 'ready' } : doc
      ));
    }, 4000);
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
      case 'queued':
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'ready':
        return <ExclamationCircleIcon className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'queued': return 'Queued';
      case 'processing': return 'Processing...';
      case 'ready': return 'Ready for review';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">BlankIT</h1>
            <span className="text-sm text-gray-500">Trial</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Trial ({documentsRemaining} documents remaining)
            </span>
            <span className="text-sm text-gray-600">trial@user.com</span>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
              <DocumentIcon className="w-4 h-4 mr-3" />
              Documents
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Document List */}
          <div className="flex-1 p-6">
            {documents.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload your first document
                </h3>
                <p className="text-gray-500 mb-6">
                  Drag and drop a file here, or click to browse
                </p>
                <FileUploadZone onFileUpload={handleFileUpload} />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Documents</h2>
                  <FileUploadZone onFileUpload={handleFileUpload} compact />
                </div>

                {/* Document List */}
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDoc?.id === doc.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {getStatusText(doc.status)} • {(doc.size / 1024).toFixed(1)} KB
                              {doc.pages && ` • ${doc.pages} pages`}
                            </p>
                          </div>
                        </div>
                        {doc.status === 'ready' && (
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Review →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Document Preview */}
          {selectedDoc && (
            <div className="w-96 bg-white border-l border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedDoc.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{getStatusText(selectedDoc.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <p className="text-sm text-gray-900">{(selectedDoc.size / 1024).toFixed(1)} KB</p>
                </div>
                {selectedDoc.pages && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pages</label>
                    <p className="text-sm text-gray-900">{selectedDoc.pages}</p>
                  </div>
                )}
                
                {selectedDoc.status === 'ready' && (
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Open Redaction Editor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trial;