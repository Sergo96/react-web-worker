import { afterEach, vi } from "vitest";

if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-worker");
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = vi.fn();
}

/**
 * Minimal Web Worker stand-in for unit tests. Does not execute the Blob script;
 * tests call {@link MockWorker.simulateMessage} to mimic `postMessage` replies.
 */
export class MockWorker {
  static instances: MockWorker[] = [];

  onmessage: ((event: MessageEvent) => void) | null = null;

  readonly terminate = vi.fn(() => {
    const i = MockWorker.instances.indexOf(this);
    if (i !== -1) MockWorker.instances.splice(i, 1);
  });

  readonly postMessage = vi.fn((_data: unknown) => {});

  constructor(public scriptUrl: string | URL) {
    MockWorker.instances.push(this);
  }

  simulateMessage(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

vi.stubGlobal("Worker", MockWorker);

afterEach(() => {
  MockWorker.instances.splice(0, MockWorker.instances.length);
  vi.clearAllMocks();
});
