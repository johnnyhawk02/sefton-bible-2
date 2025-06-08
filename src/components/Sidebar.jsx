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
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reception Bible
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Staff Training Guide
        </p>
      </div>

      <nav className="space-y-1">
        {markdownFiles.map((file, index) => {
          const isActive = location.pathname === `/${file}`;
          return (
            <Link
              key={file}
              to={`/${file}`}
              ref={(el) => (linkRefs.current[index] = el)}
              data-filename={file}
              className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 font-medium border border-gray-200 dark:border-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/30 border border-transparent hover:border-gray-100 dark:hover:border-gray-800'
              }`}
            >
              {formatTitle(file)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
