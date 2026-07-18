/**
 * Minimal structured logger. Keeps a consistent shape across server and
 * client, and stays quiet for debug logs outside development.
 */
type Level = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV !== "production";

function emit(level: Level, scope: string, message: string, meta?: unknown) {
  if (level === "debug" && !isDev) return;
  const prefix = `[the-after:${scope}]`;
  const args: unknown[] = [prefix, message];
  if (meta !== undefined) args.push(meta);

  switch (level) {
    case "error":
      console.error(...args);
      break;
    case "warn":
      console.warn(...args);
      break;
    default:
      console.log(...args);
  }
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, meta?: unknown) => emit("debug", scope, message, meta),
    info: (message: string, meta?: unknown) => emit("info", scope, message, meta),
    warn: (message: string, meta?: unknown) => emit("warn", scope, message, meta),
    error: (message: string, meta?: unknown) => emit("error", scope, message, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;
