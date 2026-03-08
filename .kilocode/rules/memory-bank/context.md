# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a clean Next.js 16 starter with TypeScript and Tailwind CSS 4. It's ready for AI-assisted expansion to build any type of application.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] SpeedTest component with ipwho.is geolocation API
- [x] Refactored homepage into a tools landing page
- [x] Moved SpeedTest to its own dedicated page (`/speed-test`)
- [x] Added Modern CV Generator tool with multi-language support and PDF export
- [x] Fixed CV Generator preview scaling - removed zoom/transform scaling, made preview fully responsive with separate hidden A4 container for PDF export
- [x] Fixed PDF export LAB color error - normalized all colors to hex in html2canvas onclone callback

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page with tools grid | ✅ Ready |
| `src/app/speed-test/page.tsx` | Dedicated Speed Test page | ✅ Ready |
| `src/app/cv-generator/page.tsx` | Dedicated CV Generator page | ✅ Ready |
| `src/components/SpeedTest.tsx` | Speed test component | ✅ Ready |
| `src/components/CVGenerator.tsx` | CV Generator component | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-06 | Added SpeedTest component with ipwho.is geolocation API |
| 2026-03-07 | Refactored homepage into a tools landing page and moved SpeedTest to `/speed-test` |
| 2026-03-07 | Added Modern CV Generator tool with multi-language support and PDF export |
| 2026-03-08 | Fixed CV Generator preview scaling and PDF export LAB color error |
| 2026-03-08 | Fixed CV Generator preview scaling - removed zoom/transform, made responsive with hidden A4 container for PDF |
