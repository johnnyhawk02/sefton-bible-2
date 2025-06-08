<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Reception Bible - Copilot Instructions

This is a React 18 + Vite app using Tailwind CSS v3 for a leisure centre staff training application.

## Project Structure
- Built with React 18 and Vite for fast development
- Styled with Tailwind CSS v3 (NOT v4)
- Uses react-markdown with remark-gfm and rehype-raw for GitHub-flavored markdown
- Content is stored in `/content` folder as .md files
- Components follow a minimal, Notion-like design philosophy

## Key Requirements
- Ultra-minimal design optimized for portrait tablets
- Dark mode support using Tailwind's class strategy
- Fixed-width sidebar (w-48) with scrollable content
- Independent scrolling for sidebar and main content
- All markdown files auto-discovered and routed
- Typography uses Tailwind's prose classes

## Design Philosophy
- No icons except for dark mode toggle
- Clean, generous spacing
- Focus on information clarity
- Touch-friendly interface for tablets
- Resembles Notion's visual style

## Development Notes
- Always use Tailwind CSS v3 syntax and classes
- Prefer function components with hooks
- Use React Router for navigation
- Markdown files served from public/content directory
- Hot reload works for both React components and markdown files
