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
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
