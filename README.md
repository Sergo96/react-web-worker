# react-web-worker

React hook for running a **synchronous** function in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) using an inline script (Blob URL). Useful for CPU-heavy work without blocking the UI thread.

## Install

```bash
npm install react-web-worker
```

Peer dependency: **React 17+**.

## Usage

```tsx
import { useCallback } from "react";
import { useBlobWorker } from "react-web-worker";

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

A minimal Vite + React demo lives in [`examples/vite-react`](./examples/vite-react). Build the library from the repo root, then follow that folder’s README to run the dev server.

## License

MIT — see [LICENSE](./LICENSE).
