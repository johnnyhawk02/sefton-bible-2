# Reception Bible - Staff Training PWA

Ultra-minimal, Notion-style training app for leisure centre staff built with React 18, Vite, and Tailwind CSS v3.

## ✨ Features

- **Progressive Web App (PWA)** - Install on tablets and phones like a native app
- **Ultra-minimal design** - Optimized for portrait tablets with Notion-inspired styling
- **Dark mode support** - Toggle between light and dark themes
- **Auto-generated navigation** - Sidebar menu generated from markdown files
- **Offline capable** - Service worker caches content for offline access
- **Touch-friendly** - Designed for tablet interaction
- **Markdown content** - GitHub-flavored markdown with rich formatting

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Adding Content
1. Add `.md` files to the `/content` folder
2. Files are automatically discovered and added to the sidebar
3. Hot reload works for both React components and markdown files

## 📱 PWA Installation

The app includes PWA functionality:
- **Manifest file** (`/public/manifest.json`) for app metadata
- **Service worker** (`/public/sw.js`) for offline caching
- **Install button** appears when PWA installation is available
- **App icons** in 192x192 and 512x512 sizes

Users can install the app directly from their browser or via the "Install App" button that appears on supported devices.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Auto-generated sidebar navigation
│   ├── MarkdownPage.jsx     # Markdown file renderer
│   ├── DarkModeToggle.jsx   # Dark mode toggle button
│   └── InstallButton.jsx    # PWA install button
├── styles/
│   └── notion.css           # Notion-inspired content styling
└── utils/
    ├── markdownFiles.js     # Markdown file discovery
    └── serviceWorker.js     # PWA service worker registration

content/                     # Markdown content files
public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icon-192.png           # PWA icon (192x192)
└── icon-512.png           # PWA icon (512x512)
```

## 🎨 Design Philosophy

- **No icons** except for dark mode toggle and PWA install
- **Clean, generous spacing** for tablet readability
- **Fixed-width sidebar** (w-48) with independent scrolling
- **Notion-like typography** using Tailwind's prose classes
- **Touch-friendly interface** optimized for tablets
