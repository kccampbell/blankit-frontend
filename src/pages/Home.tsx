// src/pages/Home.tsx
import { useState } from 'react';
import Button from '../components/ui/Button';

const Home = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // TODO: Send email to backend
      console.log('Email submitted:', email);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">BlankIT</div>
          <div className="flex space-x-4">
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Enterprise</Button>
            <Button variant="secondary">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Fast, Secure Document Redaction
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Redact sensitive information from any document in seconds. 
            Our breakthrough unredaction technology gives you complete control.
          </p>
          
          {/* Email Capture */}
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Try 3 Documents Free</h3>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                >
                  Start Free Trial
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-green-600 font-medium">Check your email for access!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">⚡ Fast</h3>
            <p className="text-gray-600">Process documents in seconds, not hours</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">💰 Cheap</h3>
            <p className="text-gray-600">Pay per document, no monthly minimums</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">🎯 Easy</h3>
            <p className="text-gray-600">Simple interface, no training required</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-600">🔓 Unredact</h3>
            <p className="text-gray-600">Revolutionary unredaction technology</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;