const contentCache = new Map();

export const preloadContent = async (filename) => {
  if (contentCache.has(filename)) {
    return contentCache.get(filename);
  }

  try {
    const response = await fetch(`/content/${filename}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}.md`);
    }
    const text = await response.text();
    contentCache.set(filename, text);
    return text;
  } catch (error) {
    console.error(`Error preloading ${filename}:`, error);
    return null;
  }
};

export const getCachedContent = (filename) => {
  return contentCache.get(filename);
};

export const setCachedContent = (filename, content) => {
  contentCache.set(filename, content);
};

// Preload adjacent pages (previous and next in the list)
export const preloadAdjacentPages = async (currentFilename, allFilenames) => {
  const currentIndex = allFilenames.indexOf(currentFilename);
  const toPreload = [];
  
  // Previous page
  if (currentIndex > 0) {
    toPreload.push(allFilenames[currentIndex - 1]);
  }
  
  // Next page
  if (currentIndex < allFilenames.length - 1) {
    toPreload.push(allFilenames[currentIndex + 1]);
  }
  
  // Preload in background
  toPreload.forEach(filename => {
    preloadContent(filename);
  });
};
