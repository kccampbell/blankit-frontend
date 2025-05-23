// src/components/ui/FileUploadZone.tsx
import { useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadZoneProps {
  onFileUpload: (files: FileList) => void;
  compact?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload, compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  if (compact) {
    return (
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Upload Files
        </button>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        onChange={handleFileSelect}
        className="hidden"
      />
      <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">
        Drop files here or <span className="text-blue-600">browse</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports PDF, Word, Excel, PowerPoint (max 5MB, 20 pages)
      </p>
    </div>
  );
};

export default FileUploadZone;