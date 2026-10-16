import test from "node:test";
import assert from "node:assert/strict";
import { clearCookie, parseCookies, serializeCookie } from "../src/utils/cookies.js";

test("parseCookies reads several cookies and decodes values", () => {
  assert.deepEqual(parseCookies("a=1; b=hello%20world; c=%E2%9C%93"), { a: "1", b: "hello world", c: "✓" });
});

test("parseCookies handles empty, quoted, duplicate and malformed input", () => {
  assert.deepEqual(parseCookies(undefined), {});
  assert.deepEqual(parseCookies(""), {});
  assert.deepEqual(parseCookies('q="x y"'), { q: "x y" });
  assert.deepEqual(parseCookies("a=1; a=2"), { a: "1" });
  assert.deepEqual(parseCookies("novalue; =x; ok=1"), { ok: "1" });
  assert.deepEqual(parseCookies("bad=%E0%A4%A"), { bad: "%E0%A4%A" });
});

test("serializeCookie is HttpOnly, Path=/ and SameSite=Lax by default", () => {
  assert.equal(serializeCookie("t", "abc"), "t=abc; Path=/; HttpOnly; SameSite=Lax");
});

test("serializeCookie supports max age, secure and sameSite none", () => {
  assert.equal(serializeCookie("t", "a b", { maxAgeSeconds: 60.9, secure: true, sameSite: "none" }), "t=a%20b; Path=/; Max-Age=60; HttpOnly; Secure; SameSite=None");
});

test("clearCookie expires the cookie immediately", () => {
  assert.match(clearCookie("t"), /^t=; Path=\/; Max-Age=0; HttpOnly/);
});
