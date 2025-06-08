import { readdir, readFile, mkdir, copyFile } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

export function contentPlugin() {
  return {
    name: 'content-plugin',
    configureServer(server) {
      // Serve content manifest
      server.middlewares.use('/api/content-manifest', async (req, res) => {
        try {
          const contentDir = join(process.cwd(), 'content');
          const files = await readdir(contentDir);
          const mdFiles = files
            .filter(file => file.endsWith('.md'))
            .map(file => file.replace('.md', ''))
            .sort();
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ files: mdFiles }));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to read content directory' }));
        }
      });

      // Serve markdown files directly from /content in development
      server.middlewares.use('/content', async (req, res, next) => {
        if (!req.url.endsWith('.md')) {
          return next();
        }

        try {
          const filePath = join(process.cwd(), 'content', req.url.slice(1));
          if (existsSync(filePath)) {
            const content = await readFile(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown');
            res.end(content);
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        } catch (error) {
          res.statusCode = 500;
          res.end('Server error');
        }
      });
    },

    async buildStart() {
      // Watch the content directory for changes
      this.addWatchFile(join(process.cwd(), 'content'));

      // Copy content files to public/content for production build
      try {
        const contentDir = join(process.cwd(), 'content');
        const publicContentDir = join(process.cwd(), 'public', 'content');
        
        // Create public/content directory if it doesn't exist
        if (!existsSync(publicContentDir)) {
          await mkdir(publicContentDir, { recursive: true });
        }

        // Copy all markdown files
        const files = await readdir(contentDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        for (const file of mdFiles) {
          const srcPath = join(contentDir, file);
          const destPath = join(publicContentDir, file);
          await copyFile(srcPath, destPath);
        }

        console.log(`✅ Copied ${mdFiles.length} markdown files to public/content`);
      } catch (error) {
        console.error('❌ Error copying content files:', error);
      }
    }
  };
}
