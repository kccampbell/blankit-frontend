// src/pages/RedactionEditor.tsx
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowDownTrayIcon, EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface DetectedRedaction {
  id: string;
  text: string;
  type: 'PERSON' | 'EMAIL' | 'PHONE' | 'ADDRESS' | 'ORGANIZATION' | 'SSN' | 'CUSTOM';
  position: { start: number; end: number };
  status: 'approved' | 'rejected' | 'pending';
  confidence: number;
  instances?: number; // How many times this text appears
}

interface DocumentData {
  id: string;
  name: string;
  originalText: string;
  processedText: string;
  redactions: DetectedRedaction[];
}

const RedactionEditor = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const textViewerRef = useRef<HTMLDivElement>(null);
  
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [selectedRedaction, setSelectedRedaction] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isAddingRedaction, setIsAddingRedaction] = useState(false);
  const [newRedactionType, setNewRedactionType] = useState<DetectedRedaction['type']>('CUSTOM');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = () => {
    // Mock document with AI-detected redactions
    const mockDoc: DocumentData = {
      id: documentId!,
      name: 'confidential-report.pdf',
      originalText: `CONFIDENTIAL REPORT
      
Employee Information:
Name: John Smith
Email: john.smith@acmecorp.com  
Phone: (555) 123-4567
SSN: 123-45-6789
Address: 123 Main Street, Anytown, ST 12345

Company: Acme Corporation
Project: Project Alpha
Manager: Sarah Johnson
Contact: sarah.j@acmecorp.com

Additional Notes:
Please contact John Smith at john.smith@acmecorp.com for any questions regarding Project Alpha.
Acme Corporation has been working on this initiative since January 2024.`,
      
      processedText: `CONFIDENTIAL REPORT
      
Employee Information:
Name: [REDACTED - PERSON]
Email: [REDACTED - EMAIL]  
Phone: [REDACTED - PHONE]
SSN: [REDACTED - SSN]
Address: [REDACTED - ADDRESS]

Company: [REDACTED - ORGANIZATION]
Project: Project Alpha
Manager: [REDACTED - PERSON]
Contact: [REDACTED - EMAIL]

Additional Notes:
Please contact [REDACTED - PERSON] at [REDACTED - EMAIL] for any questions regarding Project Alpha.
[REDACTED - ORGANIZATION] has been working on this initiative since January 2024.`,
      
      redactions: [
        { id: '1', text: 'John Smith', type: 'PERSON', position: { start: 45, end: 55 }, status: 'approved', confidence: 0.95, instances: 2 },
        { id: '2', text: 'john.smith@acmecorp.com', type: 'EMAIL', position: { start: 62, end: 85 }, status: 'approved', confidence: 0.98, instances: 2 },
        { id: '3', text: '(555) 123-4567', type: 'PHONE', position: { start: 94, end: 108 }, status: 'approved', confidence: 0.97, instances: 1 },
        { id: '4', text: '123-45-6789', type: 'SSN', position: { start: 114, end: 125 }, status: 'approved', confidence: 0.99, instances: 1 },
        { id: '5', text: '123 Main Street, Anytown, ST 12345', type: 'ADDRESS', position: { start: 135, end: 169 }, status: 'approved', confidence: 0.92, instances: 1 },
        { id: '6', text: 'Acme Corporation', type: 'ORGANIZATION', position: { start: 180, end: 196 }, status: 'approved', confidence: 0.94, instances: 2 },
        { id: '7', text: 'Sarah Johnson', type: 'PERSON', position: { start: 220, end: 233 }, status: 'approved', confidence: 0.91, instances: 1 },
        { id: '8', text: 'sarah.j@acmecorp.com', type: 'EMAIL', position: { start: 243, end: 263 }, status: 'approved', confidence: 0.96, instances: 1 },
      ]
    };
    setDocument(mockDoc);
  };

  const toggleRedaction = (redactionId: string) => {
    if (!document) return;
    
    setDocument(prev => ({
      ...prev!,
      redactions: prev!.redactions.map(r => 
        r.id === redactionId 
          ? { ...r, status: r.status === 'approved' ? 'rejected' : 'approved' }
          : r
      )
    }));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setIsAddingRedaction(true);
    }
  };

  const addCustomRedaction = () => {
    if (!selectedText || !document) return;

    // Count instances of this text
    const instances = (document.originalText.match(new RegExp(selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    
    const newRedaction: DetectedRedaction = {
      id: Math.random().toString(36).substr(2, 9),
      text: selectedText,
      type: newRedactionType,
      position: { start: 0, end: 0 }, // Would be calculated properly
      status: 'approved',
      confidence: 1.0,
      instances
    };

    setDocument(prev => ({
      ...prev!,
      redactions: [...prev!.redactions, newRedaction]
    }));

    setIsAddingRedaction(false);
    setSelectedText('');
    
    // Clear text selection
    window.getSelection()?.removeAllRanges();
  };

  const applyAllInstances = (redactionId: string) => {
    if (!document) return;
    
    const redaction = document.redactions.find(r => r.id === redactionId);
    if (!redaction) return;

    // Mock: Would tell backend to redact all instances
    alert(`Would redact all ${redaction.instances} instances of "${redaction.text}" as ${redaction.type}`);
  };

  const reprocessDocument = async () => {
    setIsProcessing(true);
    
    // Mock API call to reprocess with user changes
    setTimeout(() => {
      // Simulate regenerating processed text based on user choices
      let newProcessedText = document!.originalText;
      
      document!.redactions
        .filter(r => r.status === 'approved')
        .forEach(redaction => {
          const regex = new RegExp(redaction.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          newProcessedText = newProcessedText.replace(regex, `[REDACTED - ${redaction.type}]`);
        });

      setDocument(prev => ({
        ...prev!,
        processedText: newProcessedText
      }));
      
      setIsProcessing(false);
    }, 2000);
  };

  const downloadDocument = () => {
    alert('Download would start here with the reprocessed document!');
    navigate('/trial');
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/trial')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium">{document.name}</h1>
            {isProcessing && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Reprocessing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {document.redactions.filter(r => r.status === 'approved').length} active redactions
            </span>
            <button
              onClick={reprocessDocument}
              disabled={isProcessing}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply Changes
            </button>
            <button
              onClick={downloadDocument}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Redaction List */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">Detected Redactions</h3>
          
          <div className="space-y-3">
            {document.redactions.map((redaction) => (
              <div
                key={redaction.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedRedaction === redaction.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRedaction(redaction.id === selectedRedaction ? null : redaction.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    redaction.type === 'PERSON' ? 'bg-purple-100 text-purple-700' :
                    redaction.type === 'EMAIL' ? 'bg-blue-100 text-blue-700' :
                    redaction.type === 'PHONE' ? 'bg-green-100 text-green-700' :
                    redaction.type === 'ADDRESS' ? 'bg-yellow-100 text-yellow-700' :
                    redaction.type === 'ORGANIZATION' ? 'bg-red-100 text-red-700' :
                    redaction.type === 'SSN' ? 'bg-pink-100 text-pink-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {redaction.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRedaction(redaction.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      redaction.status === 'approved' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={redaction.status === 'approved' ? 'Click to unredact' : 'Click to redact'}
                  >
                    {redaction.status === 'approved' ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                
                <p className="text-sm font-medium text-gray-900 mb-1 break-words">"{redaction.text}"</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(redaction.confidence * 100)}% confidence</span>
                  <span>{redaction.instances} instance{redaction.instances !== 1 ? 's' : ''}</span>
                </div>
                
                {redaction.instances && redaction.instances > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      applyAllInstances(redaction.id);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Apply to all {redaction.instances} instances →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Redaction */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Add Custom Redaction</h4>
            <p className="text-sm text-gray-600 mb-3">
              Select text in the document, then choose the redaction type.
            </p>
            {selectedText && !isAddingRedaction && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Selected: "{selectedText}"
                </p>
                <button
                  onClick={() => setIsAddingRedaction(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Add as redaction →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Document Viewer */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-8">
              <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                💡 <strong>Tip:</strong> Select any text in the document below to add custom redactions
              </div>
              <div
                ref={textViewerRef}
                className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed select-text cursor-text"
                onMouseUp={handleTextSelection}
                style={{ userSelect: 'text' }}
              >
                {document.processedText}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Redaction Modal */}
      {isAddingRedaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Custom Redaction
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Selected text: "<strong className="text-gray-900">{selectedText}</strong>"
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redaction Type
                </label>
                <select
                  value={newRedactionType}
                  onChange={(e) => setNewRedactionType(e.target.value as DetectedRedaction['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PERSON">Person</option>
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Phone Number</option>
                  <option value="ADDRESS">Address</option>
                  <option value="ORGANIZATION">Organization</option>
                  <option value="SSN">SSN</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={addCustomRedaction}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Redaction
                </button>
                <button
                  onClick={() => {
                    setIsAddingRedaction(false);
                    setSelectedText('');
                    window.getSelection()?.removeAllRanges();
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedactionEditor;