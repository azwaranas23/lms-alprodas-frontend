import { useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// CKEditor configuration interface
interface CKEditorConfig {
  toolbar?: {
    items: string[];
  };
  heading?: {
    options: Array<{
      model: string;
      title: string;
      class: string;
      view?: string;
    }>;
  };
  table?: {
    contentToolbar: string[];
  };
  placeholder?: string;
}

// CKEditor instance interface
interface CKEditorInstance {
  setData: (data: string) => void;
  getData: () => string;
  destroy: () => Promise<void>;
  ui: {
    view: {
      editable: {
        element: HTMLElement;
      };
    };
  };
  model: {
    document: {
      on: (event: string, callback: () => void) => void;
    };
  };
}

// CKEditor ClassicEditor interface
interface CKEditorClassicEditor {
  create: (element: HTMLElement, config?: CKEditorConfig) => Promise<CKEditorInstance>;
}

// Declare global ClassicEditor for CDN script
declare global {
  interface Window {
    ClassicEditor?: CKEditorClassicEditor;
  }
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className = ""
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [editor, setEditor] = useState<CKEditorInstance | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if ClassicEditor already exists
    if (window.ClassicEditor) {
      setScriptLoaded(true);
      return;
    }

    // Load CKEditor script - same as HTML
    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load CKEditor script:', error);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!scriptLoaded || !editorRef.current || editor || disabled) return;

    const initEditor = async () => {
      try {
        const editorInstance = await window.ClassicEditor!.create(editorRef.current!, {
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'link', '|',
              'bulletedList', 'numberedList', '|',
              'outdent', 'indent', '|',
              'blockQuote', 'insertTable', '|',
              'undo', 'redo'
            ]
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells'
            ]
          },
          placeholder: placeholder
        });

        // Set initial content
        editorInstance.setData(value || '');

        // Set minimum height like in HTML
        const editableElement = editorInstance.ui.view.editable.element;
        if (editableElement) {
          editableElement.style.minHeight = '400px';
        }

        // Listen for content changes
        editorInstance.model.document.on('change:data', () => {
          const data = editorInstance.getData();
          onChange(data);
        });

        setEditor(editorInstance);
      } catch (error) {
        console.error('Error initializing CKEditor:', error);
      }
    };

    initEditor();

    return () => {
      if (editor) {
        editor.destroy().catch((error: unknown) => {
          console.error('Error destroying CKEditor:', error);
        });
      }
    };
  }, [scriptLoaded, disabled, placeholder]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getData()) {
      editor.setData(value || '');
    }
  }, [value, editor]);

  if (!mounted || !scriptLoaded) {
    return (
      <div className={`${className}`}>
        <div className="border border-[#DCDEDD] rounded-[16px] p-4 min-h-[400px] bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Hidden textarea that will be replaced by CKEditor */}
      <textarea
        ref={editorRef}
        className="w-full p-4 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-normal"
        rows={15}
        placeholder={placeholder}
        defaultValue={value}
        style={{ minHeight: '400px' }}
      />

      {/* Custom CKEditor height styling - same as HTML */}
      <style>{`
        .ck-editor__editable {
          min-height: 400px !important;
        }
      `}</style>
    </div>
  );
}