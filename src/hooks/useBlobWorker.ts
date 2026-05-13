import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Runs `workerFunction` inside a Web Worker created from an inline Blob script.
 * Pass a **stable** function reference (e.g. `useCallback`) to avoid tearing down
 * the worker on every render.
 */
export function useBlobWorker<TInput, TOutput>(
  workerFunction: (input: TInput) => TOutput
) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<TOutput | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const workerScript = useMemo(() => {
    const functionString = workerFunction.toString();
    return `
      self.onmessage = function(event) {
        const input = event.data;
        const workerFunction = ${functionString};
        const output = workerFunction(input);
        self.postMessage(output);
      };
    `;
  }, [workerFunction]);

  useEffect(() => {
    const blob = new Blob([workerScript], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<TOutput>) => {
      setResult(event.data);
      setIsWorking(false);
    };

    return () => {
      worker.terminate();
      URL.revokeObjectURL(url);
      workerRef.current = null;
    };
  }, [workerScript]);

  const runWorker = (input: TInput) => {
    if (workerRef.current) {
      setIsWorking(true);
      setResult(null);
      workerRef.current.postMessage(input);
    }
  };

  return { result, isWorking, runWorker };
}
