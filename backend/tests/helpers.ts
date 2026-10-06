import type { NextFunction, Request, Response } from "express";

export type FakeRes = Response & { statusCode: number; body: unknown; headers: Record<string, string> };

/** Minimal Express response double for unit tests. */
export function fakeRes(): FakeRes {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    locals: {} as Record<string, unknown>,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
  };
  return res as unknown as FakeRes;
}

export function fakeReq(init: { headers?: Record<string, string>; body?: unknown; ip?: string } = {}): Request {
  const headers = Object.fromEntries(Object.entries(init.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    body: init.body,
    ip: init.ip ?? "127.0.0.1",
    header: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

/** Returns a `next` function plus whatever it was called with. */
export function fakeNext() {
  const calls: unknown[][] = [];
  const next = ((...args: unknown[]) => {
    calls.push(args);
  }) as NextFunction;
  return { next, calls };
}
