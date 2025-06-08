// Simple in-memory cache for markdown content
class MarkdownCache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  // Get content from cache if available
  get(filename) {
    return this.cache.get(filename);
  }

  // Check if content is cached
  has(filename) {
    return this.cache.has(filename);
  }

  // Preload content (doesn't wait for result)
  preload(filename) {
    if (this.has(filename) || this.loadingPromises.has(filename)) {
      return; // Already cached or loading
    }

    const loadPromise = this.load(filename);
    this.loadingPromises.set(filename, loadPromise);
    
    // Clean up promise when done (success or failure)
    loadPromise.finally(() => {
      this.loadingPromises.delete(filename);
    });
  }

  // Preload adjacent pages (previous and next in the list) - tablet-friendly
  preloadAdjacent(currentFilename, allFilenames) {
    const currentIndex = allFilenames.indexOf(currentFilename);
    
    // Previous page
    if (currentIndex > 0) {
      this.preload(allFilenames[currentIndex - 1]);
    }
    
    // Next page
    if (currentIndex < allFilenames.length - 1) {
      this.preload(allFilenames[currentIndex + 1]);
    }
  }

  // Load content and cache it
  async load(filename) {
    if (this.has(filename)) {
      return this.get(filename);
    }

    if (this.loadingPromises.has(filename)) {
      return this.loadingPromises.get(filename);
    }

    const loadPromise = this.fetchContent(filename);
    this.loadingPromises.set(filename, loadPromise);

    try {
      const content = await loadPromise;
      this.cache.set(filename, content);
      return content;
    } catch (error) {
      // Don't cache errors, allow retry
      throw error;
    } finally {
      this.loadingPromises.delete(filename);
    }
  }

  // Private method to fetch content
  async fetchContent(filename) {
    const response = await fetch(`/content/${filename}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}.md`);
    }
    return response.text();
  }
}

// Export singleton instance
export const markdownCache = new MarkdownCache();
