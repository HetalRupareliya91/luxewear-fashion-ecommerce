import type { IncomingMessage } from "node:http";

export type WithRawBody = IncomingMessage & { rawBody?: Buffer };

/** Pass as `express.json({ verify: captureRawBody })` so webhooks can check a signature over the exact bytes sent. */
export function captureRawBody(req: IncomingMessage, _res: unknown, buf: Buffer): void {
  (req as WithRawBody).rawBody = buf;
}
