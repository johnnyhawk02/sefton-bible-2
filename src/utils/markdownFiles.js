// Utility to get all markdown files dynamically
export const getMarkdownFiles = async () => {
  try {
    // First try to fetch the build-time generated manifest
    const manifestResponse = await fetch('/content-manifest.json');
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      return manifest.files || [];
    }
  } catch (error) {
    console.log('Build-time manifest not found, trying development API...');
  }

  try {
    // Fallback to development API from Vite plugin
    const response = await fetch('/api/content-manifest');
    if (response.ok) {
      const data = await response.json();
      return data.files || [];
    }
  } catch (error) {
    console.error('Development API not available, using fallback discovery...');
  }
  
  // Final fallback: manual discovery
  return await discoverMarkdownFiles();
};

// Fallback auto-discovery function
export const discoverMarkdownFiles = async () => {
  // List of actual markdown files in the content folder
  const potentialFiles = [
    'aiming-high',
    'class-descriptions',
    'dos-and-donts',
    'emergency-procedures',
    'end-of-day',
    'equipment-maintenance',
    'example-new-page',
    'faqs',
    'fitness-classes',
    'library',
    'memberships',
    'opening-procedure',
    'staff-guidelines',
    'till-checks'
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
