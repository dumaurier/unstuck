# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm start` - Start development server (alias for dev:11ty)
- `npm run dev:11ty` - Start Eleventy development server with watch mode
- `npm run build` - Clean and build for production
- `npm run clean` - Remove dist and compiled CSS/JS files

### Utilities
- `npm run clean:og` - Remove generated Open Graph images
- `npm run favicons` - Generate favicon files
- `npm run colors` - Generate color tokens
- `npm run screenshots` - Generate screenshot images

## Architecture

This is an Eleventy static site built with the "Eleventy Excellent" starter template, customized for the "Unstuck" site by Josh Vogt.

### Core Technologies
- **Eleventy 3.0**: Static site generator with Nunjucks templating
- **TailwindCSS**: Utility-first CSS framework with custom design tokens
- **esbuild**: JavaScript bundling
- **PostCSS**: CSS processing with plugins

### Directory Structure
- `src/` - Source files
  - `_config/` - Eleventy configuration modules (collections, filters, plugins, etc.)
  - `_data/` - Global data files including design tokens
  - `_includes/` - Templates, partials, CSS, and JavaScript
  - `_layouts/` - Page layout templates
  - `assets/` - Static assets (fonts, images, CSS, JS)
  - `posts/` - Blog posts in Markdown
  - `pages/` - Static pages
  - `common/` - Shared templates (404, feeds, sitemap, etc.)
- `dist/` - Built site output

### Key Configuration Files
- `eleventy.config.js` - Main Eleventy configuration importing modular configs
- `tailwind.config.js` - Custom Tailwind setup with design tokens and CUBE CSS methodology
- `netlify.toml` - Netlify deployment configuration with security headers

### Design System
The site uses a design token system with JSON files in `src/_data/designTokens/`:
- Colors, typography, spacing, border radius defined as tokens
- Converted to Tailwind utilities via `tokensToTailwind()` function
- CUBE CSS methodology (Composition, Utility, Block, Exception)
- Responsive design with fluid typography using `clampGenerator()`

### Content Management
- Blog posts are Markdown files in `src/posts/`
- Collections defined in `src/_config/collections.js`
- Site metadata in `src/_data/meta.js`
- Navigation in `src/_data/navigation.js`

### Build Process
- CSS bundled from `src/_includes/css/` with PostCSS
- JavaScript bundled from `src/_includes/scripts/` with esbuild
- Images optimized with Eleventy Image plugin
- Open Graph images auto-generated for posts

### Notable Features
- WebC components for custom elements
- Syntax highlighting with Prism
- RSS/Atom feeds
- Theme switching (light/dark mode)
- Accessible navigation with drawer menu
- Progressive enhancement with is-land for component hydration