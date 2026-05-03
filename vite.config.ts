import { defineConfig } from "vite";
import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const localSaveFile = resolve(process.cwd(), ".banjjakbada-local-save.json");
const localSaveTempFile = `${localSaveFile}.tmp`;
let localSaveQueue: Promise<void> = Promise.resolve();

export default defineConfig({
  plugins: [localSavePlugin()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5175,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5175,
    strictPort: true,
  },
});

function localSavePlugin() {
  return {
    name: "banjjakbada-local-save",
    configureServer(server: { middlewares: { use: (middleware: LocalMiddleware) => void } }) {
      server.middlewares.use(localSaveMiddleware);
    },
    configurePreviewServer(server: { middlewares: { use: (middleware: LocalMiddleware) => void } }) {
      server.middlewares.use(localSaveMiddleware);
    },
  };
}

type LocalRequest = {
  method?: string;
  url?: string;
  on: (event: "data" | "end" | "error", callback: (chunk?: Buffer) => void) => void;
};

type LocalResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

type LocalMiddleware = (request: LocalRequest, response: LocalResponse, next: () => void) => void;

async function localSaveMiddleware(request: LocalRequest, response: LocalResponse, next: () => void) {
  if (!request.url?.startsWith("/api/local-save")) {
    next();
    return;
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method === "GET") {
    response.end(JSON.stringify(await readLocalSaveStore()));
    return;
  }

  if (request.method === "POST") {
    try {
      const body = JSON.parse(await readRequestBody(request)) as { key?: string; value?: unknown };
      if (!body.key?.startsWith("banjjakbada-save") || typeof body.value !== "object" || body.value === null) {
        response.statusCode = 400;
        response.end(JSON.stringify({ ok: false }));
        return;
      }

      const result = await queueLocalSaveUpdate(body.key, body.value);
      if (result.keptExisting) {
        response.end(JSON.stringify({ ok: true, keptExisting: true }));
        return;
      }
      response.end(JSON.stringify({ ok: true }));
    } catch {
      response.statusCode = 400;
      response.end(JSON.stringify({ ok: false }));
    }
    return;
  }

  response.statusCode = 405;
  response.end(JSON.stringify({ ok: false }));
}

async function readLocalSaveStore(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(localSaveFile, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function queueLocalSaveUpdate(key: string, value: unknown): Promise<{ keptExisting: boolean }> {
  const result = { keptExisting: false };
  const next = localSaveQueue.then(async () => {
    const store = await readLocalSaveStore();
    const current = store[key];
    if (progressScore(current) > progressScore(value)) {
      result.keptExisting = true;
      return;
    }

    store[key] = value;
    await writeLocalSaveStore(store);
  });
  localSaveQueue = next.catch(() => undefined);
  await next;
  return result;
}

async function writeLocalSaveStore(store: Record<string, unknown>): Promise<void> {
  await writeFile(localSaveTempFile, JSON.stringify(store, null, 2), "utf8");
  await rename(localSaveTempFile, localSaveFile);
}

function readRequestBody(request: LocalRequest): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
    });
    request.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    request.on("error", () => reject(new Error("Could not read request body")));
  });
}

function progressScore(value: unknown): number {
  if (!value || typeof value !== "object") {
    return 0;
  }

  const state = value as {
    level?: unknown;
    xp?: unknown;
    shells?: unknown;
    collection?: unknown;
    ownedItemIds?: unknown;
    unlockedAreaIds?: unknown;
  };
  const level = typeof state.level === "number" ? state.level : 1;
  const xp = typeof state.xp === "number" ? state.xp : 0;
  const shells = typeof state.shells === "number" ? state.shells : 0;
  const collectionCount =
    state.collection && typeof state.collection === "object"
      ? Object.values(state.collection).reduce((sum, count) => sum + (typeof count === "number" ? count : 0), 0)
      : 0;
  const ownedCount = Array.isArray(state.ownedItemIds) ? state.ownedItemIds.length : 0;
  const areaCount = Array.isArray(state.unlockedAreaIds) ? state.unlockedAreaIds.length : 0;
  return level * 100000 + xp * 100 + collectionCount * 50 + ownedCount * 20 + areaCount * 20 + shells;
}
