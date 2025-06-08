import { Link, useLocation } from 'react-router-dom';

function Sidebar({ markdownFiles }) {
  const location = useLocation();

  const formatTitle = (filename) => {
    return filename
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

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
        {markdownFiles.map(file => {
          const isActive = location.pathname === `/${file}`;
          return (
            <Link
              key={file}
              to={`/${file}`}
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
