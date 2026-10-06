import "dotenv/config";
import { parseEnv } from "./parseEnv.js";

export const env = parseEnv(process.env);
