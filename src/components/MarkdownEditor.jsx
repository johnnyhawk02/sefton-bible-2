import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function MarkdownEditor({ filename, onClose }) {
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, [filename]);

  const loadContent = async () => {
    try {
      const response = await fetch(`/content/${filename}.md`);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // For now, just copy to clipboard since we can't save files directly from browser
    try {
      await navigator.clipboard.writeText(content);
      alert('Content copied to clipboard! Paste it into your editor and save manually.');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback: show content in a new window for manual copying
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${content}</pre>`);
    }
    setIsSaving(false);
  };

  const insertFormatting = (before, after = '') => {
    const textarea = document.querySelector('.markdown-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Editing: {filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Copying...' : 'Copy'}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Simple Toolbar */}
      {!isPreview && (
        <div className="flex items-center space-x-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => insertFormatting('**', '**')}
            className="px-3 py-1 text-sm font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Bold"
          >
            Bold
          </button>
          <button
            onClick={() => insertFormatting('*', '*')}
            className="px-3 py-1 text-sm italic bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Italic"
          >
            Italic
          </button>
          <button
            onClick={() => insertFormatting('## ')}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Heading"
          >
            Header
          </button>
          <button
            onClick={() => insertFormatting('- ')}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="List"
          >
            List
          </button>
          <button
            onClick={() => insertFormatting('> ')}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Quote"
          >
            Quote
          </button>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto px-6 py-4">
            <div className="notion-content max-w-none prose dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            className="markdown-textarea w-full h-full px-6 py-4 bg-transparent resize-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed border-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start editing your markdown content..."
            style={{ 
              fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              lineHeight: '1.6'
            }}
          />
        )}
      </div>
    </div>
  );
}
