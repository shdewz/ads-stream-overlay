// Minimal ambient declaration for the nodecg global available in graphics.
// The full NodeCG API is more extensive; only what this bundle uses is typed.

interface NodeCGReplicant<T> {
  value: T | undefined;
  on(event: 'change', handler: (newValue: T, oldValue: T | undefined) => void): this;
  removeListener(event: 'change', handler: (newValue: T, oldValue: T | undefined) => void): this;
}

interface NodeCGClient {
  Replicant<T>(name: string, namespace?: string, options?: { defaultValue?: T }): NodeCGReplicant<T>;
  Replicant<T>(name: string, options?: { defaultValue?: T }): NodeCGReplicant<T>;
}

declare const nodecg: NodeCGClient;
