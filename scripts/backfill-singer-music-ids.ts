import { MongoClient, ObjectId } from "mongodb";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type CliOptions = {
  dryRun: boolean;
  singerId?: string;
};

const DB_NAME = "musicdb";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--dry-run") options.dryRun = true;
    if (key === "--singer-id" && value) options.singerId = value;
  }
  return options;
}

function normalizeObjectIds(ids: unknown[]): ObjectId[] {
  return ids
    .map((id) => {
      if (id instanceof ObjectId) return id;
      if (typeof id === "string" && ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      return null;
    })
    .filter((id): id is ObjectId => Boolean(id));
}

function areIdArraysEqual(left: ObjectId[], right: ObjectId[]) {
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    if (left[i].toString() !== right[i].toString()) {
      return false;
    }
  }
  return true;
}

async function run() {
  const { dryRun, singerId } = parseArgs(process.argv.slice(2));

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

  let singerObjectId: ObjectId | undefined;
  if (singerId) {
    if (!ObjectId.isValid(singerId)) {
      console.error("Invalid --singer-id value.");
      process.exit(1);
    }
    singerObjectId = new ObjectId(singerId);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(DB_NAME);
  const singersCollection = db.collection("singers");
  const musicsCollection = db.collection("musics");

  const singerFilter = singerObjectId ? { _id: singerObjectId } : {};
  const singers = await singersCollection
    .find(singerFilter, { projection: { singer: 1, musicIds: 1 } })
    .toArray();

  let scanned = 0;
  let changed = 0;
  let addedIds = 0;

  for (const singer of singers) {
    scanned += 1;
    const singerName = String(singer.singer ?? "").trim();
    const existingIds = Array.isArray(singer.musicIds)
      ? normalizeObjectIds(singer.musicIds)
      : [];

    const foundMusicIds = new Map<string, ObjectId>();
    for (const id of existingIds) {
      foundMusicIds.set(id.toString(), id);
    }

    if (singerName) {
      const singerRegex = new RegExp(
        `(^|,)\\s*${escapeRegex(singerName)}\\s*(,|$)`,
        "i"
      );

      const legacyMusics = await musicsCollection
        .find(
          {
            $or: [
              { singerId: singer._id },
              { singer: singerName },
              { singer: singerRegex },
            ],
          },
          { projection: { _id: 1, createdAt: 1 } }
        )
        .sort({ createdAt: 1, _id: 1 })
        .toArray();

      for (const music of legacyMusics) {
        const id = music._id;
        if (id instanceof ObjectId && !foundMusicIds.has(id.toString())) {
          foundMusicIds.set(id.toString(), id);
        }
      }
    }

    const mergedIds = Array.from(foundMusicIds.values());
    if (areIdArraysEqual(existingIds, mergedIds)) {
      continue;
    }

    changed += 1;
    addedIds += Math.max(mergedIds.length - existingIds.length, 0);

    const singerLabel = singerName || singer._id.toString();
    console.log(
      `[${dryRun ? "DRY" : "WRITE"}] ${singerLabel}: ${existingIds.length} -> ${mergedIds.length}`
    );

    if (!dryRun) {
      await singersCollection.updateOne(
        { _id: singer._id },
        { $set: { musicIds: mergedIds, updatedAt: new Date() } }
      );
    }
  }

  await client.close();

  console.log("Done.");
  console.log(`Scanned singers: ${scanned}`);
  console.log(`Updated singers: ${changed}`);
  console.log(`Added musicIds: ${addedIds}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
}

run().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
