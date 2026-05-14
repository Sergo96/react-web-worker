# Offthread

**Offthread** is a tiny React hook for moving **synchronous** work into a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) using an inline Blob script, so the UI thread stays responsive.

Install from npm as **`offthread`**. (The name `react-web-worker` is blocked by the registry as too similar to [`react-webworker`](https://www.npmjs.com/package/react-webworker).)

## Install

```bash
npm install offthread
```

Peer dependency: **React 17+**.

## Usage

```tsx
import { useCallback } from "react";
import { useBlobWorker } from "offthread";

function Demo() {
  const workerFn = useCallback((n: number) => {
    // Must be self-contained: no closures over component scope.
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i;
    return sum;
  }, []);

  const { result, isWorking, runWorker } = useBlobWorker(workerFn);

  return (
    <div>
      <button type="button" onClick={() => runWorker(50_000_000)} disabled={isWorking}>
        {isWorking ? "Working…" : "Run in worker"}
      </button>
      {result != null && <p>Result: {result}</p>}
    </div>
  );
}
```

## API

### `useBlobWorker(workerFunction)`

- **`workerFunction`**: `(input: TInput) => TOutput` — must be a **stable** reference (for example from `useCallback`). If the reference changes, the worker is torn down and recreated.
- **Returns**
  - **`result`**: `TOutput | null` — last successful message from the worker, or `null` before the first run / after starting a new run.
  - **`isWorking`**: `boolean` — `true` after `runWorker` until the worker posts a result.
  - **`runWorker`**: `(input: TInput) => void` — sends `input` to the worker via `postMessage`.

The worker runs your function **synchronously** on the worker thread. It does not await Promises.

## Limitations

- **Structured clone**: `input` and `output` must be values that [`postMessage` can clone](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
- **No closures**: the function is serialized with `.toString()`, so outer variables are not available inside the worker.
- **Minification**: aggressive bundlers can change how the serialized function behaves; test your production build.
- **CSP**: environments that block `blob:` workers may require a different worker strategy.

## Development

```bash
npm install
npm test
npm run build
```

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Example app

A minimal Vite + React demo for **Offthread** lives in [`examples/vite-react`](./examples/vite-react). Build the library from the repo root, then follow that folder’s README to run the dev server.

## License

MIT — see [LICENSE](./LICENSE).
