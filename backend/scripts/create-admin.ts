// Creates an admin account (or promotes an existing one).
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Str0ng-pass' npm run admin:create
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/modules/auth/password.js";
import { isEmail, isStrongPassword } from "../src/validators/primitives.js";

function fail(message: string): never {
  console.error(`[admin:create] ${message}`);
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const firstName = process.env.ADMIN_FIRST_NAME?.trim() || "Admin";

if (!email || !isEmail(email)) fail("Set ADMIN_EMAIL to a valid email address.");
if (!password || !isStrongPassword(password)) fail("Set ADMIN_PASSWORD (8-72 characters with at least one letter and one number).");

try {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
    console.log(`[admin:create] ${email} already existed and is now an ADMIN (password unchanged).`);
  } else {
    await prisma.user.create({ data: { email, passwordHash: await hashPassword(password), firstName, role: "ADMIN" } });
    console.log(`[admin:create] Created admin ${email}.`);
  }
} finally {
  await prisma.$disconnect();
}
