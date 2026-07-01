"use client";

import { useCallback, useEffect, useRef } from "react";

interface WorkerEnvelope<T> {
  id: string;
  ok: boolean;
  result?: T;
  error?: string;
}

export function useRegexWorker() {
  const workers = useRef(new Set<Worker>());

  useEffect(() => {
    const activeWorkers = workers.current;
    return () => {
      activeWorkers.forEach((worker) => worker.terminate());
      activeWorkers.clear();
    };
  }, []);

  const run = useCallback(<T,>(
    payload: Record<string, unknown>,
    timeoutMs = 300
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const worker = new Worker("/regex-worker.js");
      workers.current.add(worker);
      const id = crypto.randomUUID();
      const timer = window.setTimeout(() => {
        worker.terminate();
        workers.current.delete(worker);
        reject(new Error("REGEX_TIMEOUT"));
      }, timeoutMs);

      worker.onmessage = (event: MessageEvent<WorkerEnvelope<T>>) => {
        if (event.data.id !== id) return;
        window.clearTimeout(timer);
        worker.terminate();
        workers.current.delete(worker);
        if (event.data.ok && event.data.result !== undefined) resolve(event.data.result);
        else reject(new Error(event.data.error || "REGEX_ERROR"));
      };
      worker.onerror = () => {
        window.clearTimeout(timer);
        worker.terminate();
        workers.current.delete(worker);
        reject(new Error("REGEX_WORKER_ERROR"));
      };
      worker.postMessage({ ...payload, id });
    });
  }, []);

  const cancelAll = useCallback(() => {
    workers.current.forEach((worker) => worker.terminate());
    workers.current.clear();
  }, []);

  return { run, cancelAll };
}
