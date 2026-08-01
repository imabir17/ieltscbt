'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading1, Heading2 } from 'lucide-react';
import { useCallback, useRef } from 'react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function RichTextEditor({ content, onChange, placeholder }: { content: string, onChange: (html: string) => void, placeholder?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] max-w-none p-4',
      },
    },
  });

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image exceeds the 5MB size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      editor.chain().focus().setImage({ src: base64Url }).run();
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Heading 2"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Heading 3"
        >
          <Heading2 size={16} />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-600"
          title="Insert Image (<5MB)"
        >
          <ImageIcon size={16} />
        </button>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        {/* We apply a generic prose class to format the editor's output nicely */}
        <div className="min-h-[150px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
