# Cloudflare Workers + React Fullstack Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/schrodingercats-sudo/bitesight-ar-digital-menu)

A production-ready fullstack application template built with Cloudflare Workers, React, TypeScript, and shadcn/ui. Features Durable Objects for scalable stateful entities (e.g., Users, Chats), Hono for routing, TanStack Query for data fetching, and Tailwind CSS for styling. Perfect for real-time apps like chat systems.

## ✨ Key Features

- **Cloudflare Durable Objects**: One instance per entity with automatic indexing and seeding for lists (users, chats).
- **Type-Safe API**: Shared types between frontend and backend with full autocomplete.
- **Modern React Stack**: shadcn/ui components, TanStack Query, React Router, immersive theming.
- **Serverless Backend**: Hono routes, CORS, error handling, client error reporting.
- **Responsive Design**: Dark/light themes, mobile-first, Tailwind with custom animations.
- **Development Ready**: Hot reload, TypeScript strict mode, ESLint, Bun scripts.
- **Production Optimized**: Automatic SPA handling, Cloudflare observability.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, TanStack Query, React Router, Sonner (toasts), Framer Motion.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (GlobalDurableObject), Bun.
- **State & Data**: Immer, Zustand (ready), shared types.
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript 5.

## 🚀 Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed.
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install/) installed and logged in: `wrangler login`.

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd bitesight-ar-menu-hhjci5mb-0maxyjklcxaa
   bun install
   ```

3. **Generate Worker Types** (one-time):
   ```bash
   bun run cf-typegen
   ```

4. **Run Locally**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

## 🧪 Local Development

- **Frontend HMR**: Auto-reloads on `src/` changes.
- **Backend Routes**: Available at `/api/*` (e.g., `http://localhost:3000/api/health`).
- **Seed Data**: Mock users/chats auto-seed on first `/api/users` or `/api/chats` call.
- **Preview Build**:
  ```bash
  bun run build
  bun run preview
  ```
- **Lint**:
  ```bash
  bun run lint
  ```

### API Examples

Test with `curl` or browser:

```bash
# List users (seeds on first call)
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name": "Alice"}'

# List chats
curl http://localhost:3000/api/chats

# Send message
curl -X POST http://localhost:3000/api/chats/c1/messages -H "Content-Type: application/json" -d '{"userId": "u1", "text": "Hello!"}'
```

Frontend uses `api(path)` helper from `@/lib/api-client.ts`.

## 📁 Project Structure

```
├── src/                 # React app
│   ├── components/ui/   # shadcn/ui components
│   ├── pages/           # Route pages
│   └── lib/             # Utilities, API client
├── worker/              # Cloudflare Worker
│   ├── entities.ts      # Extend for new entities (UserEntity, ChatBoardEntity)
│   └── user-routes.ts   # Add your API routes here
├── shared/              # Shared types & mocks
└── ...                  # Configs (Vite, Tailwind, Wrangler)
```

**Backend Customization**:
- Add routes in `worker/user-routes.ts`.
- Extend entities in `worker/entities.ts` (see examples).
- Never edit `worker/index.ts` or `worker/core-utils.ts`.

**Frontend Customization**:
- Replace `src/pages/HomePage.tsx`.
- Use shadcn components: `npx shadcn-ui@latest add <component>`.
- Queries: Use TanStack Query with `api()` helper.

## ☁️ Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

Or use the dashboard:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/schrodingercats-sudo/bitesight-ar-digital-menu)

**Notes**:
- Free tier supported.
- Durable Objects use SQLite (auto-migrates).
- Assets served as SPA.
- Custom domain: Update `wrangler.jsonc`.

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. `bun run dev`.
4. Add features/PRs.

## 📄 License

MIT. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Issues: GitHub.

Built with ❤️ for Cloudflare Workers.