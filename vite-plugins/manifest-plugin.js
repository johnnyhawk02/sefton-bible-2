import fs from 'fs';
import path from 'path';

// Generate a manifest of all markdown files at build time
export function generateContentManifest() {
  return {
    name: 'generate-content-manifest',
    generateBundle() {
      const contentDir = path.resolve('content');
      const publicContentDir = path.resolve('public/content');
      
      // Ensure public/content directory exists
      if (!fs.existsSync(publicContentDir)) {
        fs.mkdirSync(publicContentDir, { recursive: true });
      }
      
      // Get all .md files from content directory
      const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''))
        .sort();
      
      // Copy markdown files to public/content
      files.forEach(file => {
        const srcPath = path.join(contentDir, `${file}.md`);
        const destPath = path.join(publicContentDir, `${file}.md`);
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      });
      
      // Generate manifest.json with all files
      const manifest = {
        files: files,
        generated: new Date().toISOString()
      };
      
      // Write manifest to public directory
      const manifestPath = path.resolve('public/content-manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log(`Generated content manifest with ${files.length} files:`, files);
    }
  };
}
