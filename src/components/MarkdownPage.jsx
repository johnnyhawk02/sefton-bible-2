import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/notion.css';

function MarkdownPage({ filename }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch(`/content/${filename}.md`);
        if (!response.ok) {
          throw new Error(`Failed to load ${filename}.md`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err.message);
        setContent('');
      }
    };

    loadMarkdown();
  }, [filename]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading content</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="notion-content px-6 py-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom components with Notion-like styling
            h1: ({ node, ...props }) => (
              <h1 className="page-title" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table {...props} />
              </div>
            ),
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <div className="code">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              ) : (
                <code {...props}>
                  {children}
                </code>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} />
            ),
            p: ({ node, ...props }) => (
              <p {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} />
            ),
            li: ({ node, ...props }) => (
              <li {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownPage;
