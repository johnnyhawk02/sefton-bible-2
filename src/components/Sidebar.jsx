import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { markdownCache } from '../utils/markdownCache';

function Sidebar({ markdownFiles }) {
  const location = useLocation();
  const linkRefs = useRef([]);

  const formatTitle = (filename) => {
    return filename
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Preload content when links become visible (tablet-friendly)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const filename = entry.target.dataset.filename;
            if (filename) {
              markdownCache.preload(filename);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    linkRefs.current.forEach((link) => {
      if (link) observer.observe(link);
    });

    return () => observer.disconnect();
  }, [markdownFiles]);

  return (
    <div className="h-full overflow-y-auto pl-2 pr-4 py-4">
      <div className="mb-4 mt-6">
        <div className="flex items-center mb-4 pl-2">
          <img 
            src="/logo.png" 
            alt="Gym Logo" 
            className="h-4 mr-2"
          />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Active Sefton
          </span>
        </div>
      </div>

      <nav className="space-y-0">
        {markdownFiles.map((file, index) => {
          const isActive = location.pathname === `/${file}`;
          return (
            <Link
              key={file}
              to={`/${file}`}
              ref={(el) => (linkRefs.current[index] = el)}
              data-filename={file}
              className={`flex items-center px-2 py-1 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 font-medium border border-gray-200 dark:border-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-800'
              }`}
            >
              <svg className="mr-2 w-4 h-4 opacity-40 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              {formatTitle(file)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
