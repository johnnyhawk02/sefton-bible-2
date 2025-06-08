// Utility to get all markdown files dynamically
export const getMarkdownFiles = async () => {
  try {
    // Fetch the manifest from our Vite plugin API
    const response = await fetch('/api/content-manifest');
    if (!response.ok) {
      throw new Error('Failed to fetch content manifest');
    }
    
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    
    // Fallback: try to discover files manually
    return await discoverMarkdownFiles();
  }
};

// Fallback auto-discovery function
export const discoverMarkdownFiles = async () => {
  // List of potential file names to check as fallback
  const potentialFiles = [
    'welcome',
    'introduction', 
    'intro',
    'getting-started',
    'how-to-sign-up',
    'sign-up',
    'membership',
    'shift-checklist', 
    'checklist',
    'daily-tasks',
    'procedures',
    'emergency',
    'policies',
    'training',
    'customer-service',
    'faq',
    'troubleshooting',
    'library',
    'opening-procedure'
  ];

  const existingFiles = [];
  
  for (const file of potentialFiles) {
    try {
      const response = await fetch(`/content/${file}.md`, { method: 'HEAD' });
      if (response.ok) {
        existingFiles.push(file);
      }
    } catch (error) {
      // File doesn't exist, skip it
    }
  }

  return existingFiles;
};
