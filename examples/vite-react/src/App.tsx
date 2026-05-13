import { useCallback, useState } from "react";
import { useBlobWorker } from "react-web-worker";

export default function App() {
  const workerFn = useCallback((n: number) => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i % 7;
    return sum;
  }, []);

  const { result, isWorking, runWorker } = useBlobWorker(workerFn);
  const [n, setN] = useState(10_000_000);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 480 }}>
      <h1 style={{ marginTop: 0 }}>react-web-worker</h1>
      <p style={{ color: "#444", fontSize: 14 }}>
        CPU work runs in a Web Worker (Blob URL). Tweak iterations and run.
      </p>
      <label style={{ display: "block", marginBottom: 12 }}>
        Iterations{" "}
        <input
          type="number"
          min={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value) || 1)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </label>
      <button
        type="button"
        disabled={isWorking}
        onClick={() => runWorker(n)}
        style={{ padding: "10px 16px", fontSize: 16 }}
      >
        {isWorking ? "Running…" : "Run in worker"}
      </button>
      {result != null && (
        <p style={{ marginTop: 16 }}>
          <strong>Result:</strong> {result}
        </p>
      )}
    </div>
  );
}
