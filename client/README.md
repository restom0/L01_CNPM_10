# Client

React + Vite front end for Smart Garden CMS.

Use the root [README](../README.md) for architecture, setup, API routes, and data-model notes.

## Local Commands

```bash
npm install
npm run dev
npm test
npm run lint
```

## Demo Mode

Use `demo` / `demo` on the login page to run the main dashboard flow without a backend.
The client stores `demo-admin-token` and API calls return backend-shaped responses derived from
`src/data/demoRawData.js`.
