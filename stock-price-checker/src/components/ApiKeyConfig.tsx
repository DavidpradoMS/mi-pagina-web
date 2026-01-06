import { useState } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ApiKeyConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyConfig = ({ isOpen, onClose }: ApiKeyConfigProps) => {
  const { apiKey, setApiKey } = useStore();
  const [inputValue, setInputValue] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">API Key Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-textMuted mb-4">
          Enter your Alpha Vantage API key to start tracking stock prices.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your API key"
            className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <a
          href="https://www.alphavantage.co/support/#api-key"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:underline mb-6"
        >
          <ExternalLink className="w-4 h-4" />
          Get a free API key
        </a>

        <button
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className="w-full bg-accent hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Save API Key
        </button>
      </div>
    </div>
  );
};
