// src/pages/Trial.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Trial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">BlankIT</div>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Back to Home</Button>
            <Button variant="secondary">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Trial Content */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your first document and experience BlankIT's powerful redaction technology.
          </p>
          
          {/* Placeholder for file upload */}
          <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Drag & drop a document here</p>
            <Button>Choose File</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trial;