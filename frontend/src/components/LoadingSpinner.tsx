import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      <p className="text-gray-600 text-lg font-medium">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;
