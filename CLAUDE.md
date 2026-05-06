# WebGL & Chart Demo

> Next.js 16 App Router · TypeScript · Five pages: WebGL 3D, 2D charts, 3D charts, global heatmap globe, AI chat. All visualization is client-side. Deployed on AWS Amplify → **https://webgl.intuaos.com**

## Commands

```bash
npm run dev     # dev server → localhost:3000
npm run build   # must exit 0 before every commit
npm run lint    # ESLint — fix before committing
ollama serve    # required for AI features (localhost:11434)
```

**Harness DoD baseline:** `npm run build` AND `npm run lint` both exit 0.

## References

- @docs/architecture.md — routes, components, API map, tech stack
- @docs/conventions.md — design tokens, coding rules, deployment
- @.claude/rules/next-ssr.md — critical SSR / client-component rules (read first)

## Harness Workflow

```
/harness-plan create   → plan features into Plans.md
/breezing all          → execute cc:TODO tasks (Lead → Worker → Reviewer)
/harness-plan sync     → reconcile Plans.md with git log
```

Active tasks → [Plans.md](Plans.md)
