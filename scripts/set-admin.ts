/**
 * Script to set admin role for a user
 * 
 * Usage:
 * 1. Set ADMIN_EMAIL in .env.local or pass as argument
 * 2. Run: npx tsx scripts/set-admin.ts
 *    Or: npx tsx scripts/set-admin.ts your-email@example.com
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";

// Try to load .env.local file
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const envFile = readFileSync(envPath, "utf-8");
    const envVars: Record<string, string> = {};
    
    envFile.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").trim();
          // Remove quotes if present
          envVars[key.trim()] = value.replace(/^["']|["']$/g, "");
        }
      }
    });
    
    Object.assign(process.env, envVars);
  } catch {
    // .env.local not found, will use process.env
  }
}

// Load .env.local if exists
loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.argv[2] || process.env.ADMIN_EMAIL;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  console.error("\nCách khắc phục:");
  console.error("1. Đảm bảo file .env.local có MONGODB_URI");
  console.error("2. Hoặc export biến môi trường:");
  console.error("   export MONGODB_URI='your-mongodb-uri'");
  console.error("3. Hoặc chạy với biến môi trường:");
  console.error("   MONGODB_URI='your-uri' npx tsx scripts/set-admin.ts your-email@example.com");
  process.exit(1);
}

if (!ADMIN_EMAIL) {
  console.error("❌ Please provide email address:");
  console.error("   npx tsx scripts/set-admin.ts your-email@example.com");
  console.error("   Or set ADMIN_EMAIL in .env.local");
  process.exit(1);
}

async function setAdmin() {
  let client: MongoClient | null = null;

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("musicdb");
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email: ADMIN_EMAIL });

    if (!user) {
      console.error(`❌ User with email "${ADMIN_EMAIL}" not found`);
      console.log("\nAvailable users:");
      const allUsers = await usersCollection
        .find({}, { projection: { email: 1, username: 1, role: 1 } })
        .toArray();
      allUsers.forEach((u) => {
        console.log(`  - ${u.email || u.username} (role: ${u.role || "user"})`);
      });
      process.exit(1);
    }

    // Check current role
    if (user.role === "admin") {
      console.log(`✅ User "${ADMIN_EMAIL}" is already an admin`);
      process.exit(0);
    }

    // Update role to admin
    const result = await usersCollection.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          role: "admin",
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Successfully set admin role for "${ADMIN_EMAIL}"`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Previous role: ${user.role || "user"}`);
      console.log(`   New role: admin`);
    } else {
      console.error("❌ Failed to update user role");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("✅ Disconnected from MongoDB");
    }
  }
}

setAdmin();

