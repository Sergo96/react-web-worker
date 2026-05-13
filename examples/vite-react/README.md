# Vite + React example

From the **repository root**:

```bash
npm install
npm run build
cd examples/vite-react
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

The example depends on the local package via `"react-web-worker": "file:../.."` in `package.json`, so the library must be built at least once before `npm install` in this folder resolves types and `dist`.
