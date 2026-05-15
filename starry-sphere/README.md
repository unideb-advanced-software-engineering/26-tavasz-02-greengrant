# GreenGrant Documentation Site

Documentation for the GreenGrant platform – Astro + Starlight based.

Built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

## 🚀 Quick Start

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The site will be available at `http://localhost:3000`.

## 📖 Documentation Contents

- **Specifications** – SRS, Architectural Characteristics, ASRs
- **Architecture** – Styles, patterns, design decisions
- **ADRs** – Architectural Decision Records (5 total)
- **C4 Diagrams** – System context and container diagrams

## 📁 Project Structure

```
src/content/docs/
├── index.mdx                  # Welcome page
├── general/                   # Getting Started
├── specification/             # SRS, AC, ASR
├── architecture/
│   └── styles.md             # Architecture Styles
└── adrs/                      # ADRs (auto-organized)
```

## ✏️ Editing

Add or edit `.md` files in `src/content/docs/`. The sidebar auto-updates.

Example:
```yaml
---
title: "My Page"
description: "Short description"
---

# Content
```

## 🔗 Links

- **GitHub:** https://github.com/unideb-advanced-software-engineering/26-tavasz-02-greengrant
- **Astro Docs:** https://docs.astro.build/
- **Starlight Docs:** https://starlight.astro.build/

│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
