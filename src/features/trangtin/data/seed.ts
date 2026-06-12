import type { ArticleInput } from "../types";

const cover = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?w=800&h=500&fit=crop&q=80&auto=format`;

export const SEED_ARTICLES: ArticleInput[] = [
  {
    title: "Next.js 16 and the Future of React Server Components",
    slug: "nextjs-16-and-react-server-components",
    description:
      "Overview of Next.js 16, App Router, and how to optimize performance with React Server Components.",
    content:
      "Next.js 16 continues to strengthen the App Router model with React Server Components (RSC). The biggest win is less JavaScript sent to the client, which means faster pages and better SEO.\n\nWith RSC, you can fetch data directly in server components without useEffect. That simplifies code and reduces request waterfalls.\n\nSplit interactive parts (client components) from static display (server components). Combine ISR and caching to balance fresh data with speed.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1555066931-4365d14bab8c"),
    author: "Chanh Dang",
  },
  {
    title: "TypeScript Tips for Large Next.js Projects",
    slug: "typescript-tips-for-large-nextjs-projects",
    description:
      "Practical TypeScript patterns for safer, maintainable Next.js codebases at scale.",
    content:
      "TypeScript catches bugs early and makes refactoring safer. In Next.js projects, define clear types for page props, API responses, and domain models.\n\nUse zod or similar validators at boundaries (API routes, form submits) for runtime safety. Avoid any; prefer unknown when parsing external data.\n\nOrganize types by feature domain instead of one giant types file. Teams can work in parallel more effectively.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1516116216624-53e697fedbea"),
    author: "Chanh Dang",
  },
  {
    title: "Modern News UI Design with Tailwind CSS",
    slug: "modern-news-ui-with-tailwind-css",
    description:
      "UI principles for news websites: typography, spacing, and dark mode done right.",
    content:
      "News sites must prioritize readability. Clear typography scale, generous line-height, and sufficient contrast are essential.\n\nTailwind CSS builds layouts quickly with utility classes. Pair it with @tailwindcss/typography for article prose styling.\n\nDesign dark mode from the start, not as an afterthought. Use CSS variables or next-themes for smooth theme switching.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1561070791-2526d30994b5"),
    author: "Chanh Dang",
  },
  {
    title: "Ship an MVP Startup in 2 Weeks with Next.js",
    slug: "ship-mvp-startup-in-2-weeks-with-nextjs",
    description:
      "A practical workflow to launch fast: core features first, SEO basics included.",
    content:
      "An MVP does not need to be perfect — it needs to solve a real pain point. Week 1: landing page, basic auth, core feature flow.\n\nNext.js fits MVPs well with SSR/SSG, simple routing, and fast Vercel deploys. Reuse UI libraries like shadcn/ui to save time.\n\nWeek 2: collect feedback, fix critical bugs, add analytics. Do not over-engineer databases or microservices too early.",
    categorySlug: "khoi-nghiep",
    coverImage: cover("photo-1559136555-9303baea8ebd"),
    author: "Chanh Dang",
  },
  {
    title: "AI and the Future of Software Development",
    slug: "ai-and-the-future-of-software-development",
    description:
      "How developers use AI coding assistants while keeping code quality high.",
    content:
      "AI does not replace developers — it accelerates repetitive work: boilerplate, test skeletons, small refactors. Developers still review logic, architecture, and security.\n\nUse AI for scaffolding and drafts, but always verify edge cases and performance. AI can also help with commit messages and PR descriptions.\n\nSpecific prompts with codebase context and clear constraints produce much better output.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1677442136019-21780ecad995"),
    author: "Chanh Dang",
  },
  {
    title: "SEO Checklist for Next.js News Websites",
    slug: "seo-checklist-for-nextjs-news-websites",
    description:
      "Metadata, structured data, and sitemaps — essential SEO for news sites.",
    content:
      "SEO starts with metadata: unique titles, compelling descriptions, canonical URLs. The Next.js Metadata API generates these dynamically per article.\n\nJSON-LD with schema.org/NewsArticle helps Google understand your content. Add Open Graph and Twitter cards for social sharing.\n\nPerformance is a ranking factor: optimize images with next/image, lazy load, and prefer ISR over client-side fetching for public content.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1432888622747-4eb9a8f2c293"),
    author: "Chanh Dang",
  },
  {
    title: "Micro-interactions That Improve Reading Experience",
    slug: "micro-interactions-for-better-reading",
    description:
      "Subtle Framer Motion animations that make news sites feel premium, not noisy.",
    content:
      "Micro-interactions like card hover, scroll fade-in, and menu transitions feel premium when kept subtle — 150–300ms duration with natural easing.\n\nFramer Motion integrates well with React. Animate only transform and opacity to avoid layout thrashing.\n\nAlways respect prefers-reduced-motion for accessibility.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1558655146-d09347e92766"),
    author: "Chanh Dang",
  },
  {
    title: "Monetizing a Tech Blog from Zero to First Revenue",
    slug: "monetizing-tech-blog-from-zero",
    description:
      "Affiliate, sponsorship, and digital products — models that work for dev content.",
    content:
      "Tech blogs attract quality audiences when content solves real problems. Start with affiliate tools you actually use — authenticity beats high commission.\n\nSponsored posts need reach and engagement. Build an email list and social presence early to prove audience value.\n\nDigital products (templates, courses, component libraries) often have the best margins. Earn trust with free content before launching paid offers.",
    categorySlug: "khoi-nghiep",
    coverImage: cover("photo-1460925895917-afdab827c52f"),
    author: "Chanh Dang",
  },
  {
    title: "React 19: What's New for App Developers",
    slug: "react-19-whats-new-for-developers",
    description:
      "Actions, useOptimistic, and improved hydration — key React 19 updates explained.",
    content:
      "React 19 introduces Actions for form handling and mutations with built-in pending states. useOptimistic enables instant UI feedback before server confirmation.\n\nImproved hydration and error recovery reduce mismatch issues in SSR apps. Document metadata and styles can be rendered from components more cleanly.\n\nUpgrade incrementally: test in staging, update dependencies together, and watch for breaking changes in third-party libraries.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1633356122544-f134324a6cee"),
    author: "Chanh Dang",
  },
  {
    title: "Building Accessible Forms with Radix and Tailwind",
    slug: "accessible-forms-with-radix-and-tailwind",
    description:
      "Keyboard navigation, ARIA labels, and focus management for inclusive UI.",
    content:
      "Accessible forms start with semantic HTML: labels linked to inputs, clear error messages, and logical tab order.\n\nRadix UI primitives handle focus traps, keyboard navigation, and ARIA attributes out of the box. Tailwind styles the visual layer without breaking behavior.\n\nTest with keyboard-only navigation and screen readers. Accessibility is not optional for professional products.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1586717791821-3cc4400a1134"),
    author: "Chanh Dang",
  },
  {
    title: "Docker for Frontend Developers: A Practical Guide",
    slug: "docker-for-frontend-developers",
    description:
      "Containerize Next.js apps for consistent dev and production environments.",
    content:
      "Docker eliminates \"works on my machine\" problems. A Dockerfile for Next.js typically uses multi-stage builds: install deps, build, then run a minimal production image.\n\nUse docker-compose for local stacks with MongoDB, Redis, or other services. Keep images small with alpine bases and .dockerignore.\n\nCI/CD pipelines benefit from reproducible builds. Tag images by git SHA for traceability.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1605745341110-be787f38b4bd"),
    author: "Chanh Dang",
  },
  {
    title: "GraphQL vs REST: When to Choose What",
    slug: "graphql-vs-rest-when-to-choose",
    description:
      "Trade-offs between GraphQL and REST for modern web applications.",
    content:
      "REST is simple, cache-friendly, and well understood. It works great for CRUD APIs with predictable resource shapes.\n\nGraphQL shines when clients need flexible queries and multiple resources in one request. The cost is complexity: schema design, N+1 queries, and caching strategies.\n\nFor most Next.js apps with server components, REST or direct DB access is often enough. Choose GraphQL when mobile clients or third-party integrations need query flexibility.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1558494949-ef010cbdcc31"),
    author: "Chanh Dang",
  },
  {
    title: "Web Performance: Core Web Vitals in 2026",
    slug: "web-performance-core-web-vitals-2026",
    description:
      "LCP, INP, and CLS — how to measure and improve real-user performance.",
    content:
      "Core Web Vitals measure real user experience. LCP tracks largest content paint — optimize hero images and server response time.\n\nINP replaces FID for interaction responsiveness. Break up long tasks, defer non-critical JS, and use web workers for heavy computation.\n\nCLS measures layout stability — always set width/height on images and avoid injecting content above existing UI.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1461749280684-dccba630e2f6"),
    author: "Chanh Dang",
  },
  {
    title: "Design Systems That Scale with Your Team",
    slug: "design-systems-that-scale",
    description:
      "Tokens, components, and documentation patterns for growing product teams.",
    content:
      "A design system is more than a component library — it includes tokens (color, spacing, typography), patterns, and documentation.\n\nStart small: button, input, card, typography scale. Expand as patterns repeat across features.\n\nTools like Storybook and Figma libraries keep design and code in sync. Version the system and communicate breaking changes clearly.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1507725428909-ed77bf0fbc05"),
    author: "Chanh Dang",
  },
  {
    title: "Remote Team Culture for Startup Founders",
    slug: "remote-team-culture-for-startups",
    description:
      "Async communication, documentation, and trust in distributed teams.",
    content:
      "Remote teams need written culture: decisions documented, async updates over constant meetings. Notion, Linear, or similar tools become the source of truth.\n\nOverlap hours for sync discussion, async for deep work. Record important meetings for timezone coverage.\n\nTrust output over hours logged. Clear goals and weekly demos keep everyone aligned without micromanagement.",
    categorySlug: "khoi-nghiep",
    coverImage: cover("photo-1522071820081-009f0129c71c"),
    author: "Chanh Dang",
  },
  {
    title: "Securing Next.js API Routes in Production",
    slug: "securing-nextjs-api-routes",
    description:
      "Auth, rate limiting, input validation, and common security pitfalls.",
    content:
      "Never trust client input. Validate every payload with zod or similar on the server. Sanitize data before database queries.\n\nProtect admin routes with role checks server-side, not just client redirects. Use HTTP-only cookies for sessions when possible.\n\nRate limit public APIs to prevent abuse. Log suspicious activity and rotate secrets regularly. Keep dependencies updated for security patches.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1563986768609-322da13575f3"),
    author: "Chanh Dang",
  },
  {
    title: "Mobile-First News Layouts That Actually Work",
    slug: "mobile-first-news-layouts",
    description:
      "Responsive grids, touch targets, and readable typography on small screens.",
    content:
      "Mobile traffic dominates news sites. Design mobile-first: single column, large tap targets (min 44px), readable 16px+ body text.\n\nUse CSS Grid with auto-fit for responsive card layouts. Avoid horizontal scroll unless intentional.\n\nTest on real devices, not just browser DevTools. Performance on mid-range phones matters more than flagship benchmarks.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1512941937669-90a1bf58e72c"),
    author: "Chanh Dang",
  },
  {
    title: "Product-Led Growth for Developer Tools",
    slug: "product-led-growth-for-dev-tools",
    description:
      "Free tiers, docs, and community — how dev tools acquire users organically.",
    content:
      "Developer tools grow through product experience, not ads. A generous free tier lets users evaluate before buying.\n\nDocumentation is marketing. Quick start guides, copy-paste examples, and video walkthroughs reduce time-to-value.\n\nCommunity (Discord, GitHub discussions) creates feedback loops. Open source core with paid enterprise features is a proven model.",
    categorySlug: "khoi-nghiep",
    coverImage: cover("photo-1552664730-d307ca884978"),
    author: "Chanh Dang",
  },
  {
    title: "Open Source: Contributing Without Burnout",
    slug: "open-source-contributing-without-burnout",
    description:
      "Sustainable open source maintenance for indie developers and small teams.",
    content:
      "Open source maintenance is a marathon. Set boundaries: response times, scope of support, and when to say no.\n\nUse issue templates, CONTRIBUTING.md, and automated CI to reduce repetitive work. Bots for stale issues and dependency updates help.\n\nSponsorship (GitHub Sponsors, Open Collective) can fund maintenance. Transparency about capacity builds community understanding.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1551288049-bebda4e38f71"),
    author: "Chanh Dang",
  },
  {
    title: "CSS Grid Patterns for Editorial Layouts",
    slug: "css-grid-patterns-for-editorial-layouts",
    description:
      "Magazine-style layouts with CSS Grid — featured stories, sidebars, and breakpoints.",
    content:
      "CSS Grid enables editorial layouts that were once Photoshop-only. Define grid-template-areas for featured + sidebar + list patterns.\n\nUse minmax() and auto-fit for fluid columns without media query explosion. Subgrid (where supported) aligns nested content to parent grid lines.\n\nCombine Grid for macro layout and Flexbox for micro component alignment. Test at every breakpoint.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1618005182384-a83a8bd57fbe"),
    author: "Chanh Dang",
  },
  {
    title: "From Side Project to SaaS: Lessons Learned",
    slug: "from-side-project-to-saas",
    description:
      "Pricing, billing, support, and the hard parts nobody talks about.",
    content:
      "Turning a side project into SaaS means billing integration, customer support, uptime expectations, and legal basics (terms, privacy policy).\n\nStart with simple pricing: one plan, clear value. Add tiers when you understand what customers pay for.\n\nStripe handles payments; focus on product. Set up status pages and error monitoring before launch. Your first 10 paying customers teach more than 1000 free users.",
    categorySlug: "khoi-nghiep",
    coverImage: cover("photo-1556761175-b413da4baf72"),
    author: "Chanh Dang",
  },
  {
    title: "Edge Computing and the Future of Web Apps",
    slug: "edge-computing-and-web-apps",
    description:
      "Edge functions, CDN caching, and low-latency experiences worldwide.",
    content:
      "Edge computing runs code closer to users — lower latency for auth, personalization, and A/B tests. Vercel Edge Functions and Cloudflare Workers lead this space.\n\nNot everything belongs at the edge: heavy computation and large DB queries stay regional. Use edge for lightweight, cacheable logic.\n\nCombine edge middleware with ISR for globally fast pages with fresh data where it matters.",
    categorySlug: "cong-nghe",
    coverImage: cover("photo-1451187580459-43490279c0fa"),
    author: "Chanh Dang",
  },
  {
    title: "Writing Technical Content That Ranks on Google",
    slug: "technical-content-that-ranks",
    description:
      "Keyword research, structure, and E-E-A-T for developer blog posts.",
    content:
      "Technical SEO for dev blogs: target specific long-tail queries (\"how to X in Next.js 15\"). Answer the question in the first paragraph.\n\nStructure with H2/H3 headings matching search intent. Include code examples, screenshots, and updated dates.\n\nE-E-A-T (Experience, Expertise, Authoritativeness, Trust): show real project experience, link to sources, and keep content updated.",
    categorySlug: "lap-trinh",
    coverImage: cover("photo-1486312338219-ce68d2c6f44d"),
    author: "Chanh Dang",
  },
  {
    title: "Dark Mode Design: Beyond Inverting Colors",
    slug: "dark-mode-design-beyond-inverting",
    description:
      "Elevation, contrast ratios, and image treatment for polished dark themes.",
    content:
      "Dark mode is not white text on black. Use dark gray backgrounds (#09090b, #18181b) with layered elevation for depth.\n\nReduce contrast on large text blocks — pure white on pure black causes eye strain. Use zinc-100/zinc-200 for body text.\n\nImages may need slight opacity reduction or separate dark variants. Test charts and code blocks for readability in both themes.",
    categorySlug: "thiet-ke",
    coverImage: cover("photo-1614854262311-8c60df099a02"),
    author: "Chanh Dang",
  },
];
