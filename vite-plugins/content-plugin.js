import { readdir } from 'fs/promises';
import { join } from 'path';

export function contentPlugin() {
  return {
    name: 'content-plugin',
    configureServer(server) {
      // Add a middleware to serve the content manifest
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
    },
    buildStart() {
      // During build, generate a static manifest file
      this.addWatchFile(join(process.cwd(), 'content'));
    }
  };
}
