import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { markdownCache } from '../utils/markdownCache';
import '../styles/notion.css';

function MarkdownPage({ filename, allFiles }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        // Check cache first for instant loading
        if (markdownCache.has(filename)) {
          const cachedContent = markdownCache.get(filename);
          setContent(cachedContent);
          setError(null);
          
          // Preload adjacent pages in background for tablet navigation
          if (allFiles) {
            markdownCache.preloadAdjacent(filename, allFiles);
          }
          return;
        }

        // Load from cache (which handles fetch internally)
        const content = await markdownCache.load(filename);
        setContent(content);
        setError(null);
        
        // Preload adjacent pages in background for tablet navigation
        if (allFiles) {
          markdownCache.preloadAdjacent(filename, allFiles);
        }
      } catch (err) {
        setError(err.message);
        setContent('');
      }
    };

    loadMarkdown();
  }, [filename, allFiles]);

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

  // Show content immediately when available, or empty div while loading
  return (
    <div className="h-full overflow-y-auto">
      <div className="notion-content px-6 py-1">
        {content && (
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
        )}
      </div>
    </div>
  );
}

export default MarkdownPage;
