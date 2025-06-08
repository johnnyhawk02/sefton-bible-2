import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownPage from './components/MarkdownPage';
import DarkModeToggle from './components/DarkModeToggle';
import InstallButton from './components/InstallButton';
import { discoverMarkdownFiles, getMarkdownFiles } from './utils/markdownFiles';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [markdownFiles, setMarkdownFiles] = useState([]);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDarkMode);
    document.body.classList.toggle('dark', savedDarkMode);

    // Automatically discover markdown files
    const loadMarkdownFiles = async () => {
      try {
        const files = await getMarkdownFiles();
        setMarkdownFiles(files);
      } catch (error) {
        console.error('Error loading markdown files:', error);
        // Fallback to hardcoded list
        setMarkdownFiles(['welcome', 'how-to-sign-up', 'shift-checklist']);
      }
    };

    loadMarkdownFiles();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.classList.toggle('dark', newDarkMode);
  };

  return (
    <Router>
      <div className="flex h-full bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <Sidebar markdownFiles={markdownFiles} />
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
            <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            {markdownFiles.map(file => (
              <Route
                key={file}
                path={`/${file}`}
                element={<MarkdownPage filename={file} allFiles={markdownFiles} />}
              />
            ))}
          </Routes>
        </div>
      </div>
      <InstallButton />
    </Router>
  );
}

export default App;
