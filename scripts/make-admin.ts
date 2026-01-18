import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

type CliArgs = {
  email?: string;
  username?: string;
  role?: "admin" | "user";
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key || !value) continue;
    if (key === "--email") args.email = value;
    if (key === "--username") args.username = value;
    if (key === "--role" && (value === "admin" || value === "user")) args.role = value;
  }
  return args;
}

function loadEnvFile(filename: string) {
  if (!existsSync(filename)) return;
  const content = readFileSync(filename, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    const rawValue = trimmed.slice(eqIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  });
}

async function run() {
  const { email, username, role = "admin" } = parseArgs(process.argv.slice(2));
  if (!process.env.MONGODB_URI) {
    const cwd = process.cwd();
    loadEnvFile(join(cwd, ".env.local"));
    loadEnvFile(join(cwd, ".env"));
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in environment.");
    process.exit(1);
  }
  if (!email && !username) {
    console.error("Usage: pnpm admin:make -- --email someone@example.com");
    console.error("   or: pnpm admin:make -- --username ten_dang_nhap");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("musicdb");

  const filter = email ? { email } : { username };
  const result = await db.collection("users").updateOne(filter, {
    $set: { role, updatedAt: new Date() },
  });

  await client.close();

  if (!result.matchedCount) {
    console.error("User not found. Create the user first.");
    process.exit(1);
  }

  console.log(`Updated role to "${role}" for ${email || username}.`);
}

run().catch((error) => {
  console.error("Failed to update role:", error);
  process.exit(1);
});
