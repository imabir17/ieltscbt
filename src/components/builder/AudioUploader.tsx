'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X, Music } from 'lucide-react';

export default function AudioUploader({ url, onUploadSuccess }: { url: string | null, onUploadSuccess: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Only audio files are allowed.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Audio file exceeds the 20MB limit.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-emerald-900 text-sm">Audio Uploaded Successfully</p>
              <audio controls src={url} className="h-8 mt-2 w-64" />
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onUploadSuccess('')} // Reset
            className="text-emerald-700 hover:text-emerald-900 p-2"
            title="Remove Audio"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary-400'}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 size={32} className="text-primary-500 animate-spin mb-3" />
              <p className="text-slate-600 font-medium">Uploading Audio...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-3">
                <Music size={24} />
              </div>
              <p className="font-bold text-slate-700 mb-1">Click to upload Master Audio</p>
              <p className="text-sm text-slate-500">MP3, WAV up to 20MB</p>
              {error && <p className="text-sm font-medium text-red-600 mt-3">{error}</p>}
            </div>
          )}
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
