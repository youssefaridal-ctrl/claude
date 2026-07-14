import * as FileSystem from 'expo-file-system';

export interface CapturedError {
  message: string;
  stack: string;
  timestamp: string;
  type: string;
}

let capturedError: CapturedError | null = null;
let listeners: Array<(err: CapturedError) => void> = [];

export function getCapturedError(): CapturedError | null {
  return capturedError;
}

export function onErrorCaptured(cb: (err: CapturedError) => void): () => void {
  listeners.push(cb);
  if (capturedError) cb(capturedError);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function record(err: CapturedError): void {
  if (capturedError) return; // keep first error only
  capturedError = err;
  console.error(`[DiagnosticMode][${err.type}] ${err.message}\n${err.stack}`);
  for (const cb of listeners) cb(err);
  persistToFile(err);
}

function persistToFile(err: CapturedError): void {
  const path = `${FileSystem.documentDirectory}startup-error.txt`;
  const content = [
    '=== Finance Bag Startup Error ===',
    `Timestamp : ${err.timestamp}`,
    `Type      : ${err.type}`,
    `Message   : ${err.message}`,
    '',
    'Stack Trace:',
    err.stack,
  ].join('\n');

  FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 }).catch(
    (writeErr) => {
      console.error('[DiagnosticMode] Failed to write startup-error.txt:', writeErr);
    }
  );
}

function makeEntry(type: string, error: unknown): CapturedError {
  const ts = new Date().toISOString();
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack ?? '', timestamp: ts, type };
  }
  const msg = String(error);
  return { message: msg, stack: '', timestamp: ts, type };
}

export function installGlobalHandlers(): void {
  // JS exceptions (non-fatal and fatal)
  if (global.ErrorUtils) {
    const prev = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      record(makeEntry(isFatal ? 'FatalJSError' : 'JSError', error));
      prev?.(error, isFatal);
    });
  }

  // Unhandled Promise rejections — Hermes surfaces these through ErrorUtils already,
  // so only wire up the web-style handler on non-Hermes runtimes.
  if (typeof (global as unknown as Record<string, unknown>).HermesInternal === 'undefined') {
    const prev = (global as unknown as Record<string, unknown>).onunhandledrejection;
    (
      global as unknown as Record<string, (ev: PromiseRejectionEvent) => void>
    ).onunhandledrejection = (ev: PromiseRejectionEvent) => {
      record(makeEntry('UnhandledRejection', ev.reason));
      if (prev) (prev as (ev: PromiseRejectionEvent) => void)(ev);
    };
  }

  console.log('[DiagnosticMode] Global error handlers installed.');
}

export function reportError(type: string, error: unknown): void {
  record(makeEntry(type, error));
}
