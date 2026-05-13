import { act, renderHook } from "@testing-library/react";
import { useCallback } from "react";
import { describe, expect, it } from "vitest";
import { useBlobWorker } from "../src/hooks/useBlobWorker";
import { MockWorker } from "./setup";

describe("useBlobWorker", () => {
  it("starts idle with null result", () => {
    const { result } = renderHook(() =>
      useBlobWorker(useCallback((x: number) => x * 2, []))
    );
    expect(result.current.result).toBeNull();
    expect(result.current.isWorking).toBe(false);
  });

  it("sets isWorking while waiting and applies result when the worker responds", () => {
    const { result } = renderHook(() =>
      useBlobWorker(useCallback((x: number) => x * 2, []))
    );

    act(() => {
      result.current.runWorker(3);
    });

    expect(result.current.isWorking).toBe(true);
    expect(result.current.result).toBeNull();

    const worker = MockWorker.instances.at(-1);
    expect(worker).toBeDefined();

    act(() => {
      worker!.simulateMessage(6);
    });

    expect(result.current.isWorking).toBe(false);
    expect(result.current.result).toBe(6);
  });

  it("terminates the worker on unmount", () => {
    const { unmount } = renderHook(() =>
      useBlobWorker(useCallback((x: number) => x, []))
    );

    const worker = MockWorker.instances[0];
    expect(worker).toBeDefined();

    unmount();
    expect(worker!.terminate).toHaveBeenCalled();
  });

  it("recreates the worker when the worker function identity changes", () => {
    const fn1 = (x: number) => x + 1;
    const fn2 = (x: number) => x + 2;

    const { rerender, result } = renderHook(
      ({ which }: { which: "a" | "b" }) =>
        useBlobWorker(which === "a" ? fn1 : fn2),
      { initialProps: { which: "a" as const } }
    );

    const first = MockWorker.instances[0];
    expect(first).toBeDefined();

    rerender({ which: "b" });

    expect(first.terminate).toHaveBeenCalled();
    expect(MockWorker.instances[0]).toBeDefined();
    expect(MockWorker.instances[0]).not.toBe(first);

    act(() => {
      result.current.runWorker(0);
    });
    expect(MockWorker.instances[0]!.postMessage).toHaveBeenCalledWith(0);
  });
});
