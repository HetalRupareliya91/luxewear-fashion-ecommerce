import assert from "node:assert/strict";
import { test } from "node:test";
import express from "express";
import { captureRawBody, type WithRawBody } from "../src/middleware/rawBody.js";
import { startServer } from "./helpers/testServer.js";

test("the exact request bytes are kept next to the parsed body", async () => {
  const server = await startServer((app) => {
    app.post("/echo", (req, res) => {
      res.json({ raw: (req as unknown as WithRawBody).rawBody?.toString("utf8"), parsed: req.body });
    });
  });
  try {
    const raw = '{ "a":   1 }';
    const res = await server.call("POST", "/echo", { rawBody: raw });
    assert.equal(res.json.raw, raw);
    assert.deepEqual(res.json.parsed, { a: 1 });
  } finally {
    await server.close();
  }
});

test("captureRawBody is a function with the verify signature", () => {
  assert.equal(typeof captureRawBody, "function");
  assert.equal(typeof express.json({ verify: captureRawBody }), "function");
});
